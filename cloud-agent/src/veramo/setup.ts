// Core interfaces
import { createAgent, IDIDManager, IResolver, IDataStore, IKeyManager, IEventListener, IMessageHandler, IDataStoreORM, IAgentOptions, TAgent } from '@veramo/core'

// Core identity manager plugin
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager'

// Peer did identity provider
import { getResolver as getDidPeerResolver, PeerDIDProvider } from '@veramo/did-provider-peer'

// Core key manager plugin
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager'

import { DataStoreJson } from '@veramo/data-store-json'

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// W3C Verifiable Credential plugin
import { CredentialPlugin } from '@veramo/credential-w3c'

// Custom resolvers
import { DIDResolverPlugin } from '@veramo/did-resolver'

// Storage plugin using TypeOrm
import { Entities as DataStoreEntities, migrations as dataStoreMigrations,
} from '@veramo/data-store'

import { CoordinateMediationV3MediatorMessageHandler, DIDComm, DIDCommMessageHandler, IDIDComm, PickupMediatorMessageHandler, RoutingMessageHandler } from '@veramo/did-comm'

import { MessageHandler } from '@veramo/message-handler'

// TypeORM is installed with `@veramo/data-store`
import { DataSource } from 'typeorm'

import { IMediationManager, MediationManagerPlugin, MediationResponse, PreMediationRequestPolicy, RequesterDid } from '@veramo/mediation-manager'
import { KeyValueStore, kvStoreMigrations, Entities as KVStoreEntities } from '@veramo/kv-store'

// This will be the name for the local sqlite database for demo purposes
const DATABASE_FILE = 'database.sqlite'

// This will be the secret key for the KMS
// You can create one with npx @veramo/cli config create-secret-key
const KMS_SECRET_KEY =
  '11b574d316903ced6cc3f4787bbcc3047d9c72d1da4d83e36fe714ef785d10c1'

const dbConnection = new DataSource({
  type: 'sqlite',
  database: DATABASE_FILE,
  synchronize: false,
  migrations: dataStoreMigrations.concat(kvStoreMigrations),
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: (KVStoreEntities as any).concat(DataStoreEntities),
}).initialize()

const DIDCommEventSniffer: IEventListener = {
  eventTypes: ['DIDCommV2Message-sent', 'DIDCommV2Message-received',
    'DIDCommV2Message-forwardMessageQueued', 'DIDCommV2Message-forwardMessageDequeued',],
    onEvent: (event:any) => new Promise<void>(()=> {
      console.log(event)
    }),
}

// minimum set of plugins for users
type UserAgentPlugins = IResolver & IKeyManager & IDIDManager & IMessageHandler & IDIDComm

// minimum set of plugins for mediator
type MediatorPlugins = UserAgentPlugins & IMediationManager & IDataStoreORM & IDataStore

const defaultKms = 'local'

function createMediatorAgent(options?: IAgentOptions): TAgent<MediatorPlugins> {
  let memoryJsonStore = { notifyUpdate: () => Promise.resolve() }

  let policyStore = new KeyValueStore<PreMediationRequestPolicy>({
    namespace: 'mediation_policy',
    store: new Map<string, PreMediationRequestPolicy>(),
  })

  let mediationStore = new KeyValueStore<MediationResponse>({
    namespace: 'mediation_response',
    store: new Map<string, MediationResponse>(),
  })

  let recipientDidStore = new KeyValueStore<RequesterDid>({
    namespace: 'recipient_did',
    store: new Map<string, RequesterDid>(),
  })

  return createAgent<MediatorPlugins>({
    ...options,
    plugins: [
      new DIDResolverPlugin({
        ...getDidPeerResolver(),
      }),
      new KeyManager({
        store: new MemoryKeyStore(),
        kms: {
          [defaultKms]: new KeyManagementSystem(
            new MemoryPrivateKeyStore(),
          ),
        },
      }),
      new DIDManager({
        store: new MemoryDIDStore(),
        defaultProvider: 'did:peer',
        providers: {
          'did:peer': new PeerDIDProvider({ defaultKms }),
        },
      }),
      new DataStoreJson(memoryJsonStore),
      new MessageHandler({
        messageHandlers: [
          new DIDCommMessageHandler(),
          new CoordinateMediationV3MediatorMessageHandler(),
          new RoutingMessageHandler(),
          new PickupMediatorMessageHandler(),
        ],
      }),
      new DIDComm(),
      // @ts-ignore
      new MediationManagerPlugin(true, policyStore, mediationStore, recipientDidStore),
      ...(options?.plugins || []),
      DIDCommEventSniffer,
    ],
  })
}

export const agent = createMediatorAgent();

// export const agent = createAgent<IResolver & IKeyManager & IDIDManager & IDIDComm & IMessageHandler & IDataStore & IMediationManager & IDataStoreORM>({
//   plugins: [
//     new KeyManager({
//       store: new KeyStore(dbConnection),
//       kms: {
//         local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))),
//       },
//     }),
//     new DIDManager({
//       store: new DIDStore(dbConnection),
//       defaultProvider: 'did:peer',
//       providers: {
//         'did:peer': new PeerDIDProvider({
//           defaultKms: 'local',
//         })
//       },
//     }),
//     new DIDResolverPlugin({
//       resolver: new Resolver({
//         ...webDidResolver(),
//         ...peerDidResolver(),
//       }),
//     }),
//     new CredentialPlugin(),
//     new DIDComm({ transports: [new DIDCommHttpTransport()] }),
//     new MessageHandler({
//       messageHandlers: [
//         new DIDCommMessageHandler(),
//         new PickupMediatorMessageHandler(),
//         new CoordinateMediationV3MediatorMessageHandler(),
//         new RoutingMessageHandler(),
//       ],
//     }),
//     DIDCommEventSniffer,
//     new DataStore(dbConnection),
//     new DataStoreORM(dbConnection),
//     new MediationManagerPlugin(true, policyStore, mediationStore, recipientDidStore),
//   ],
// })