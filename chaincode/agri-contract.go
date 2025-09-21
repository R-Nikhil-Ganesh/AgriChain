package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset describes basic details of what is being traced
type Asset struct {
	ID                string `json:"ID"`
	CropType          string `json:"cropType"`
	Quantity          int    `json:"quantity"`
	Unit              string `json:"unit"`
	HarvestTimestamp  string `json:"harvestTimestamp"`
	FarmerFirebaseUID string `json:"farmerFirebaseUID"`
	FarmerName        string `json:"farmerName"`
	FarmLocation      string `json:"farmLocation"`
	CurrentOwner      string `json:"currentOwner"`
	CurrentStatus     string `json:"currentStatus"`
	DistributorUID    string `json:"distributorUID"`
	RetailerUID       string `json:"retailerUID"`
	LastUpdated       string `json:"lastUpdated"`
}

// HistoryQueryResult structure used for returning history of an asset
type HistoryQueryResult struct {
	Record    *Asset    `json:"record"`
	TxId      string    `json:"txId"`
	Timestamp time.Time `json:"timestamp"`
	IsDelete  bool      `json:"isDelete"`
}

// InitLedger adds a base set of assets to the ledger
// InitLedger adds a base set of assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
    // Use the transaction timestamp (deterministic across endorsers)
    txTimestamp, err := ctx.GetStub().GetTxTimestamp()
    if err != nil {
        return fmt.Errorf("failed to get tx timestamp: %v", err)
    }
    t, err := ptypes.Timestamp(txTimestamp)
    if err != nil {
        return fmt.Errorf("failed to convert tx timestamp: %v", err)
    }
    fixedTime := t.UTC().Format(time.RFC3339Nano)

    assets := []Asset{
        {ID: "BATCH-001", CropType: "Organic Wheat", Quantity: 500, Unit: "kg", HarvestTimestamp: fixedTime, FarmerFirebaseUID: "farmer_uid_123", FarmerName: "Odisha Farms Inc.", FarmLocation: "Cuttack, Odisha", CurrentOwner: "farmer_uid_123", CurrentStatus: "Harvested", LastUpdated: fixedTime},
        {ID: "BATCH-002", CropType: "Organic Tomatoes", Quantity: 120, Unit: "kg", HarvestTimestamp: fixedTime, FarmerFirebaseUID: "farmer_uid_456", FarmerName: "Mahanadi Organics", FarmLocation: "Sambalpur, Odisha", CurrentOwner: "farmer_uid_456", CurrentStatus: "Harvested", LastUpdated: fixedTime},
    }

    for _, asset := range assets {
        assetJSON, err := json.Marshal(asset)
        if err != nil {
            return err
        }

        err = ctx.GetStub().PutState(asset.ID, assetJSON)
        if err != nil {
            return fmt.Errorf("failed to put to world state. %v", err)
        }
    }

    return nil
}


// CreateAsset issues a new asset to the world state with given details.
// FIX: `transactionTimestamp` is now a required argument passed from the client.
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, cropType string, quantity int, unit string, farmerUID string, farmerName string, farmLocation string) error {
    // get tx timestamp
    txTimestamp, err := ctx.GetStub().GetTxTimestamp()
    if err != nil {
        return fmt.Errorf("failed to get tx timestamp: %v", err)
    }
    t, err := ptypes.Timestamp(txTimestamp)
    if err != nil {
        return fmt.Errorf("failed to convert tx timestamp: %v", err)
    }
    ts := t.UTC().Format(time.RFC3339Nano)

    exists, err := s.AssetExists(ctx, id)
    if err != nil {
        return err
    }
    if exists {
        return fmt.Errorf("the asset %s already exists", id)
    }

    asset := Asset{
        ID:                id,
        CropType:          cropType,
        Quantity:          quantity,
        Unit:              unit,
        HarvestTimestamp:  ts,
        FarmerFirebaseUID: farmerUID,
        FarmerName:        farmerName,
        FarmLocation:      farmLocation,
        CurrentOwner:      farmerUID,
        CurrentStatus:     "Harvested",
        LastUpdated:       ts,
    }
    assetJSON, err := json.Marshal(asset)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, assetJSON)
}


// ReadAsset returns the asset stored in the world state with given id.
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", id)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// UpdateAssetStatus updates the status and owner of an asset on the ledger.
// FIX: `transactionTimestamp` is now a required argument passed from the client.
func (s *SmartContract) UpdateAssetStatus(ctx contractapi.TransactionContextInterface, id string, newStatus string, newOwnerUID string) error {
    asset, err := s.ReadAsset(ctx, id)
    if err != nil {
        return err
    }

    // get tx timestamp
    txTimestamp, err := ctx.GetStub().GetTxTimestamp()
    if err != nil {
        return fmt.Errorf("failed to get tx timestamp: %v", err)
    }
    t, err := ptypes.Timestamp(txTimestamp)
    if err != nil {
        return fmt.Errorf("failed to convert tx timestamp: %v", err)
    }
    ts := t.UTC().Format(time.RFC3339Nano)

    asset.CurrentStatus = newStatus
    asset.CurrentOwner = newOwnerUID
    asset.LastUpdated = ts

    if newStatus == "In-Transit" {
        asset.DistributorUID = newOwnerUID
    }
    if newStatus == "In-Store" {
        asset.RetailerUID = newOwnerUID
    }

    assetJSON, err := json.Marshal(asset)
    if err != nil {
        return err
    }

    return ctx.GetStub().PutState(id, assetJSON)
}


// AssetExists returns true when asset with given ID exists in world state
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

// GetAllAssets returns all assets found in world state
func (s *SmartContract) GetAllAssets(ctx contractapi.TransactionContextInterface) ([]*Asset, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var assets []*Asset
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		err = json.Unmarshal(queryResponse.Value, &asset)
		if err != nil {
			return nil, err
		}
		assets = append(assets, &asset)
	}

	return assets, nil
}

// GetAssetHistory returns the chain of custody for an asset since issuance.
func (s *SmartContract) GetAssetHistory(ctx contractapi.TransactionContextInterface, assetID string) ([]HistoryQueryResult, error) {
	log.Printf("GetAssetHistory: ID %v", assetID)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(assetID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &asset)
			if err != nil {
				return nil, err
			}
		} else {
			asset = Asset{
				ID: assetID,
			}
		}

		timestamp, err := ptypes.Timestamp(response.Timestamp)
		if err != nil {
			return nil, err
		}

		record := HistoryQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &asset,
			IsDelete:  response.IsDelete,
		}
		records = append(records, record)
	}

	return records, nil
}

func main() {
	assetChaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("Error creating agri-trace chaincode: %v", err)
	}

	if err := assetChaincode.Start(); err != nil {
		log.Panicf("Error starting agri-trace chaincode: %v", err)
	}
}

