import express, { Express } from "express";
import dotenv from "dotenv";
import { agent } from "./veramo/setup.js"
import { MessagingRouter, RequestWithAgentRouter } from '@veramo/remote-server'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline';
import { createDid, readDidByID, receiveContract } from "./fabric/setup.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const requestWithAgent = RequestWithAgentRouter({ agent })

const mediatorIdentifier = await agent.didManagerCreate({
    provider: 'did:peer',
    options: {
        num_algo: 2,
        service: {
            id: '#messaging1',
            type: 'DIDCommMessaging',
            serviceEndpoint: `http://155.54.98.157:${port}/messaging`,
        },
    },
})

const contract = await receiveContract('User1');

const mediatorDID = mediatorIdentifier.did
console.log(`mediator DID: ${mediatorDID}`)

app.use(
    '/messaging',
    requestWithAgent,
    MessagingRouter({
        metaData: { type: 'mediator-incoming' },
    }),
)

app.post('/auth', express.json(), (req, res) => {
    // Assuming the client sends JSON data
    const clientData = req.body;
    console.log('Received data from client:', clientData.alias);

    // Process the data here (e.g., validate, store in a database, etc.)
    // Check if the username appears in the folder of org1.example.com
    const alias = clientData.alias;
    const pin = clientData.pin;

    // Define the path to the file where you want to store the data
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = path.join(__dirname, 'users.txt');

    // Create a read stream and a readline interface
    const readStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: readStream });

    // Read the file line by line
    rl.on('line', (line) => {
        const [fileAlias, filePin, fileRole, fileDid] = line.split(' ');

        // Check if the alias and pin match the received data
        if (fileAlias === alias && filePin === pin) {
            // If a match is found, respond back to the client and close the readline interface
            res.json({ status: 'success', message: fileAlias });
            rl.pause();
            return;
        }
    });

    rl.on('close', () => {
        // If no match is found after reading the entire file, respond back to the client with an error
        if (!res.headersSent) {
            res.json({ status: 'error', message: 'Login failed.' });
        }
    });
});

app.post('/register', express.json(), async (req, res) => {
    // Assuming the client sends JSON data
    const clientData = req.body;
    console.log('Received registration from client:', clientData.username);

    // Process the data here (e.g., validate, store in a database, etc.)
    // Check if the username appears in the folder of org1.example.com
    const username = clientData.username;
    const pin = clientData.pin;
    const role = clientData.role;
    const did = clientData.did;

    // Store the data in a text file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const filePath = path.join(__dirname, 'users.txt');
    const data = `${username} ${pin} ${role} ${did}\n`;
    fs.appendFileSync(filePath, data);

    if (contract !== undefined) {
    const createdDid = await createDid(contract, username, JSON.stringify({ username, did }));
    //console.log('Created DID:', createdDid);
    } else {
        throw new Error("Failed to obtain contract");
    }

    // Respond back to the client
    res.json({ status: 'success', message: 'Data received and processed.' });
});

app.get('/did/:id', express.json(), async (req, res) => {
    const id = req.params.id;

    if (contract !== undefined) {
        const did = await readDidByID(contract, id);
        res.json(did);
    }
    else {
        throw new Error("Failed to obtain contract");
    }
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});