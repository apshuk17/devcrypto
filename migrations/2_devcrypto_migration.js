const DevCrypto = artifacts.require('DevCrypto');

module.exports = function (deployer) {
    deployer.deploy(DevCrypto);
}