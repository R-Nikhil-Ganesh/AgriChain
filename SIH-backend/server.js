const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const { getContract } = require('./fabric-connector');

// --- 1. INITIALIZE FIREBASE ADMIN SDK ---
const serviceAccount = require('./firebase-service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const app = express();
const PORT = process.env.PORT || 3000;

// --- 2. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ success: false, message: 'Unauthorized: No token provided' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Add user info (like UID) to the request object
    next();
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

// --- 3. API ROUTES ---

// Initialize Fabric connection once and reuse it
let fabricContract;

// We use an immediately-invoked function expression (IIFE) to connect on startup
(async () => {
    const { contract, gateway } = await getContract();
    fabricContract = contract;
    
    // Gracefully disconnect from the gateway on server shutdown
    process.on('SIGINT', () => {
        console.log('Disconnecting from Fabric gateway...');
        gateway.disconnect();
        process.exit(0);
    });
})();


// Apply the token verification middleware to all routes that require authentication
app.use('/api', verifyFirebaseToken);

// Create a new produce batch
app.post('/api/produce', async (req, res) => {
  try {
    const ownerId = req.user?.uid; // farmer Firebase UID from token
    const { cropType, quantity, unit, farmerName, farmLocation, farmID } = req.body;

    // Validate inputs (farmID still required for your app logic; not sent to chaincode)
    if (!ownerId || !cropType || !quantity || !unit || !farmerName || !farmLocation || !farmID) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: ownerId (auth), cropType, quantity, unit, farmerName, farmLocation, farmID'
      });
    }

    const assetID = `BATCH-${Date.now()}`;
    console.log(`Submitting 'CreateAsset' tx for asset ${assetID}`);
    console.log('Batch data (received):', { ownerId, cropType, quantity, unit, farmerName, farmLocation, farmID });

    // Match chaincode signature:
    // CreateAsset(ctx, id string, cropType string, quantity int, unit string, farmerUID string, farmerName string, farmLocation string)
    const args = [
      assetID,
      String(cropType),
      String(quantity),
      String(unit),
      String(ownerId),      // farmerFirebaseUID (ownerId from token) — this is the important fix
      String(farmerName),
      String(farmLocation)
    ];

    console.log('Submitting args to chaincode:', args);

    try {
      await fabricContract.submitTransaction('CreateAsset', ...args);
    } catch (chainErr) {
      console.error('Chaincode submitTransaction error:', chainErr && chainErr.stack ? chainErr.stack : chainErr);
      return res.status(500).json({ success: false, message: String(chainErr) });
    }

    // Optionally: persist farmID to your DB here if you want it stored off-chain

    res.status(201).json({ success: true, assetID });
  } catch (error) {
    console.error('Failed to submit CreateAsset transaction:', error && error.stack ? error.stack : error);
    res.status(500).json({ success: false, message: (error && error.toString()) || 'Unknown error' });
  }
});


// Get batches created by the currently logged-in farmer
app.get('/api/produce/my-batches', async (req, res) => {
  try {
    const ownerId = req.user?.uid;
    if (!ownerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: missing user id' });
    }

    console.log(`Fetching my-batches for farmer UID: ${ownerId}`);

    if (!fabricContract) {
      console.error('Fabric contract not initialized');
      return res.status(500).json({ success:false, message: 'Fabric not initialized' });
    }

    const resultBytes = await fabricContract.evaluateTransaction('GetAllAssets');
    const raw = resultBytes.toString();
    let allAssets;
    try {
      allAssets = JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing GetAllAssets response:', e, 'raw:', raw);
      return res.status(500).json({ success:false, message: 'Failed to parse assets from chain' });
    }

    // adjust the property name depending on your chaincode JSON (farmerFirebaseUID in examples)
    const keyName = allAssets[0] && allAssets[0].farmerFirebaseUID !== undefined ? 'farmerFirebaseUID' : 'FarmerFirebaseUID';

    const myAssets = (Array.isArray(allAssets) ? allAssets : [])
      .filter(a => a && a[keyName] === ownerId);

    console.log(`Found ${myAssets.length} batches for farmer ${ownerId}`);

    return res.status(200).json({ success: true, count: myAssets.length, assets: myAssets });
  } catch (error) {
    console.error('Error in /api/produce/my-batches:', error);
    return res.status(500).json({ success: false, message: String(error) });
  }
});


// Update the status of a batch
app.put('/api/produce/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;
        const actorId = req.user.uid;
        const { status, details, role } = req.body;

        console.log(`Submitting 'UpdateAssetStatus' transaction for asset ${batchId}`);
        await fabricContract.submitTransaction('UpdateAssetStatus', batchId, status, `${details} (Updated by ${actorId})`);
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(`Failed to submit UpdateAssetStatus transaction: ${error}`);
        res.status(500).json({ success: false, message: error.toString() });
    }
});

// Fetch history of a specific batch
app.get('/api/produce/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    if (!fabricContract) {
      return res.status(500).json({ success: false, message: 'Fabric not initialized' });
    }

    const resultBytes = await fabricContract.evaluateTransaction('GetAssetHistory', batchId);
    const history = JSON.parse(resultBytes.toString()); // this matches your chaincode return

    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error('Failed to fetch batch history:', error);
    res.status(500).json({ success: false, message: String(error) });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});


