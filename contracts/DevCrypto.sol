//SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DevCrypto is ERC20 {
    constructor() ERC20('DevCrypto', 'DEVCRYPT') {
        _mint(msg.sender, 100 * 10 ** 18);
    }
}