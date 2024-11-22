const { article } = require("framer-motion/client");

const CertificateSystem = artifacts.require("CertificateSystem");
const UserRoles = artifacts.require("UserRoles");
const Storage = artifacts.require("Storage");
const CertManager = artifacts.require("CertManager");

module.exports = function (deployer) {
  deployer.deploy(CertificateSystem);
  deployer.deploy(UserRoles);
  deployer.deploy(Storage);
  deployer.deploy(CertManager);
};
