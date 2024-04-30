import * as grpc from '@grpc/grpc-js';
import { connect, Contract, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';
import { chaincodeName, channelName, cryptoPath, getUserPaths, mspId, peerEndpoint, peerHostAlias, tlsCertPath } from './constants.js';

const utf8Decoder = new TextDecoder();

// I want use the function receiveContract() in the index.ts file
export async function receiveContract(user: string): Promise<Contract | undefined> {

    await displayInputParameters(user);

    // The gRPC client connection should be shared by all Gateway connections to this endpoint.
    const client = await newGrpcConnection();

    const gateway = connect({
        client,
        identity: await newIdentity(user),
        signer: await newSigner(user),
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

async function newIdentity(user: string): Promise<Identity> {
    const certDirectoryPath = getUserPaths(user).certDirectoryPath;
    const certPath = await getFirstDirFileName(certDirectoryPath);
    const credentials = await fs.readFile(certPath);
    return { mspId, credentials };
}

async function getFirstDirFileName(dirPath: string): Promise<string> {
    const files = await fs.readdir(dirPath);
    return path.join(dirPath, files[0]);
}

async function newSigner(user: string): Promise<Signer> {
    const keyDirectoryPath = getUserPaths(user).keyDirectoryPath;
    const keyPath = await getFirstDirFileName(keyDirectoryPath);
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

/**
 * Submit a transaction synchronously, blocking until it has been committed to the ledger.
 */
export async function createDid(contract: Contract, id: string, document: string): Promise<void> {
    console.log('\n--> Submit Transaction: CreateDID, creates new DID with ID and document');

    await contract.submitTransaction(
        'CreateDID',
        id,
        document,
    );

    console.log('*** Transaction committed successfully');
}


export async function readDidByID(contract: Contract, id: string): Promise<string> {
    console.log('\n--> Evaluate Transaction: ReadDID, function returns DID document');

    const resultBytes = await contract.evaluateTransaction('ReadDID', id);

    const resultJson = utf8Decoder.decode(resultBytes);
    const result = JSON.parse(resultJson);
    console.log('*** Result:', result);
    return result;
}


async function existsDid(contract: Contract, id: string): Promise<string> {
    console.log('\n--> Evaluate Transaction: DIDExists, function returns "true" if a DID with given ID exists');

    const resultBytes = await contract.evaluateTransaction('DIDExists', id);

    const result = utf8Decoder.decode(resultBytes);
    console.log('*** Result:', result);
    return result;
}

/**
 * submitTransaction() will throw an error containing details of any error responses from the smart contract.
 */
async function updateDid(contract: Contract, id: string, document: string): Promise<void>{
    console.log('\n--> Submit Transaction: UpdateDID with id and document');

    try {
        await contract.submitTransaction(
            'UpdateDID',
            id,
            document,
        );
        console.log('******** FAILED to return an error');
    } catch (error) {
        console.log('*** Successfully caught the error: \n', error);
    }
}

/**
 * deleteDid() will throw an error containing details of any error responses from the smart contract.
 */
async function deleteDid(contract: Contract, id: string): Promise<void> {
    console.log('\n--> Submit Transaction: DeleteDID with id');

    await contract.submitTransaction(
        'DeleteDID',
        id,
    );

    console.log('*** Transaction committed successfully');
}

/**
 * displayInputParameters() will print the global scope parameters used by the main driver routine.
 */
async function displayInputParameters(user: string): Promise<void> {
    console.log(`channelName:       ${channelName}`);
    console.log(`chaincodeName:     ${chaincodeName}`);
    console.log(`mspId:             ${mspId}`);
    console.log(`cryptoPath:        ${cryptoPath}`);
    console.log(`keyDirectoryPath:  ${getUserPaths(user).keyDirectoryPath}`);
    console.log(`certDirectoryPath: ${getUserPaths(user).certDirectoryPath}`);
    console.log(`tlsCertPath:       ${tlsCertPath}`);
    console.log(`peerEndpoint:      ${peerEndpoint}`);
    console.log(`peerHostAlias:     ${peerHostAlias}`);
}