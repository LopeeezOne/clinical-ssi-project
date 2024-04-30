/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

@Info({title: 'DIDVerify', description: 'Smart contract for managing DIDs'})
export class DIDVerifyContract extends Contract {

    // CreateDID issues a new DID to the world state with given details.
    @Transaction()
    public async CreateDID(ctx: Context, id: string, document: string): Promise<void> {
        const exists = await this.DIDExists(ctx, id);
        if (exists) {
            throw new Error(`The DID ${id} already exists`);
        }

        const DID = {
            ID: id,
            Document: document,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(DID))));
    }

    // ReadDID returns the DID stored in the world state with given id.
    @Transaction(false)
    public async ReadDID(ctx: Context, id: string): Promise<string> {
        const DIDJSON = await ctx.stub.getState(id); // get the DID from chaincode state
        if (!DIDJSON || DIDJSON.length === 0) {
            throw new Error(`The DID ${id} does not exist`);
        }
        return DIDJSON.toString();
    }

    // UpdateDID updates an existing DID in the world state with provided parameters.
    @Transaction()
    public async UpdateDID(ctx: Context, id: string, document: string): Promise<void> {
        const exists = await this.DIDExists(ctx, id);
        if (!exists) {
            throw new Error(`The DID ${id} does not exist`);
        }

        // overwriting original DID with new DID
        const updatedDID = {
            ID: id,
            Document: document,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedDID))));
    }

    // DeleteDID deletes an given DID from the world state.
    @Transaction()
    public async DeleteDID(ctx: Context, id: string): Promise<void> {
        const exists = await this.DIDExists(ctx, id);
        if (!exists) {
            throw new Error(`The DID ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // DIDExists returns true when DID with given ID exists in world state.
    @Transaction(false)
    @Returns('boolean')
    public async DIDExists(ctx: Context, id: string): Promise<boolean> {
        const DIDJSON = await ctx.stub.getState(id);
        return (!!DIDJSON && DIDJSON.length > 0);
    }
}

// @Transaction()
//     public async InitLedger(ctx: Context): Promise<void> {
//         const DIDs: DID[] = [
//             {
//                 ID: 'DID1',
//                 Color: 'blue',
//                 Size: 5,
//                 Owner: 'Tomoko',
//                 AppraisedValue: 300,
//             },
//             {
//                 ID: 'DID2',
//                 Color: 'red',
//                 Size: 5,
//                 Owner: 'Brad',
//                 AppraisedValue: 400,
//             },
//             {
//                 ID: 'DID3',
//                 Color: 'green',
//                 Size: 10,
//                 Owner: 'Jin Soo',
//                 AppraisedValue: 500,
//             },
//             {
//                 ID: 'DID4',
//                 Color: 'yellow',
//                 Size: 10,
//                 Owner: 'Max',
//                 AppraisedValue: 600,
//             },
//             {
//                 ID: 'DID5',
//                 Color: 'black',
//                 Size: 15,
//                 Owner: 'Adriana',
//                 AppraisedValue: 700,
//             },
//             {
//                 ID: 'DID6',
//                 Color: 'white',
//                 Size: 15,
//                 Owner: 'Michel',
//                 AppraisedValue: 800,
//             },
//         ];

//         for (const DID of DIDs) {
//             DID.docType = 'DID';
//             // example of how to write to world state deterministically
//             // use convetion of alphabetic order
//             // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
//             // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
//             await ctx.stub.putState(DID.ID, Buffer.from(stringify(sortKeysRecursive(DID))));
//             console.info(`DID ${DID.ID} initialized`);
//         }
//     }


// @Transaction
//     public EventModel addevent(Context ctx, String title, String type, String body, String eventInfo) {
//         long beginning = System.nanoTime();
//         try {
//             MessageDigest digest = MessageDigest.getInstance("SHA-256");
//             String id=Base64.toBase64String(digest.digest((title+type+body+eventInfo).getBytes(StandardCharsets.UTF_8)));
//             ChaincodeStub stub = ctx.getStub();
//             EventModel event = new EventModel(title, EventType.valueOf(type), body,eventInfo);
//             long beforeLedger = System.nanoTime();
//             stub.putStringState("did:"+ id, genson.serialize(event));
//             System.out.println("addevent: putStringState: Time: " + (System.nanoTime() - beforeLedger));
//             System.out.println("addevent: Time: " + (System.nanoTime() - beginning));
//             return event;
//         } catch (NoSuchAlgorithmException e) {
//             throw new ChaincodeException("Internal server error could not retrieve hashing algorithm", "Service already exists");
//         }
//     }

    // // TransferDID updates the owner field of DID with given id in the world state, and returns the old owner.
    // @Transaction()
    // public async TransferDID(ctx: Context, id: string, newOwner: string): Promise<string> {
    //     const DIDString = await this.ReadDID(ctx, id);
    //     const DID = JSON.parse(DIDString);
    //     const oldOwner = DID.Owner;
    //     DID.Owner = newOwner;
    //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    //     await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(DID))));
    //     return oldOwner;
    // }

    // GetAllDIDs returns all DIDs found in the world state.
    // @Transaction(false)
    // @Returns('string')
    // public async GetAllDIDs(ctx: Context): Promise<string> {
    //     const allResults = [];
    //     // range query with empty string for startKey and endKey does an open-ended query of all DIDs in the chaincode namespace.
    //     const iterator = await ctx.stub.getStateByRange('', '');
    //     let result = await iterator.next();
    //     while (!result.done) {
    //         const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push(record);
    //         result = await iterator.next();
    //     }
    //     return JSON.stringify(allResults);
    // }
