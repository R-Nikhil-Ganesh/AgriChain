# Agrichain: A Farmer-to-Fork Blockchain Traceability System

A Hyperledger Fabric–based food traceability platform that tracks agricultural produce from farmer to consumer, ensuring transparency, fair pricing, and protection against middlemen exploitation. Each stage of the supply chain verifies product data using QR codes and immutable blockchain records.

 ## Problem Statement

Farmers are often underpaid due to lack of transparency in supply chains. Prices and weights are altered by intermediaries, leaving farmers with no verifiable proof. Consumers also lack visibility into where their food comes from and how it was handled.

## Problem statement

Farmers are often underpaid because prices and weights can be altered by intermediaries and there is no tamper-proof record. Consumers also lack reliable information about product origin and handling.

## Solution overview

This project uses a Hyperledger Fabric permissioned ledger to capture and persist supply-chain events. Key aspects:

- Each produce item is represented as an on-chain asset with a unique ID.
- A QR code encodes the asset ID for scanning and lookup.
- Authorized participants submit transactions to record price, weight, location, and ownership changes.
- Records are immutable and auditable; access is controlled by Fabric identities and chaincode policies.

## End-to-end flow

- **Farmer**: registers produce, assigns QR/asset ID, records initial price and weight.
- **Transporter / Wholesaler / Retailer**: scan QR, verify asset, append verified updates (price, weight, status).
- **Consumer**: scans QR to view the full, auditable history of the product.

## Project structure

```
. 
├── chaincode/
│   └── agri-contract.go        # Go smart contract (ledger logic)
│
├── fabric-samples/
│   ├── bin/                    # Fabric binaries
│   └── test-network/           # Local Fabric network setup and examples
│
├── SIH-backend/
│   ├── enrollAdmin.js          # CA admin enrollment
│   ├── registerUser.js         # User registration
│   ├── fabric-connector.js     # Gateway connection to Fabric
│   ├── server.js               # REST API server
│   └── firebase-service-account-key.json (sensitive, should be ignored)
│
├── SIH-frontend/
│   └── SIH/                    # Web UI for interacting with the system
│
└── README.md
```

## Smart contract (chaincode)

The chaincode (Go) models the asset lifecycle and enforces validation rules. It implements:

- Asset structure and metadata
- Ownership and role-based transitions
- Price and weight tracking
- Validation and endorsement policy checks

Chaincode is deployed using Fabric's lifecycle process.

## Backend (SIH-backend)

The backend is a Node.js service that uses the Hyperledger Fabric SDK. Responsibilities include:

- Enrolling identities and registering users via Fabric CA (`enrollAdmin.js`, `registerUser.js`).
- Establishing a Gateway connection to the Fabric network (`fabric-connector.js`).
- Exposing REST APIs for the frontend to submit transactions and query ledger data (`server.js`).
- Optional Firebase integration for authentication, notifications, or storage (sensitive key must be protected).

## Frontend (SIH-frontend)

The frontend is a web application that provides interfaces for supply-chain participants and consumers. It communicates with the backend API and does not connect directly to Fabric.

## Key features

- Immutable price and weight tracking
- QR-based verification and asset lookup
- Farmer price protection via auditable records
- Consumer transparency and origin verification
- Permissioned blockchain model with access control

## Planned future features

- Auction marketplace for on-chain bidding
- Role-based access controls and richer permissions
- Analytics dashboard for pricing and trends
- Mobile app for QR scanning

## Running locally (high level)

1. Start a Fabric network using `fabric-samples/test-network` (follow its README).
2. Build/package and deploy the chaincode from `chaincode/` using Fabric lifecycle commands.
3. In `SIH-backend`:

```bash
cd SIH-backend
npm install
node enrollAdmin.js   # enroll the admin identity (if required)
node registerUser.js  # register an application user (if required)
node server.js        # start the backend API
```

4. Start the frontend (see `SIH-frontend/SIH` for framework-specific instructions, commonly `npm install` and `npm start`).
5. Use the frontend to interact with ledger data via the backend APIs.

## Security note

The file `SIH-backend/firebase-service-account-key.json` contains sensitive credentials. Ensure it is excluded from version control (add to `.gitignore`) and rotate keys if they have been exposed.

## Project goal

Create a trust-first agricultural supply chain where farmers are protected, consumers are informed, and data cannot be manipulated behind closed doors.

## Project goal

Create a trust-first agricultural supply chain where farmers are protected, consumers are informed, and data cannot be manipulated behind closed doors.