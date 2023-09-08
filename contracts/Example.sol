// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Example {
    string public name;

    function setName(string memory _name) public {
        name = _name;
    }
}
