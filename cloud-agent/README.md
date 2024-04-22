## Cloud Agent (Mediator)

This code implements a cloud agent to act as a mediator for edge agents. The library used is Veramo [https://veramo.io/](https://veramo.io/), which provide us the capability to manage Verifiable Data (Decentralized identifiers, Verifiable credentials and presentations, etc.).

Initial example taken from Veramo Node Tutorial: [https://veramo.io/docs/node_tutorials/node_setup_identifiers](https://veramo.io/docs/node_tutorials/node_setup_identifiers)

## Functionality

The Cloud Agent is responsible for:

- Act as a mediator for the edge agents.
- Manage the communication with the Blockchain platform, which acts as a Verifiable Data Registry.

## Usage
To use the Cloud Agent functionality, follow these steps:

1. yarn add    
2. yarn ts-node --esm ./src/index.ts

## Contributing

If you would like to contribute to the development of the Edge Agent functionality, please follow the guidelines outlined in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).