#!/bin/bash

echo "🚀 Blockchain Document Registry Project Setup"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Check if using correct version
if [ -f ".nvmrc" ] && command -v nvm &> /dev/null; then
    echo "🔧 Using nvm to set correct Node.js version..."
    nvm use
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Compile contracts
echo "⚙️ Compiling smart contracts..."
npm run compile

# Run tests
echo "🧪 Running tests..."
npm run test

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy .env.example to .env and configure your keys"
echo "2. Run 'npm run deploy:mumbai' to deploy to testnet"
echo "3. Run 'npm run dev' to start development server"
echo ""
echo "🔗 Useful links:"
echo "- Mumbai Faucet: https://faucet.polygon.technology/"
echo "- Mumbai Explorer: https://mumbai.polygonscan.com/"
echo "- MetaMask: https://metamask.io/"
echo ""
echo "🎉 Ready to start!"
