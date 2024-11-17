const CertificateSystem = artifacts.require("CertificateSystem");
const UserRoles = artifacts.require("UserRoles");
const Storage = artifacts.require("Storage");

module.exports = function (deployer) {
  deployer.deploy(CertificateSystem);
  deployer.deploy(UserRoles);
  deployer.deploy(Storage);
};
