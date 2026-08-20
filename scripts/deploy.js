// import { ethers } from "hardhat";
// import fs from "fs";
// import process from "process";

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   console.log("Deploying contract with:", deployer.address);

//   const Registry = await ethers.getContractFactory("CertificateRegistry");
//   const registry = await Registry.deploy();
//   await registry.deployed();

//   console.log("CertificateRegistry deployed to:", registry.address);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
const { ethers, run } = require("hardhat");
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying DecentralizedOrgVerification...");
  
  const USDC_ADDRESS = process.env.USDC_ADDRESS;
  
  if (!USDC_ADDRESS) {
    console.error("❌ USDC_ADDRESS not found in .env");
    process.exit(1);
  }

  try {
    const factory = await hre.ethers.getContractFactory("DecentralizedOrgVerification");
    console.log("📦 Contract factory loaded");
    
    const contract = await factory.deploy(USDC_ADDRESS);
    console.log("⏳ Deployment transaction sent...");
    
    await contract.deployed();
    
    console.log("✅ Contract deployed to:", contract.address);
    console.log("\n📝 Save this address in .env:");
    console.log(`CONTRACT_ADDRESS=${contract.address}`);
    
    // Optional: Verify on Etherscan
    console.log("\n🔍 Waiting 30 seconds before Etherscan verification...");
    await new Promise(r => setTimeout(r, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [USDC_ADDRESS],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("ℹ️ Etherscan verification skipped (not critical)");
      console.log("You can verify manually later");
    }
    
  } catch (error) {
    console.error("❌ Deployment error:", error.message);
    process.exit(1);
  }
}

main();