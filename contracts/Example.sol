// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Example {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }

    function setName(string memory _name) public {
        name = _name;
    }
}
