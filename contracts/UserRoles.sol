// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract UserRoles {
    enum Role { None, Issuer, Verifier, Recipient }

    mapping(address => Role) private userRoles;
    address public owner;

    // Set the deployer as the owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to check only owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Function to assign roles
    function setUserRole(address user, Role role) public onlyOwner {
        userRoles[user] = role;
    }

    // Function to get user role
    function getUserRole(address user) public view returns (Role) {
        return userRoles[user];
    }

    // Helper functions to check roles
    function isIssuer(address user) public view returns (bool) {
        return userRoles[user] == Role.Issuer;
    }

    function isVerifier(address user) public view returns (bool) {
        return userRoles[user] == Role.Verifier;
    }

    function isRecipient(address user) public view returns (bool) {
        return userRoles[user] == Role.Recipient;
    }
}
