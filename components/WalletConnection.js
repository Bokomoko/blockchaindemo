import { useState } from 'react';

export default function WalletConnection({ isConnected, account, onConnect, onDisconnect }) {
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await onConnect();
        } catch (error) {
            console.error('Connection error:', error);
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
                        🔗 Wallet Connection
                    </h2>
                    {isConnected ? (
                        <div>
                            <p style={{ color: '#059669', fontWeight: '500' }}>✅ Connected</p>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Address: {formatAddress(account)}
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280' }}>
                            Connect your MetaMask wallet to get started
                        </p>
                    )}
                </div>

                <div>
                    {isConnected ? (
                        <button onClick={onDisconnect} className="btn-secondary">
                            Disconnect
                        </button>
                    ) : (
                        <button
                            onClick={handleConnect}
                            className="btn-primary"
                            disabled={isConnecting}
                            style={{ opacity: isConnecting ? 0.6 : 1 }}
                        >
                            {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
                        </button>
                    )}
                </div>
            </div>

            {!isConnected && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📋 Instructions:</h3>
                    <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                        <li>Install the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>MetaMask</a> extension</li>
                        <li>Configure the Polygon Mumbai Testnet network</li>
                        <li>Get free MATIC from the <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>Polygon Faucet</a></li>
                        <li>Click "Connect MetaMask"</li>
                    </ol>
                </div>
            )}
        </div>
    );
}
