var Verify = artifacts.require("./Verify.sol");
module.exports = function(deployer) {
  deployer.deploy(Verify, {gas: 6700000});
};
