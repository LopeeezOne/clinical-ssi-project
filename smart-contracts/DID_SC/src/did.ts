/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';

@Object()
export class DID {
    @Property()
    public ID: string;

    @Property()
    public Document: string; //JSON
}

// @Object()
// export class DID {
//     @Property()
//     public docType?: string;

//     @Property()
//     public ID: string;

//     @Property()
//     public Color: string;

//     @Property()
//     public Size: number;

//     @Property()
//     public Owner: string;

//     @Property()
//     public AppraisedValue: number;
// }