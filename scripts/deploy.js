const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting DocumentRegistry deployment...");

    // Get contract factory
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");

    // Deploy contract
    console.log("📄 Deploying contract...");
    const documentRegistry = await DocumentRegistry.deploy();

    await documentRegistry.waitForDeployment();

    const contractAddress = await documentRegistry.getAddress();

    console.log("✅ DocumentRegistry deployed successfully!");
    console.log("📍 Contract address:", contractAddress);
    console.log("🌐 Network:", (await ethers.provider.getNetwork()).name);

    // Save address to file for frontend use
    const fs = require("fs");
    const contractInfo = {
        address: contractAddress,
        network: (await ethers.provider.getNetwork()).name,
        deployedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        "./contract-address.json",
        JSON.stringify(contractInfo, null, 2)
    );

    console.log("💾 Address saved to contract-address.json");
    console.log("\n🔧 To use in frontend, add to your .env:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment error:", error);
        process.exit(1);
    });
