import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { certDirectoryPath, chaincodeName, channelName, cryptoPath, keyDirectoryPath, mspId, peerEndpoint, peerHostAlias, tlsCertPath } from './constants';

const utf8Decoder = new TextDecoder();
const assetId = `asset${Date.now()}`;


async function receiveContract(): Promise<Contract | undefined> {

    await displayInputParameters();

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(),
        signer: await newSigner(),
        // Default timeouts for different gRPC calls
        evaluateOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        endorseOptions: () => {
            return { deadline: Date.now() + 15000 }; // 15 seconds
        },
        submitOptions: () => {
            return { deadline: Date.now() + 5000 }; // 5 seconds
        },
        commitStatusOptions: () => {
            return { deadline: Date.now() + 60000 }; // 1 minute
        },
    });

    try {
        // Get a network instance representing the channel where the smart contract is deployed.
        const network = gateway.getNetwork(channelName);

        // Get the smart contract from the network.
        const contract = network.getContract(chaincodeName);

        return contract;
    } catch (error) {
        console.log("ERROR:", error);
    }
}

async function newGrpcConnection(): Promise<grpc.Client> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(peerEndpoint, tlsCredentials, {
        'grpc.ssl_target_name_override': peerHostAlias,
    });
}

async function newIdentity(): Promise<Identity> {
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    return path.join(dirPath, files[0]);
}

async function newSigner(): Promise<Signer> {
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * This type of transaction would typically only be run once by an application the first time it was started after its
 * initial deployment. A new version of the chaincode deployed later would likely not need to run an "init" function.
 */
async function initLedger(): Promise<void> {
    try {
        const contract = await receiveContract() as Contract;
        console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');

        await contract.submitTransaction('InitLedger');

        console.log('*** Transaction committed successfully');
    } catch (error) {
        console.log("ERROR:", error);
    }
    
}

/**
 * Evaluate a transaction to query ledger state.
 */
async function getAllAssets(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');

    const resultBytes = await contract.evaluateTransaction('GetAllAssets');

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
async function createAsset(contract: Contract): Promise<void> {
    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, Color, Size, Owner and AppraisedValue arguments');

    await contract.submitTransaction(
        'CreateAsset',
        assetId,
        'yellow',
        '5',
        'Tom',
        '1300',
    );

    console.log('*** Transaction committed successfully');
}

/**
 * Submit transaction asynchronously, allowing the application to process the smart contract response (e.g. update a UI)
 * while waiting for the commit notification.
 */
async function transferAssetAsync(contract: Contract): Promise<void> {
    console.log('\n--> Async Submit Transaction: TransferAsset, updates existing asset owner');

    const commit = await contract.submitAsync('TransferAsset', {
        arguments: [assetId, 'Saptha'],
    });
    const oldOwner = utf8Decoder.decode(commit.getResult());

    console.log(`*** Successfully submitted transaction to transfer ownership from ${oldOwner} to Saptha`);
    console.log('*** Waiting for transaction commit');

    const status = await commit.getStatus();
    if (!status.successful) {
        throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}`);
    }

    console.log('*** Transaction committed successfully');
}

async function readAssetByID(contract: Contract): Promise<void> {
    console.log('\n--> Evaluate Transaction: ReadAsset, function returns asset attributes');

    const resultBytes = await contract.evaluateTransaction('ReadAsset', assetId);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
}

/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
async function updateNonExistentAsset(contract: Contract): Promise<void>{
    console.log('\n--> Submit Transaction: UpdateAsset asset70, asset70 does not exist and should return an error');

    try {
        await contract.submitTransaction(
            'UpdateAsset',
            'asset70',
            'blue',
            '5',
            'Tomoko',
            '300',
        );
        console.log('******** FAILED to return an error');
    } catch (error) {
        console.log('*** Successfully caught the error: \n', error);
    }
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(): Promise<void> {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}