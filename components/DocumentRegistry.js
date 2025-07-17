import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

export default function DocumentRegistry({ contract, account, provider }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // States for document registration
    const [documentName, setDocumentName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [registering, setRegistering] = useState(false);

    // States for search
    const [searchHash, setSearchHash] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    // States for transfer
    const [transferHash, setTransferHash] = useState('');
    const [transferAddress, setTransferAddress] = useState('');
    const [transferring, setTransferring] = useState(false);

    // Load user documents
    const loadUserDocuments = async () => {
        if (!contract || !account) return;

        setLoading(true);
        try {
            const userDocs = await contract.getDocumentsByOwner(account);
            const docsWithDetails = await Promise.all(
                userDocs.map(async (hash) => {
                    const doc = await contract.getDocument(hash);
                    return {
                        hash: doc.hash,
                        name: doc.name,
                        owner: doc.owner,
                        timestamp: new Date(Number(doc.timestamp) * 1000).toLocaleString('en-US'),
                        exists: doc.exists
                    };
                })
            );
            setDocuments(docsWithDetails);
        } catch (error) {
            console.error('Error loading documents:', error);
            showMessage('Error loading documents', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Calculate file hash
    const calculateFileHash = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
                const hash = CryptoJS.SHA256(wordArray).toString();
                resolve(hash);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    // Register document
    const registerDocument = async () => {
        if (!documentName || !selectedFile) {
            showMessage('Please enter a name and select a file', 'error');
            return;
        }

        setRegistering(true);
        try {
            // Calculate file hash
            const fileHash = await calculateFileHash(selectedFile);

            // Check if already registered
            const isRegistered = await contract.isDocumentRegistered(fileHash);
            if (isRegistered) {
                showMessage('This document is already registered on the blockchain', 'error');
                return;
            }

            // Register on blockchain
            const tx = await contract.registerDocument(fileHash, documentName);
            showMessage('Transaction sent. Awaiting confirmation...', 'warning');

            await tx.wait();
            showMessage(`Document "${documentName}" registered successfully!`, 'success');

            // Clear form
            setDocumentName('');
            setSelectedFile(null);
            document.getElementById('file-input').value = '';

            // Reload documents
            await loadUserDocuments();

        } catch (error) {
            console.error('Error registering document:', error);
            showMessage('Error registering document: ' + error.message, 'error');
        } finally {
            setRegistering(false);
        }
    };

    // Search document
    const searchDocument = async () => {
        if (!searchHash) {
            showMessage('Please enter the document hash', 'error');
            return;
        }

        try {
            const isRegistered = await contract.isDocumentRegistered(searchHash);
            if (!isRegistered) {
                setSearchResult({ exists: false });
                return;
            }

            const doc = await contract.getDocument(searchHash);
            setSearchResult({
                exists: true,
                hash: doc.hash,
                name: doc.name,
                owner: doc.owner,
                timestamp: new Date(Number(doc.timestamp) * 1000).toLocaleString('en-US')
            });
        } catch (error) {
            console.error('Error searching document:', error);
            showMessage('Error searching document: ' + error.message, 'error');
        }
    };

    // Transfer document
    const transferDocument = async () => {
        if (!transferHash || !transferAddress) {
            showMessage('Please enter the hash and destination address', 'error');
            return;
        }

        if (!ethers.isAddress(transferAddress)) {
            showMessage('Invalid address', 'error');
            return;
        }

        setTransferring(true);
        try {
            const tx = await contract.transferDocument(transferHash, transferAddress);
            showMessage('Transfer sent. Awaiting confirmation...', 'warning');

            await tx.wait();
            showMessage('Document transferred successfully!', 'success');

            // Clear form
            setTransferHash('');
            setTransferAddress('');

            // Reload documents
            await loadUserDocuments();

        } catch (error) {
            console.error('Error transferring document:', error);
            showMessage('Error transferring document: ' + error.message, 'error');
        } finally {
            setTransferring(false);
        }
    };

    // Show message
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    // Load documents on initialization
    useEffect(() => {
        loadUserDocuments();
    }, [contract, account]);

    return (
        <div style={{ marginTop: '2rem' }}>
            {/* Mensagens */}
            {message && (
                <div className={`alert alert-${messageType}`}>
                    {message}
                </div>
            )}

            {/* Registro de Documento */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    📝 Registrar Documento
                </h2>

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Nome do Documento:
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                            placeholder="Ex: Contrato de Prestação de Serviços"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Arquivo:
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            className="input-field"
                            onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                            O hash do arquivo será calculado e registrado na blockchain
                        </p>
                    </div>
                </div>

                <button
                    onClick={registerDocument}
                    className="btn-primary"
                    disabled={registering || !documentName || !selectedFile}
                    style={{ opacity: (registering || !documentName || !selectedFile) ? 0.6 : 1 }}
                >
                    {registering ? 'Registrando...' : 'Registrar Documento'}
                </button>
            </div>

            {/* Consulta de Documento */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    🔍 Consultar Documento
                </h2>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="input-field"
                        value={searchHash}
                        onChange={(e) => setSearchHash(e.target.value)}
                        placeholder="Cole o hash do documento aqui"
                        style={{ flex: 1, minWidth: '300px' }}
                    />
                    <button onClick={searchDocument} className="btn-secondary">
                        Consultar
                    </button>
                </div>

                {searchResult && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                        {searchResult.exists ? (
                            <div>
                                <h3 style={{ fontWeight: '600', color: '#059669', marginBottom: '0.5rem' }}>
                                    ✅ Documento Encontrado
                                </h3>
                                <p><strong>Nome:</strong> {searchResult.name}</p>
                                <p><strong>Proprietário:</strong> {searchResult.owner}</p>
                                <p><strong>Registrado em:</strong> {searchResult.timestamp}</p>
                                <p><strong>Hash:</strong> {searchResult.hash}</p>
                            </div>
                        ) : (
                            <div>
                                <h3 style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
                                    ❌ Documento Não Encontrado
                                </h3>
                                <p>Este documento não está registrado na blockchain.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Transferência de Documento */}
            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    🔄 Transferir Documento
                </h2>

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Hash do Documento:
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={transferHash}
                            onChange={(e) => setTransferHash(e.target.value)}
                            placeholder="Hash do documento a ser transferido"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                            Endereço de Destino:
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            value={transferAddress}
                            onChange={(e) => setTransferAddress(e.target.value)}
                            placeholder="0x..."
                        />
                    </div>
                </div>

                <button
                    onClick={transferDocument}
                    className="btn-danger"
                    disabled={transferring || !transferHash || !transferAddress}
                    style={{ opacity: (transferring || !transferHash || !transferAddress) ? 0.6 : 1 }}
                >
                    {transferring ? 'Transferindo...' : 'Transferir Propriedade'}
                </button>
            </div>

            {/* Meus Documentos */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                        📚 Meus Documentos ({documents.length})
                    </h2>
                    <button onClick={loadUserDocuments} className="btn-secondary" disabled={loading}>
                        {loading ? 'Carregando...' : 'Atualizar'}
                    </button>
                </div>

                {loading ? (
                    <p>Carregando documentos...</p>
                ) : documents.length === 0 ? (
                    <p style={{ color: '#6b7280' }}>Você ainda não possui documentos registrados.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {documents.map((doc, index) => (
                            <div key={index} style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#fafafa' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{doc.name}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    <strong>Hash:</strong> {doc.hash}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                    <strong>Registrado em:</strong> {doc.timestamp}
                                </p>
                                <div style={{ marginTop: '0.5rem' }}>
                                    <button
                                        onClick={() => setSearchHash(doc.hash)}
                                        className="btn-secondary"
                                        style={{ marginRight: '0.5rem', fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        Copiar Hash
                                    </button>
                                    <button
                                        onClick={() => setTransferHash(doc.hash)}
                                        className="btn-danger"
                                        style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        Transferir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
