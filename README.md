# ClinicalSync

ClinicalSync is an SSI solution for the clinical domain. It is envisioned as a daily application for patients and healthcare professionals. For that, this solution implements an agent-based model with edge and cloud agents. The edge agent contains the logic of a mobile application that allows the creation and management of DIDs and VCs, as well as connections between different edge agents. In contrast, the cloud agent implements the mediator functionality for the communication between the different agents and the connection with the Blockchain platform, acting as a Verifiable Data Registry (VDR).

## Main features
The current version of the solution offers different features as follows:

- Registration and authentication of users
- Creation and management of Decentralized Identifiers (DIDs)
- Use of blockchain platform as VDR
- Creation and management of connections between users (edge agent)
- Creation, management, and verification of Verifiable Credentials (VCs)
- Exchanging of health data through VCs
- ...future features to come

## Technologies used
This solution is a combination of the most innovative open-source solutions available in the current context:

- Edge agent: [React-native](https://reactnative.dev/) language, [Expo](https://expo.dev/) app, and [Veramo](https://veramo.io/) framework
- Cloud agent: [React](https://es.react.dev/) language, [Veramo](https://veramo.io/) framework
- Blockchain platform: [Hyperledger Fabric](https://www.hyperledger.org/projects/fabric)
- Smart contract: Javascript language

## Getting started with ClinicalSync
To use this solution, you must download this repository and deploy each component. As a preliminary step, you should instantiate [Hyperledger Fabric](https://www.hyperledger.org/projects/fabric) using the documentation available in the [fabric-samples](https://github.com/hyperledger/fabric-samples/tree/main) repository. Please follow all the prerequisites and steps to deploy the [test-network](https://github.com/hyperledger/fabric-samples/tree/main/test-network) delivered in the repository.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
