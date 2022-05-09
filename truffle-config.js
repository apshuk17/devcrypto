const path = require('path');
// const fs = require('fs');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = process.env.MNEMONIC.trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  contracts_build_directory: path.join(__dirname, "/public/contracts"),
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/8a9235fb47ae47b7a35ad33a69f9805f'),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.11", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
};
