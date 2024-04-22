import express, { Express } from "express";
import dotenv from "dotenv";
import { agent } from "./veramo/setup.js"
import { MessagingRouter, RequestWithAgentRouter } from '@veramo/remote-server'

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
            serviceEndpoint: `http://192.168.121.162:${port}/messaging`,
        },
    },
})

const mediatorDID = mediatorIdentifier.did
console.log(`mediator DID: ${mediatorDID}`)

app.use(
    '/messaging',
    requestWithAgent,
    MessagingRouter({
        metaData: { type: 'mediator-incoming' },
    }),
)

// app.post('/auth', express.json(), (req, res) => {
//     // Assuming the client sends JSON data
//     const clientData = req.body;
//     console.log('Received data from client:', clientData);
    
//     // Process the data here (e.g., validate, store in a database, etc.)
//     // Check if the username appears in the folder of org1.example.com
//     const username = clientData.username;
//     const password = clientData.password;
//     const role = clientData.role;

    
//     // Respond back to the client
//     res.json({ status: 'success', message: 'Data received and processed.' });
//   });

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});