// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateSystem {
    mapping(address => bool) public issuers;
    mapping(string => bool) public issuedCertificates;
    
    // Issue a certificate
    function issueCertificate(string memory certificateID) public {
        require(issuers[msg.sender], "You are not authorized to issue certificates");
        require(!issuedCertificates[certificateID], "Certificate already issued");
        
        issuedCertificates[certificateID] = true;
    }
    
    // Verify a certificate
    function verifyCertificate(string memory certificateID) public view returns (bool) {
        return issuedCertificates[certificateID];
    }
    
    // Add an issuer
    function addIssuer(address issuer) public {
        issuers[issuer] = true;
    }
    
    // Revoke a certificate
    function revokeCertificate(string memory certificateID) public {
        require(issuers[msg.sender], "You are not authorized to revoke certificates");
        require(issuedCertificates[certificateID], "Certificate not found");
        
        issuedCertificates[certificateID] = false;
    }
}
