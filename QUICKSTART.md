# 🚀 Quick Start - Blockchain Document Registry

## 📋 Setup Checklist

### 1. ✅ Prerequisites Installed
- [x] Node.js v22.17.1 (LTS)
- [x] npm v10.9.2
- [x] Dependencies installed
- [x] Smart contracts compiled
- [x] Tests passing

### 2. 🔧 Next Steps

#### A. Configure Environment
```bash
# Copy configuration file
cp .env.example .env

# Edit settings (add your private key)
nano .env
```

#### B. Configure MetaMask

> 🦊 **Detailed Setup**: For complete instructions on MetaMask, development wallets, and security, see the [**Complete MetaMask Guide**](./GuideForMetaMask.md)

**Quick Setup:**
1. Install MetaMask extension
2. Add Polygon Mumbai network:
   - **Name**: Polygon Mumbai Testnet
   - **RPC URL**: https://rpc-mumbai.maticvigil.com
   - **Chain ID**: 80001
   - **Symbol**: MATIC
   - **Explorer**: https://mumbai.polygonscan.com

#### C. Get Test MATIC
1. Visit: https://faucet.polygon.technology/
2. Paste your wallet address
3. Request free MATIC

#### D. Deploy Contract
```bash
# Deploy to Mumbai network
npm run deploy:mumbai

# Copy contract address to .env
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x..." >> .env
```

#### E. Start Application
```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

---

## 🎯 Quick Test

### 1. Connect Wallet
- Click "Connect MetaMask"
- Approve connection
- Switch to Mumbai network if prompted

### 2. Register Document
- Enter document name
- Select a file
- Click "Register Document"
- Approve transaction in MetaMask

### 3. Verify Registration
- Copy document hash
- Use "Search Document" feature
- Verify information matches

---

## 🧪 Available Commands

```bash
# Project Management
npm install                    # Install dependencies
npm test                      # Run smart contract tests
npm run build                 # Build for production

# Smart Contract
npx hardhat compile           # Compile contracts
npx hardhat test             # Run tests
npx hardhat clean            # Clean artifacts

# Deployment
npx hardhat run scripts/deploy.js --network mumbai    # Deploy to Mumbai
npx hardhat run scripts/deploy.js --network localhost # Deploy locally

# Development Server
npm run dev                   # Start Next.js dev server
npm run start                # Start production server
npm run lint                 # Run ESLint

# Hardhat Network (Local Testing)
npx hardhat node            # Start local blockchain
npx hardhat console         # Interactive console
```

---

## 🔍 Testing Guide

### Unit Tests
```bash
# Run all tests
npm test

# Run specific test
npx hardhat test test/DocumentRegistry.test.js

# Test with gas reporting
npx hardhat test --gas
```

### Manual Testing Steps
1. **Register Document**
   - Upload different file types
   - Try duplicate registrations
   - Verify events are emitted

2. **Search Documents**
   - Search by valid hash
   - Search by invalid hash
   - Verify document information

3. **Transfer Documents**
   - Transfer to valid address
   - Try invalid addresses
   - Verify ownership change

### Expected Test Results
```bash
DocumentRegistry
  Document Registration
    ✔ Should register a document successfully
    ✔ Should not register document with empty hash
    ✔ Should not register document with empty name
    ✔ Should not register duplicate document
  Document Query
    ✔ Should return correct document information
    ✔ Should return documents by owner
    ✔ Should return correct total documents
  Document Transfer
    ✔ Should transfer document successfully
    ✔ Should not allow transfer by non-owner
    ✔ Should not transfer to zero address
    ✔ Should not transfer to same address

11 passing (947ms)
```

---

## 🎨 Frontend Features

### Wallet Integration
- ✅ MetaMask connection
- ✅ Network detection
- ✅ Account switching
- ✅ Balance display

### Document Management
- ✅ File hash calculation (SHA-256)
- ✅ Document registration
- ✅ Document search
- ✅ Ownership transfer
- ✅ Document listing

### User Experience
- ✅ Responsive design
- ✅ Real-time feedback
- ✅ Transaction status
- ✅ Error handling
- ✅ Loading states

---

## 🛠️ Troubleshooting

### Common Issues

#### MetaMask Connection
```bash
# Problem: MetaMask not connecting
# Solution: Refresh page, check extension permissions
```

#### Wrong Network
```bash
# Problem: Not on Mumbai testnet
# Solution: Switch network in MetaMask or use automatic switching
```

#### Insufficient Funds
```bash
# Problem: Not enough MATIC for gas
# Solution: Get more MATIC from faucet
```

#### Contract Not Found
```bash
# Problem: Contract address not set
# Solution: Deploy contract and update .env file
```

### Debug Commands
```bash
# Check contract deployment
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>

# Check network connection
npx hardhat run scripts/deploy.js --network mumbai

# Reset MetaMask
# MetaMask → Settings → Advanced → Reset Account
```

---

## 📚 Learning Resources

### Documentation
- [Hardhat Documentation](https://hardhat.org/docs/)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [MetaMask Documentation](https://docs.metamask.io/)

### Tutorials
- [Polygon Developer Portal](https://polygon.technology/developers/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**🔐 Remember: This is an educational demonstration using testnet. Never use real private keys in demo projects!**
