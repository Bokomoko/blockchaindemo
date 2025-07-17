import { useState } from 'react';

export default function WalletConnection({ isConnected, account, onConnect, onDisconnect }) {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await onConnect();
        } catch (error) {
            console.error('Erro na conexão:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        🔗 Conexão da Carteira
                    </h2>
                    {isConnected ? (
                        <div>
                            <p style={{ color: '#059669', fontWeight: '500' }}>✅ Conectado</p>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Endereço: {formatAddress(account)}
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280' }}>
                            Conecte sua carteira MetaMask para começar
                        </p>
                    )}
                </div>

                <div>
                    {isConnected ? (
                        <button onClick={onDisconnect} className="btn-secondary">
                            Desconectar
                        </button>
                    ) : (
                        <button
                            onClick={handleConnect}
                            className="btn-primary"
                            disabled={isConnecting}
                            style={{ opacity: isConnecting ? 0.6 : 1 }}
                        >
                            {isConnecting ? 'Conectando...' : 'Conectar MetaMask'}
                        </button>
                    )}
                </div>
            </div>

            {!isConnected && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📋 Instruções:</h3>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                        <li>Instale a extensão <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>MetaMask</a></li>
                        <li>Configure a rede Polygon Mumbai Testnet</li>
                        <li>Obtenha MATIC gratuitos no <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Polygon Faucet</a></li>
                        <li>Clique em "Conectar MetaMask"</li>
                    </ol>
                </div>
            )}
        </div>
    );
}
