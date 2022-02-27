const { ethers } = require("hardhat");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");
require('dotenv').config();
const { API_URL, PRIVATE_KEY, PUBLIC_KEY, NFT_ADDRESS } = process.env;

async function main() {
  const provider = ethers.getDefaultProvider("ropsten", {
    alchemy: process.env.ALCHEMY_API_KEY,
  });

  const WALLET = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = await getContractAt(hre, "SmartArt", NFT_ADDRESS, WALLET);
  console.log(contract);
  
  const result = await contract.mint(PUBLIC_KEY, 1, 10, [], {
    gasLimit: 500_000,
  });
  console.log(result);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});
