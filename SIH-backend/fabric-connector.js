'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// IMPORTANT: Update these values to match your Hyperledger Fabric network setup.

// Path to the connection profile JSON file that describes the network.
const CONNECTION_PROFILE_PATH = path.resolve(__dirname, 'fabric', 'connection-profile.json');
// Path to the directory where user identity wallets are stored.
const WALLET_PATH = path.resolve(__dirname, 'fabric', 'wallet');
// The name of the channel in your Fabric network.
const CHANNEL_NAME = 'mychannel';
// The name of the chaincode (smart contract) deployed on the channel.
const CHAINCODE_NAME = 'agritrace'; 

/**
 * Connects to the Fabric gateway, gets the network and contract.
 * This function handles the core logic of connecting to the blockchain.
 * @returns {object} An object containing the contract and the gateway connection.
 */
async function getContract() {
    try {
        // Load the network configuration
        const ccpContent = fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8');
        const ccp = JSON.parse(ccpContent);

        // Create a new file system based wallet for managing identities.
        const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
        console.log(`Wallet path: ${WALLET_PATH}`);

        // Check to see if we have the admin user identity in the wallet.
        // This identity is used by the server to interact with the network.
        const identity = await wallet.get('admin');
        if (!identity) {
            console.error('An identity for the user "admin" does not exist in the wallet.');
            console.log('Run the enrollAdmin.js script before retrying');
            // In a real app, you'd have a script to enroll the admin user.
            throw new Error('Admin identity not found in wallet.');
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true } // Use discovery to find peers
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(CHANNEL_NAME);

        // Get the contract from the network.
        const contract = network.getContract(CHAINCODE_NAME);
        
        console.log('Successfully connected to Hyperledger Fabric network.');

        return { contract, gateway };

    } catch (error) {
        console.error(`Failed to connect to Fabric network: ${error}`);
        process.exit(1);
    }
}

module.exports = {
    getContract
};
