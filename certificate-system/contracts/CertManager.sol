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

    constructor() {
    }

    function issueCert(string memory id, address _recipient) public {
        require(!doesExist[id], "Certificate already exists");

        certificates[id] = Cert({
            cert_id: id,
            owner: msg.sender,
            recipient: _recipient,
            date: block.timestamp,
            revoked: false
        });

        doesExist[id] = true;
    }

    function revokeCert(string memory id) public {
        require(doesExist[id], "Certificate doesn't exist");
        certificates[id].revoked = true;
    }

    function verifyCertificate(string memory id) public view returns (bool) {
        require(doesExist[id], "Certificate does not exist");
        return true;
    }

    function getCertDetails(string memory id) public view returns (address owner, address recipient) {
        require(doesExist[id], "Certificate does not exist");
        Cert memory cert = certificates[id];
        return (cert.owner, cert.recipient);
    }
}
