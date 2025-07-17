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

                // Configurar contrato se o endereço estiver disponível
                if (contractAddress) {
                    const contract = new ethers.Contract(contractAddress, contractABI, signer);
                    setContract(contract);
                }

                // Verificar rede
                const network = await provider.getNetwork();
                if (network.chainId !== 80001n) { // Mumbai testnet
                    try {
                        await window.ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: '0x13881' }], // 80001 em hex
                        });
                    } catch (switchError) {
                        // Se a rede não estiver adicionada, adicionar
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
                alert('MetaMask não detectado! Por favor, instale a extensão MetaMask.');
            }
        } catch (error) {
            console.error('Erro ao conectar carteira:', error);
            alert('Erro ao conectar carteira. Verifique o console para mais detalhes.');
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
        // Verificar se já estava conectado
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
                        📄 Registro de Documentos Blockchain
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Demonstração de registro seguro e imutável de documentos usando smart contracts
                        na blockchain Polygon Mumbai (testnet gratuita)
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
                            <p className="font-semibold">⚠️ Contrato não configurado</p>
                            <p>O endereço do contrato não foi configurado. Execute o deploy primeiro e configure a variável NEXT_PUBLIC_CONTRACT_ADDRESS no arquivo .env</p>
                        </div>
                    ) : null}
                </div>

                <footer className="text-center mt-16 text-gray-500">
                    <p>Demonstração educacional - Blockchain Document Registry</p>
                    <p className="text-sm mt-2">
                        Rede: Polygon Mumbai Testnet |
                        Tokens MATIC gratuitos: <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Polygon Faucet</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}
