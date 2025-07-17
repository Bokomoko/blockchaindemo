import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DocumentRegistry from '../components/DocumentRegistry';
import WalletConnection from '../components/WalletConnection';

export default function Home() {
    const [account, setAccount] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const contractABI = [
        "function registerDocument(string memory _hash, string memory _name) public",
        "function isDocumentRegistered(string memory _hash) public view returns (bool)",
        "function getDocument(string memory _hash) public view returns (tuple(string hash, string name, address owner, uint256 timestamp, bool exists))",
        "function transferDocument(string memory _hash, address _newOwner) public",
        "function getDocumentsByOwner(address _owner) public view returns (string[] memory)",
        "function getTotalDocuments() public view returns (uint256)",
        "function getAllDocuments() public view returns (string[] memory)",
        "event DocumentRegistered(string indexed documentHash, string name, address indexed owner, uint256 timestamp)",
        "event DocumentTransferred(string indexed documentHash, address indexed previousOwner, address indexed newOwner, uint256 timestamp)"
    ];

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();

                setProvider(provider);
                setSigner(signer);
                setAccount(accounts[0]);
                setIsConnected(true);

                // Configure contract if address is available
                if (contractAddress) {
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(contract);
                }

                // Check network
                const network = await provider.getNetwork();
                if (network.chainId !== 80001n) { // Mumbai testnet
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x13881' }], // 80001 in hex
                        });
                    } catch (switchError) {
                        // If network is not added, add it
                        if (switchError.code === 4902) {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: '0x13881',
                                    chainName: 'Polygon Mumbai Testnet',
                                    nativeCurrency: {
                                        name: 'MATIC',
                                        symbol: 'MATIC',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                                    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                                }]
                            });
                        }
                    }
                }
            } else {
                alert('MetaMask not detected! Please install the MetaMask extension.');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Error connecting wallet. Check console for more details.');
        }
    };

    const disconnectWallet = () => {
        setAccount('');
        setProvider(null);
        setSigner(null);
        setContract(null);
        setIsConnected(false);
    };

    useEffect(() => {
        // Check if already connected
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    await connectWallet();
                }
            }
        };
        checkConnection();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        📄 Blockchain Document Registry
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Demonstration of secure and immutable document registration using smart contracts
                        on the Polygon Mumbai blockchain (free testnet)
                    </p>
                </header>

                <div className="max-w-4xl mx-auto">
                    <WalletConnection
                        isConnected={isConnected}
                        account={account}
                        onConnect={connectWallet}
                        onDisconnect={disconnectWallet}
                    />

                    {isConnected && contract ? (
                        <DocumentRegistry
                            contract={contract}
                            account={account}
                            provider={provider}
                        />
                    ) : isConnected && !contractAddress ? (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
                            <p className="font-semibold">⚠️ Contract not configured</p>
                            <p>The contract address is not configured. Deploy the contract first and set the NEXT_PUBLIC_CONTRACT_ADDRESS variable in the .env file</p>
                        </div>
                    ) : null}
                </div>

                <footer className="text-center mt-16 text-gray-500">
                    <p>Educational demonstration - Blockchain Document Registry</p>
                    <p className="text-sm mt-2">
                        Network: Polygon Mumbai Testnet |
                        Free MATIC tokens: <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Polygon Faucet</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}
