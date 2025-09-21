# Copilot Instructions for Hyperledger Fabric Samples

## Big Picture Architecture
- This repo contains sample applications and chaincode for Hyperledger Fabric, organized by use case (asset transfer, auctions, tokens, etc.).
- Major components:
  - `test-network/`: Docker Compose-based Fabric network for local development/testing.
  - `asset-transfer-*`, `auction-*`, `token-*`: Each folder contains smart contracts (chaincode) and client applications in multiple languages.
  - Chaincode is typically in subfolders like `chaincode-go/`, `chaincode-typescript/`, etc. Applications are in `application-*` subfolders.
- Data flows: Client apps invoke chaincode transactions via Fabric SDKs, which update/query ledger state. Some samples use events, private data, or state-based endorsement.

## Developer Workflows
- **Start network:**
  - `cd test-network; ./network.sh up createChannel -c mychannel -ca`
- **Deploy chaincode:**
  - Example: `./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go/ -ccl go`
- **Run applications:**
  - Example (TypeScript): `cd asset-transfer-basic/application-gateway-typescript; npm install; npm start`
- **Clean up:**
  - `./network.sh down` (removes network and ledger data)
- **Auction samples:**
  - Dutch auction supports auditor org; see `auction-dutch/README.md` for multi-org setup and endorsement policies.

## Project-Specific Conventions
- Chaincode function names are consistent across samples: `CreateAsset`, `ReadAsset`, `UpdateAsset`, `TransferAsset`, etc.
- Endorsement policies and private data are demonstrated in specific samples (`asset-transfer-sbe`, `asset-transfer-private-data`).
- Event handling is shown in `asset-transfer-events`.
- Token samples use both account-based and UTXO models.
- Application identities are managed via CA enrollment scripts (see auction samples).

## Integration Points & Dependencies
- Relies on Fabric Docker images and CLI tools (see [Fabric prerequisites](https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html)).
- Client apps use Fabric SDKs for Go, Java, TypeScript, JavaScript.
- Some samples require CouchDB for advanced queries.
- External documentation is referenced in READMEs for advanced scenarios (secured asset transfer, event services).

## Patterns & Examples
- Always use the provided `network.sh` script for network lifecycle.
- Chaincode and application code are language-agnostic; follow folder conventions for each language.
- For multi-org scenarios, set environment variables as shown in sample READMEs.
- Endorsement failures are common when policies are misconfigured; check org MSP IDs and peer addresses.

## Key Files & Directories
- `test-network/`: Network scripts and configs
- `asset-transfer-basic/`, `asset-transfer-events/`, `asset-transfer-private-data/`, `asset-transfer-sbe/`, `asset-transfer-secured-agreement/`: Core samples
- `auction-dutch/`, `auction-simple/`: Auction samples with advanced endorsement logic
- `token-erc-20/`, `token-erc-721/`, `token-utxo/`, `token-sdk/`: Token samples

---
For more details, see individual sample `README.md` files and the [Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/latest/).
