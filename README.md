# 📄 Blockchain Document Registry

Demonstration of secure and immutable document registration using smart contracts on the Polygon Mumbai blockchain (free testnet).

## 📚 Documentation

- 📖 **[README.md](./README.md)** - Main project documentation
- 🦊 **[GuideForMetaMask.md](./GuideForMetaMask.md)** - Complete MetaMask guide for development
- 🚀 **[QUICKSTART.md](./QUICKSTART.md)** - Quick start and checklist

## 🎯 Features

- ✅ **Document Registration**: Calculate SHA-256 hash of any file and register on blockchain
- 🔍 **Authenticity Verification**: Check if a document was registered and get its information
- 🔄 **Ownership Transfer**: Transfer document ownership between addresses
- 👤 **Document Management**: View all your registered documents
- 🔗 **MetaMask Integration**: User-friendly Web3 wallet interface

## 🏗️ Architecture

### Smart Contract
- **Network**: Polygon Mumbai Testnet (free)
- **Language**: Solidity 0.8.19
- **Features**: Document registration, query and transfer
- **Security**: Ownership verification and input validation

### Frontend
- **Framework**: Next.js + React
- **Web3**: Ethers.js for blockchain interaction
- **Wallet**: MetaMask
- **Hash**: Crypto-js for SHA-256 calculation

## 🚀 How to Run

### 1. Prerequisites

- Node.js (v16 or higher)
- MetaMask installed in browser
- Account with test MATIC (Mumbai testnet)

> 📋 **New to MetaMask?** Check our [**Complete MetaMask Guide**](./GuideForMetaMask.md) for detailed configuration, development wallet creation, and security best practices.

### 2. Installation

```bash
# Clone the repository
git clone <your-repository>
cd blockchaindemo

# Install dependencies
npm install
```

### 3. Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

Configure the following variables in `.env`:

```env
# Private key of your wallet (for deployment)
PRIVATE_KEY=your_private_key_here

# Mumbai network RPC (already configured)
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com

# Contract address (will be filled after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Mumbai network Chain ID
NEXT_PUBLIC_CHAIN_ID=80001
```

### 4. Smart Contract Deployment

```bash
# Compile contract
npm run compile

# Run tests
npm run test

# Deploy to Mumbai network
npm run deploy:mumbai
```

After deployment, copy the contract address and add to `.env` file:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 5. Run Frontend

```bash
# Development mode
npm run dev

# Or build for production
npm run build
npm start
```

Access: http://localhost:3000

## 📱 How to Use

### 1. Configure MetaMask

> 🦊 **For detailed configuration**: Check the [**Complete MetaMask Guide**](./GuideForMetaMask.md) that explains:
> - How to create separate wallets for development vs real use
> - Security configuration and best practices
> - How to obtain and configure private keys
> - Common troubleshooting

**Quick Configuration:**
1. Install MetaMask extension
2. Add Polygon Mumbai network:
   - **Name**: Polygon Mumbai Testnet
   - **RPC URL**: https://rpc-mumbai.maticvigil.com
   - **Chain ID**: 80001
   - **Symbol**: MATIC
   - **Explorer**: https://mumbai.polygonscan.com

### 2. Get Test MATIC

Visit the [Polygon Faucet](https://faucet.polygon.technology/) and request free MATIC for your wallet.

### 3. Connect Wallet

1. Click "Connect MetaMask"
2. Approve the connection
3. Confirm switching to Mumbai network if requested

### 4. Register Document

1. Enter document name
2. Select file
3. Click "Register Document"
4. Confirm transaction in MetaMask
5. Wait for blockchain confirmation

### 5. Verify Document

1. Paste document hash in query field
2. Click "Query"
3. View information if document is registered

### 6. Transfer Ownership

1. Enter document hash
2. Enter destination address
3. Click "Transfer Ownership"
4. Confirm transaction

## 🧪 Tests

```bash
# Run all tests
npm test

# Run with coverage
npx hardhat coverage
```

## 📊 Usage Example

### Scenario: Contract Registration

1. **Upload**: Company A uploads a PDF contract
2. **Hash**: System calculates SHA-256: `a1b2c3d4e5f6...`
3. **Registration**: Transaction registers hash on blockchain
4. **Verification**: Anyone can verify authenticity
5. **Transfer**: Company A transfers to Company B

### Advantages

- ✅ **Immutability**: Records cannot be altered
- ✅ **Transparency**: Anyone can verify
- ✅ **Low Cost**: Mumbai testnet is free
- ✅ **Decentralization**: No single point of failure
- ✅ **Timestamping**: Proof of temporal existence

## 🔧 Development

### Project Structure

```
blockchaindemo/
├── contracts/          # Solidity smart contracts
├── scripts/            # Deployment scripts
├── test/               # Automated tests
├── pages/              # Next.js pages
├── components/         # React components
├── styles/             # CSS styles
├── hardhat.config.js   # Hardhat configuration
└── package.json        # Dependencies
```

### Main Smart Contract

```solidity
// Main functions of DocumentRegistry.sol
function registerDocument(string _hash, string _name) public
function isDocumentRegistered(string _hash) public view returns (bool)
function getDocument(string _hash) public view returns (Document)
function transferDocument(string _hash, address _newOwner) public
```

### Useful Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Local deployment
npx hardhat node
npm run deploy:local

# Verify contract (after deployment)
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## 🌍 Supported Networks

### Mumbai Testnet (Recommended)
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

### Local (Development)
- **Chain ID**: 1337
- **RPC**: http://localhost:8545

## 🛡️ Security

- ✅ Input validations in contracts
- ✅ Ownership verifications
- ✅ Reentrancy protection
- ✅ Events for auditing
- ✅ Comprehensive tests

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

### Common Issues

**"MetaMask not detected"**
- Install MetaMask extension
- Reload the page

**"Wrong network"**
- Configure Mumbai network in MetaMask
- Use Chain ID 80001

**"Insufficient balance"**
- Get free MATIC from faucet
- Wait a few minutes

**"Transaction failed"**
- Check if you have enough MATIC
- Try increasing gas price

### Useful Links

- [MetaMask](https://metamask.io/)
- [Polygon Faucet](https://faucet.polygon.technology/)
- [Mumbai Explorer](https://mumbai.polygonscan.com/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Next.js Docs](https://nextjs.org/docs)

## 🎓 Learned Concepts

This project demonstrates:

- 📝 **Smart Contracts**: Development and deployment
- 🔗 **Web3 Integration**: Frontend with blockchain
- 🔐 **Cryptography**: Hashing and verification
- 💰 **DeFi Basics**: Transactions and gas
- 🏗️ **DApp Architecture**: Development patterns
- 🧪 **Testing**: Automated testing
- 🚀 **Deployment**: Testnet deployment

---

**Made with ❤️ to demonstrate the power of blockchain in document authentication**
