import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

export default function DocumentRegistry({ contract, account, provider }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    // Estados para registro de documento
    const [documentName, setDocumentName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [registering, setRegistering] = useState(false);

    // Estados para consulta
    const [searchHash, setSearchHash] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    // Estados para transferência
    const [transferHash, setTransferHash] = useState('');
    const [transferAddress, setTransferAddress] = useState('');
    const [transferring, setTransferring] = useState(false);

    // Carregar documentos do usuário
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
                        timestamp: new Date(Number(doc.timestamp) * 1000).toLocaleString('pt-BR'),
                        exists: doc.exists
                    };
                })
            );
            setDocuments(docsWithDetails);
        } catch (error) {
            console.error('Erro ao carregar documentos:', error);
            showMessage('Erro ao carregar documentos', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Calcular hash do arquivo
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

    // Registrar documento
    const registerDocument = async () => {
        if (!documentName || !selectedFile) {
            showMessage('Por favor, insira o nome e selecione um arquivo', 'error');
            return;
        }

        setRegistering(true);
        try {
            // Calcular hash do arquivo
            const fileHash = await calculateFileHash(selectedFile);

            // Verificar se já está registrado
            const isRegistered = await contract.isDocumentRegistered(fileHash);
            if (isRegistered) {
                showMessage('Este documento já foi registrado na blockchain', 'error');
                return;
            }

            // Registrar na blockchain
            const tx = await contract.registerDocument(fileHash, documentName);
            showMessage('Transação enviada. Aguardando confirmação...', 'warning');

            await tx.wait();
            showMessage(`Documento "${documentName}" registrado com sucesso!`, 'success');

            // Limpar formulário
            setDocumentName('');
            setSelectedFile(null);
            document.getElementById('file-input').value = '';

            // Recarregar documentos
            await loadUserDocuments();

        } catch (error) {
            console.error('Erro ao registrar documento:', error);
            showMessage('Erro ao registrar documento: ' + error.message, 'error');
        } finally {
            setRegistering(false);
        }
    };

    // Consultar documento
    const searchDocument = async () => {
        if (!searchHash) {
            showMessage('Por favor, insira o hash do documento', 'error');
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
                timestamp: new Date(Number(doc.timestamp) * 1000).toLocaleString('pt-BR')
            });
        } catch (error) {
            console.error('Erro ao consultar documento:', error);
            showMessage('Erro ao consultar documento: ' + error.message, 'error');
        }
    };

    // Transferir documento
    const transferDocument = async () => {
        if (!transferHash || !transferAddress) {
            showMessage('Por favor, insira o hash e o endereço de destino', 'error');
            return;
        }

        if (!ethers.isAddress(transferAddress)) {
            showMessage('Endereço inválido', 'error');
            return;
        }

        setTransferring(true);
        try {
            const tx = await contract.transferDocument(transferHash, transferAddress);
            showMessage('Transferência enviada. Aguardando confirmação...', 'warning');

            await tx.wait();
            showMessage('Documento transferido com sucesso!', 'success');

            // Limpar formulário
            setTransferHash('');
            setTransferAddress('');

            // Recarregar documentos
            await loadUserDocuments();

        } catch (error) {
            console.error('Erro ao transferir documento:', error);
            showMessage('Erro ao transferir documento: ' + error.message, 'error');
        } finally {
            setTransferring(false);
        }
    };

    // Mostrar mensagem
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    // Carregar documentos ao inicializar
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
