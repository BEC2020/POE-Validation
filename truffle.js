
require('babel-register')


var HDWalletProvider = require("truffle-hdwallet-provider");

// const HDWalletProvider = require("truffle-hdwallet-provider-privkey");

var mnemonic = "bean buffalo park similar ladder gown shove melody alone globe ordinary finish";

// const privKey = "ba86e515a5cb3d1c189a8d7b902c4a5823d0eb47c2c674a31efc8ce97d8e214f";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"),
      network_id: 4,
      gas: 4600000
    }
  }
};
