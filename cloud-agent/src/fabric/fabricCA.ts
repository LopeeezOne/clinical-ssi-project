//Code to interact with the Fabric CA server but it is not working

import { spawn } from 'child_process';
import { caCert, caName } from './constants.js';

// export PATH=..../fabric-samples/bin:$PATH

// function to register a user
function registerUser(username: string, password: string, role: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        try {
            const child = spawn('fabric-ca-client', [
                'register',
                '--caname',
                caName,
                '--id.name',
                username,
                '--id.secret',
                password,
                '--id.type',
                'client',
                '--tls.certfiles',
                caCert,
            ]);

            child.stdout.on('data', (data) => {
                console.log(data.toString());
            });

            child.stderr.on('data', (data) => {
                console.error(data.toString());
                reject(data.toString());
            });

            child.on('close', (code) => {
                resolve();
                console.log('User registered successfully');
            });
        } catch (error) {
            console.log(error);
        }
    });
}

// function to check if the user is already registered
async function isUserRegistered(username: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try {
            const child = spawn('fabric-ca-client', [
                'identity',
                'list',
                '--caname',
                caName,
                '--tls.certfiles',
                caCert,
            ]);

            child.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes(username)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });

            child.stderr.on('data', (data) => {
                console.error(data.toString());
                reject(data.toString());
            });

            child.on('close', (code) => {
                resolve(false);
            });
        } catch (error) {
            console.log(error);
        }
    });
}

isUserRegistered('Bob')
    .then(() => { console.log('') })
    .catch((error) => { console.log(error) });

// registerUser('alice', 'alicepw', 'client')
//     .then(() => {
//         console.log('User registration successful');
//     })
//     .catch((error) => {
//         console.error('User registration failed:', error);
//     });
