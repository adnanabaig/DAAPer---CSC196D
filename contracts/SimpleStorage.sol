//contracts/SimpleStorage.sol
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint public data;

    function setData(uint _data) public {
        data = _data;
    }
}