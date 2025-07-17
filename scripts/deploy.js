const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Iniciando deploy do DocumentRegistry...");

    // Obter o contrato
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");

    // Deploy do contrato
    console.log("📄 Fazendo deploy do contrato...");
    const documentRegistry = await DocumentRegistry.deploy();

    await documentRegistry.waitForDeployment();

    const contractAddress = await documentRegistry.getAddress();

    console.log("✅ DocumentRegistry deployado com sucesso!");
    console.log("📍 Endereço do contrato:", contractAddress);
    console.log("🌐 Rede:", (await ethers.provider.getNetwork()).name);

    // Salvar o endereço em um arquivo para uso no frontend
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

    console.log("💾 Endereço salvo em contract-address.json");
    console.log("\n🔧 Para usar no frontend, adicione ao seu .env:");
    console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Erro no deploy:", error);
        process.exit(1);
    });
