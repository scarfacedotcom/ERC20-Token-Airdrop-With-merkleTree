import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';
import { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";
import {MerkleTree} from "merkletreejs"


    type WorldCity = {
        user_address: number;
        amount: number;
    };

async function main() {
    const csvFilePath = path.resolve(__dirname, '../files/myAddresses.csv');
    let root: string[] = [];
    const headers = ['user_address', 'amount'];
    let leaves: string[] = [];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

    parse(fileContent, {
      delimiter: ',',
      columns: headers,
    }, (error, result: WorldCity[]) => {
      if (error) {
        console.error(error);
      }
  
    //   console.log("Result", result);
      
      const jsonData = JSON.stringify(result);

      fs.writeFileSync('data.json', jsonData);


      /////////
      //read from json file
      ////////

      const fileD = fs.readFileSync(`data.json`, `utf-8`);
      const jsonDataNew = JSON.parse(fileD);
      jsonDataNew.shift();
    //   console.log(jsonDataNew);

      for (let i = 0; i < jsonDataNew.length; i++){
        let address = jsonDataNew[i].user_address;
        let amount = jsonDataNew[i].amount;
        let leaf = ethers.utils.solidityKeccak256(['address','uint256'],[address,amount]);
        leaves.push(leaf);
        // console.log(leaf);
      }
    //   console.log(leaves);
      ///////////////////////
      // write the leaves to a new file
      /////////////////////////
      let leavesData = JSON.stringify(leaves);
      fs.writeFileSync('leavesData.json', leavesData); 


      //////////////////////////////////
      /// generate a merkle root
      //////////////////////////////////

      const tree = new MerkleTree(leaves, keccak256);
      let userRoot = tree.getRoot().toString('hex')
      let rootData = JSON.stringify(userRoot);
      fs.writeFileSync('rootData.json', rootData); 
      console.log(root);
      root.push(userRoot);

      console.log(root);
      const testleaf = `0xcf72e6196b15614346d215340cacca02dc9e4d164ca63f20b25266d927ba0c9e`;
      const proof = tree.getProof(testleaf);
      console.log(tree.verify(proof, testleaf, root[0]));



      /////////////////////////////////////////////////////////////
      /// token deployment and interaction

  
    })
    console.log(root);
    const ScarFaceToken = await ethers.getContractFactory("ScarFaceToken");
    const scarfaceToken = await ScarFaceToken.deploy();
    await scarfaceToken.deployed();
    console.log(`ScarFace Token has been depliyed tp ${scarfaceToken.address}`);

    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(scarfaceToken.address, root);
    await airdrop.deployed();
    console.log(`Airdrop contract has een deployed to ${airdrop.address}`);

}
    main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });