const { ethers } = require("hardhat");

async function main() {
  const SmartArt = await ethers.getContractFactory("SmartArt");
  const smartArt = await SmartArt.deploy();
  console.log("1 of 1 contract deployed to address:", smartArt.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
