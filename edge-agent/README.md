# Edge Agent

This folder contains the functionality for the Edge Agent component of the Clinical SSI Project. This component implements the SSI functionality to create and manage DIDs and VCs. In this agent, the patient clinical data are stored and managed.

## Functionality

The Edge Agent is responsible for:

- Process and manage the clinical information.
- Create and store the DIDs used for the different connections patients-doctors-laboratories.
- Create and manage the VCs created for the exchanging of prescriptions and laboratory results.

## Usage

To use the Edge Agent functionality, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `edge-agent` folder.
3. Install the required dependencies by running `pnpm install --force`.
5. Start the Edge Agent by running `npm start -- -c`.

## Contributing

If you would like to contribute to the development of the Edge Agent functionality, please follow the guidelines outlined in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).
