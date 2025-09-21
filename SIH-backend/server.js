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
    const ownerId = req.user.uid;
    const { cropType, quantity, farmerName, location, farmID } = req.body;
    const assetID = `BATCH-${Date.now()}`;
    
    console.log(`Submitting 'CreateAsset' transaction for asset ${assetID}`);
    await fabricContract.submitTransaction('CreateAsset', assetID, cropType, quantity, farmerName, location, farmID);

    res.status(201).json({ success: true, assetID });
  } catch (error) {
    console.error(`Failed to submit CreateAsset transaction: ${error}`);
    res.status(500).json({ success: false, message: error.toString() });
  }
});

// Get the history of a specific batch
// This route does not need to be authenticated if it's for public/consumer use
app.get('/api/public/produce/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    console.log(`Evaluating 'GetAssetHistory' query for asset ${batchId}`);
    
    const resultBytes = await fabricContract.evaluateTransaction('GetAssetHistory', batchId);
    const resultJson = JSON.parse(resultBytes.toString());
    
    res.status(200).json(resultJson);
  } catch (error) {
    console.error(`Failed to evaluate GetAssetHistory query: ${error}`);
    res.status(500).json({ success: false, message: error.toString() });
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


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

