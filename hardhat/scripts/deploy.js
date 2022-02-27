const { ethers } = require("hardhat");

async function main() {
  const SmartArt1of1 = await ethers.getContractFactory("SmartArt1of1");
  const smartArt1of1 = await SmartArt1of1.deploy();
  console.log("Contract deployed to address:", smartArt1of1.address);

  const SmartArtEditionOfN = await ethers.getContractFactory("SmartArtEditionOfN");
  const smartArtEditionOfN = await SmartArtEditionOfN.deploy();
  console.log("Contract deployed to address:", smartArtEditionOfN.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
