// import { ethers } from "hardhat";
const { ethers } = require("hardhat");

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;

  // const lockedAmount = ethers.parseEther("0.001");

  // const lock = await ethers.getContractFactory("Chat");

  // await lock.deployed();

  // console.log(
  //   `Lock with ${ethers.formatEther(
  //     lockedAmount
  //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  // );

  const [owner, otherAccount] = await ethers.getSigners();
  // const Chat = await ethers.getContractFactory("Chat");
  // const chat = await Chat.deploy();
  // await chat.waitForDeployment();
  const chat = await ethers.deployContract("Chat");
  console.log("Chat deployed to:", await chat.getAddress());
  console.log("Chat deployed by:", owner.address);
  // console.log("Chat deployed by:", otherAccount.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
