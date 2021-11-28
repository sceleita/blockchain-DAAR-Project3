var SCeleitaContract = artifacts.require("./SCeleitaContract.sol");

module.exports = function(deployer) {
    deployer.deploy(SCeleitaContract);
};
