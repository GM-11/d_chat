// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
const { HardhatUserConfig } = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox");

const config: typeof HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  paths: {
    artifacts: "./artifacts"
  }

};

module.exports = config;
