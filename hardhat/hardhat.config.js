/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('dotenv').config();
 require('@nomiclabs/hardhat-ethers')
 const { API_URL, PRIVATE_KEY } = process.env;
 module.exports = {
   solidity: "0.8.4",
   defaultNetwork: "ropsten",
   networks: {
     hardhat: {},
     ropsten: {
       url: API_URL,
       accounts: [`0x${PRIVATE_KEY}`]
     }
   },
   etherscan: {
     apiKey: "5AY19CM2GEMIIPSBUMIK635AXTTB36E6YX"
   },
 }
 