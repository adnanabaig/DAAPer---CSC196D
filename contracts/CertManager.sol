// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract CertManager {
    struct Cert {
        string cert_id;
        address owner;
        address recipient;
        uint256 date;
        bool revoked;
        string title;
    }

    mapping(string => Cert) public certificates;
    mapping(string => bool) public doesExist;

    event CertIssued(string cert_id, address owner, address recipient);
    event CertRevoked(string cert_id, bool revoked);
    event CertVerify(string cert_id, bool revoked);

    uint256 public certCount;
    uint256 public verifiedCount;
    uint256 public shareCount;

    constructor() {
        certCount = 0;
        verifiedCount = 0;
        shareCount= 0;
    }

    function issueCert(string memory id, address cert_recipient, string memory titleIn) public {
        require(!doesExist[id], "Certificate already exists");

        certificates[id] = Cert({
            cert_id: id,
            owner: msg.sender,
            recipient: cert_recipient,
            date: block.timestamp,
            revoked: false,
            title: titleIn
        });
        doesExist[id] = true;
        certCount++;
        emit CertIssued(id, msg.sender, cert_recipient);
    }

    function revokeCert(string memory id) public {
        require(doesExist[id], "Certificate doesn't exist");
        require(certificates[id].owner == msg.sender, "Not Owner of this cert");
        certificates[id].revoked = true;
        certCount -= 1;
        emit CertRevoked(id, certificates[id].revoked);
    }

    function verifyCertificate(string memory id) public {
        require(doesExist[id], "Certificate does not exist");
        verifiedCount++;
        emit CertVerify(id, certificates[id].revoked);
    }   


    function getCertDetails(string memory id) public view returns (address owner, address recipient, bool revoked, string memory title) {
        require(doesExist[id], "Certificate does not exist");
        Cert memory cert = certificates[id];
        return (cert.owner, cert.recipient, cert.revoked, cert.title);
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
