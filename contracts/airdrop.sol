// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop {
    bytes32 public merkleRoot;
    address public contractAddress;
    mapping(address => bool) public whitelistClaimed;

    constructor(address _contractAddress, bytes32 _merkleRoot) {
        contractAddress = _contractAddress;
        merkleRoot = _merkleRoot;
    }

    function claim(
        bytes32[] calldata _merkleProof,
        uint256 _amount
    ) external returns (bool) {
        require(!whitelistClaimed[msg.sender], "Address already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));
        if (!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) {
            return false;
        }

        whitelistClaimed[msg.sender] = true;

        IERC20(contractAddress).transfer(msg.sender, _amount);
        return true;
    }
}
