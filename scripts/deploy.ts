import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const hre = require("hardhat");

async function main() {
  
// const addr1 = "0x788bcf8Dc910F436deE33f0ccE5Dddb0eeCE7cB5" 
// const addr2 = "0x9a3a60f5aee7aef1fb0d4da8534452a2e2a89d46"
// const addr3= "0xE1d627A7fa1176AC7d024e68570c173b249e88Bb"
// const addr4 = "0xe5d4C9798b5352Ce2e83c39D6b5f0059eD5052d2"
// const addr5 = "0xfd5671504514c0214dfb30b1d820d71a891af913"
// const addr6 = "0x14fab7ffc93cecea209cd310a18eb1a760a904a0"
// const addr7 = "0xe32971a6c76188ee8eb336e80b97fc079dcedbeb"
// const addr8 = "0x3281e1230367bcdee7ff37331a1798b9f2af0c53"
// const addr9 = "0xc8211f26bb21afc25bb784208a63d96deaae55cb"
// const addr10 = "0x7aEe32638eA48cEE01458bA70317fa37cC2c90aE"

const ScarFaceToken = await ethers.getContractFactory("ScarFaceToken");
const scarfaceToken = await ScarFaceToken.deploy();
await scarfaceToken.deployed();
console.log(`ScarFace Token has been depliyed tp ${scarfaceToken.address}`);

const Airdrop = await ethers.getContractFactory("Airdrop");
const airdrop = await Airdrop.deploy(scarfaceToken.address, merkleroot);
await airdrop.deployed();
console.log(`Airdrop contract has een deployed to ${airdrop.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
