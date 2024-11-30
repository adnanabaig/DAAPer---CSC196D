// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract CertManager {
    struct Cert {
        string cert_id;
        address owner;
        address recipient;
        uint256 date;
        bool revoked;
    }

    mapping(string => Cert) public certificates;
    mapping(string => bool) public doesExist;

    event CertIssued(string cert_id, address owner, address recipient);
    event CertRevoked(string cert_id, address owner);

    uint256 public certCount;
    uint256 public verifiedCount;
    uint256 public shareCount;

    constructor() {
        certCount = 0;
        verifiedCount = 0;
        shareCount= 0;
    }

    function issueCert(string memory id, address cert_recipient) public {
        require(!doesExist[id], "Certificate already exists");

        certificates[id] = Cert({
            cert_id: id,
            owner: msg.sender,
            recipient: cert_recipient,
            date: block.timestamp,
            revoked: false
        });
        doesExist[id] = true;
        certCount++;
        emit CertIssued(id, msg.sender, cert_recipient);
    }

    function revokeCert(string memory id) public {
        require(doesExist[id], "Certificate doesn't exist");
        require(certificates[id].owner == msg.sender, "Not Owner of this cert");
        certificates[id].revoked = true;
        emit CertRevoked(id, msg.sender);
    }

    function verifyCertificate(string memory id) public returns (bool exists, bool revoked) {
        require(doesExist[id], "Certificate does not exist");
        verifiedCount++;
        return (true, certificates[id].revoked);
    }   


    function getCertDetails(string memory id) public view returns (address owner, address recipient, bool revoked) {
        require(doesExist[id], "Certificate does not exist");
        Cert memory cert = certificates[id];
        return (cert.owner, cert.recipient, cert.revoked);
    }

    function countIssued () public view returns (uint256){
        return certCount;
    }

    function countVerified () public view returns (uint256){
        return verifiedCount;
    }

    function countShares () public view returns (uint256){
        return shareCount;
    }
}
