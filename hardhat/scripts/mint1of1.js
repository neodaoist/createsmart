const { ethers } = require("hardhat");
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");
require('dotenv').config();
const { API_URL, PRIVATE_KEY, PUBLIC_KEY, ONEOFONE_ADDRESS } = process.env;

async function main() {
  const provider = ethers.getDefaultProvider("ropsten", {
    alchemy: process.env.ALCHEMY_API_KEY,
  });

  const WALLET = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = await getContractAt(hre, "SmartArt1of1", ONEOFONE_ADDRESS, WALLET);
  console.log(contract);
  
  const result = await contract.safeMint(PUBLIC_KEY, {
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
