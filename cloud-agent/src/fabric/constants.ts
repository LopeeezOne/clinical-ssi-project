import * as path from 'path';

export const channelName = envOrDefault('CHANNEL_NAME', 'mychannel');
export const chaincodeName = envOrDefault('CHAINCODE_NAME', 'did');
export const mspId = envOrDefault('MSP_ID', 'Org1MSP');

// Path to crypto and ca materials.
// export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve('Users', 'antoniolopezmartinez', 'Documents', 'HyperledgerFabric', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));
export const cryptoPath = envOrDefault('CRYPTO_PATH', path.resolve('..', '..', '..', 'HyperledgerFabric', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com'));
export const caCertPath = envOrDefault('CA_PATH', path.resolve('..', '..', 'HyperledgerFabric', 'fabric-samples', 'test-network', 'organizations', 'fabric-ca'));

// Path to user private key directory.
export const keyDirectoryPath = envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore'));

// Path to user certificate directory.
export const certDirectoryPath = envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts'));

// Path to peer tls certificate.
export const tlsCertPath = envOrDefault('TLS_CERT_PATH', path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt'));

// Gateway peer endpoint.
export const peerEndpoint = envOrDefault('PEER_ENDPOINT', 'localhost:7051');

// Path to ca certificate.
//export const caCert = envOrDefault('CA_CERT', path.resolve(caCertPath, 'org1', 'ca-cert.pem'));
export const caCert = path.resolve('..', '..', 'HyperledgerFabric', 'fabric-samples', 'test-network', 'organizations', 'fabric-ca', 'org1', 'ca-cert.pem');

// CA name.
export const caName = 'ca-org1';

// Gateway peer SSL host name override.
export const peerHostAlias = envOrDefault('PEER_HOST_ALIAS', 'peer0.org1.example.com');

/**
 * envOrDefault() will return the value of an environment variable, or a default value if the variable is undefined.
 */
function envOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
}

// function to return all the need paths for the fabric network receiving the user's name
export function getUserPaths(username: string): { keyDirectoryPath: string, certDirectoryPath: string } {
    return {
        keyDirectoryPath: envOrDefault('KEY_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', username + '@org1.example.com', 'msp', 'keystore')),
        certDirectoryPath: envOrDefault('CERT_DIRECTORY_PATH', path.resolve(cryptoPath, 'users', username + '@org1.example.com', 'msp', 'signcerts')),
    };
}