// imports:
// Core interfaces
import { createAgent, IAgentOptions, IDataStore, IDataStoreORM, IDIDManager, IEventListener, IKeyManager, IMessageHandler, IResolver, TAgent } from '@veramo/core'

// Core identity manager plugin. This allows you to create and manage DIDs by orchestrating different DID provider packages.
// This implements `IDIDManager`
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'

// Core key manager plugin. DIDs use keys and this key manager is required to know how to work with them.
// This implements `IKeyManager`
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore} from '@veramo/key-manager'

// This plugin allows us to create and manage `did:key` DIDs. (used by DIDManager)
import { getResolver as getDidPeerResolver, PeerDIDProvider } from '@veramo/did-provider-peer'

// This plugin implements `IResolver`
import { DIDResolverPlugin } from '@veramo/did-resolver'

// A key management system that uses a local database to store keys (used by KeyManager)
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// Storage plugin using TypeORM to link to a database
import { Entities, KeyStore, DIDStore, migrations, PrivateKeyStore, DataStore, DataStoreORM } from '@veramo/data-store'

// This plugin allows us to issue and verify W3C Verifiable Credentials with JWT proof format
import { CredentialPlugin, ICredentialIssuer, ICredentialVerifier } from '@veramo/credential-w3c'

// TypeORM is installed with '@veramo/data-store'
import { DataSource } from 'typeorm'

import { CoordinateMediationV3RecipientMessageHandler, DIDComm, DIDCommHttpTransport, DIDCommMessageHandler, IDIDComm, PickupRecipientMessageHandler } from '@veramo/did-comm'

import { MessageHandler } from '@veramo/message-handler'

const DB_ENCRYPTION_KEY = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'

// DB setup:
let dbConnection = new DataSource({
  type: 'expo',
  driver: require('expo-sqlite'),
  database: 'veramo.sqlite',
  migrations: migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize()

// minimum set of plugins for users
type UserAgentPlugins = IResolver & IKeyManager & IDIDManager & IMessageHandler & IDIDComm & ICredentialIssuer & ICredentialVerifier

const defaultKms = 'local'

function createUserAgent(options?: IAgentOptions): TAgent<UserAgentPlugins> {

  return createAgent<UserAgentPlugins>({
    ...options,
    plugins: [
      new DIDResolverPlugin({
        ...getDidPeerResolver(),
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          [defaultKms]: new KeyManagementSystem(new MemoryPrivateKeyStore()),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:peer',
        providers: {
          'did:peer': new PeerDIDProvider({ defaultKms }),
        },
      }),
      new CredentialPlugin(),
      // new DataStoreJson(memoryJsonStore),
      new MessageHandler({
        messageHandlers: [
          new DIDCommMessageHandler(),
          // new TrustPingMessageHandler(),
          // new CoordinateMediationV3RecipientMessageHandler(), // not needed for did:peer:2
          new PickupRecipientMessageHandler(),
        ],
      }),
      new DIDComm(),
    ],
  })
}

export const agent = createUserAgent();

// Veramo agent setup
// export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & ICredentialIssuer & ICredentialVerifier & IResolver & IEventListener & IDIDComm & IMessageHandler>({
//   plugins: [
//     new KeyManager({
//       store: new KeyStore(dbConnection),
//       kms: {
//         local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(DB_ENCRYPTION_KEY))),
//       },
//     }),
//     new DIDManager({
//       store: new DIDStore(dbConnection),
//       defaultProvider: 'did:key',
//       providers: {
//         'did:key': new KeyDIDProvider({
//           defaultKms: 'local',
//         }),
//         'did:web': new WebDIDProvider({
//           defaultKms: 'local',
//         }),
//         'did:peer': new PeerDIDProvider({
//           defaultKms: 'local',
//         })
//       },
//     }),
//     new CredentialPlugin(),
//     new DIDResolverPlugin({
//       ...keyDidResolver(),
//       ...peerDidResolver(),
//     }),
//     new MessageHandler({
//       messageHandlers: [
//         new DIDCommMessageHandler(),
//         new PickupRecipientMessageHandler(),
//         new CoordinateMediationV3RecipientMessageHandler(),
//       ],
//     }),
//     new DIDComm({ transports: [new DIDCommHttpTransport()]}),
//     new DataStore(dbConnection),
//     new DataStoreORM(dbConnection),
//   ],
// })