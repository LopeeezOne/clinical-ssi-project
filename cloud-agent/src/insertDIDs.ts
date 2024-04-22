import { agent } from './veramo/setup.js'
import { IService } from '@veramo/core';

async function main() {
  const service : IService = {
    id: "msg1",
    type: "DIDCommMessaging",
    serviceEndpoint: "http://192.168.51.162:3000/messaging",
  };
  
  const mediator = await agent.didManagerCreate({
    provider: "did:peer",
    alias: "mediator",
    options: {num_algo: 2, service: service}
  });

  // const mediator = await agent.didManagerImport({
  //   did: 'did:peer:2.Ez6LSckzwpNvzQ1ex4oZG5E6FQgqbm4nryTCMk1a1wtCHpKMR.Vz6Mkkg6fGVG5XnNstDQQdtu4515gZMwyLdZpVFSXM94fFoC2.SeyJpZCI6Im1zZzEiLCJ0IjoiZG0iLCJzIjoiaHR0cDovLzE5Mi4xNjguNTEuMTYyOjMwMDAvbWVzc2FnaW5nIn0',
  //   keys: [
  //     {
  //       type: 'Ed25519',
  //       kid: 'didcomm-mediatorKey-1',
  //       publicKeyHex: '1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
  //       privateKeyHex:
  //         'b57103882f7c66512dc96777cbafbeb2d48eca1e7a867f5a17a84e9a6740f7dc1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
  //       kms: 'local',
  //     },
  //   ],
  //   services: [
  //     {
  //       id: 'msg1',
  //       type: 'DIDCommMessaging',
  //       serviceEndpoint: 'http://192.168.51.162:3000/messaging',
  //     },
  //   ],
  //   provider: 'did:peer',
  //   alias: 'Mediator',
  // })

  const recipient = await agent.didManagerImport({
    did: 'did:peer:2.Ez6LSs2cLor5NRQWBzgjYpgW8UBUHSt4x8TCYygEASqDVTEje.Vz6Mko5r7r97jYB27LRn3BokcQ8AX6DiC2ExpKFMRzhKa8EnE.SeyJpZCI6Im1zZzEiLCJ0IjoiZG0iLCJzIjoiaHR0cDovLzE5Mi4xNjguNTEuMTYyOjMwMDAvbWVzc2FnaW5nIn0',
    keys: [
      {
        type: 'Ed25519',
        kid: 'didcomm-recipientKey-1',
        publicKeyHex: '1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
        privateKeyHex:
          'b57103882f7c66512dc96777cbafbeb2d48eca1e7a867f5a17a84e9a6740f7dc1fe9b397c196ab33549041b29cf93be29b9f2bdd27322f05844112fad97ff92a',
        kms: 'local',
      },
    ],
    services: [
      {
        id: 'msg1',
        type: 'DIDCommMessaging',
        serviceEndpoint: 'http://192.168.63.162:3000/messaging',
      },
    ],
    provider: 'did:peer',
    alias: 'Agent',
  })


  const didDoc = (await agent.resolveDid({ didUrl: mediator.did })).didDocument
  const didDoc2 = (await agent.resolveDid({ didUrl: recipient.did })).didDocument
  
  console.log(`New did mediator created:`, didDoc)
  console.log(`New did recipient created:`, didDoc2)
}

main().catch(console.log)