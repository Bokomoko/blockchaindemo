# 📄 Blockchain Document Registry

Demonstração de registro seguro e imutável de documentos usando smart contracts na blockchain Polygon Mumbai (testnet gratuita).

## 🎯 Funcionalidades

- ✅ **Registro de Documentos**: Calcule o hash SHA-256 de qualquer arquivo e registre na blockchain
- 🔍 **Verificação de Autenticidade**: Consulte se um documento foi registrado e obtenha suas informações
- 🔄 **Transferência de Propriedade**: Transfira a propriedade de documentos entre endereços
- 👤 **Gestão de Documentos**: Visualize todos os seus documentos registrados
- 🔗 **Integração MetaMask**: Interface amigável com carteira Web3

## 🏗️ Arquitetura

### Smart Contract
- **Rede**: Polygon Mumbai Testnet (gratuita)
- **Linguagem**: Solidity 0.8.19
- **Funcionalidades**: Registro, consulta e transferência de documentos
- **Segurança**: Verificações de propriedade e validações de entrada

### Frontend
- **Framework**: Next.js + React
- **Web3**: Ethers.js para interação com blockchain
- **Carteira**: MetaMask
- **Hash**: Crypto-js para cálculo SHA-256

## 🚀 Como Executar

### 1. Pré-requisitos

- Node.js (v16 ou superior)
- MetaMask instalado no navegador
- Conta com MATIC de teste (Mumbai testnet)

### 2. Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd blockchaindemo

# Instalar dependências
npm install
```

### 3. Configuração

```bash
# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

Configure as seguintes variáveis no `.env`:

```env
# Chave privada da sua carteira (para deploy)
PRIVATE_KEY=sua_chave_privada_aqui

# RPC da rede Mumbai (já configurado)
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com

# Endereço do contrato (será preenchido após deploy)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Chain ID da rede Mumbai
NEXT_PUBLIC_CHAIN_ID=80001
```

### 4. Deploy do Smart Contract

```bash
# Compilar contrato
npm run compile

# Executar testes
npm run test

# Deploy na rede Mumbai
npm run deploy:mumbai
```

Após o deploy, copie o endereço do contrato e adicione ao arquivo `.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

### 5. Executar Frontend

```bash
# Modo desenvolvimento
npm run dev

# Ou build para produção
npm run build
npm start
```

Acesse: http://localhost:3000

## 📱 Como Usar

### 1. Configurar MetaMask

1. Instale a extensão MetaMask
2. Adicione a rede Polygon Mumbai:
   - **Nome**: Polygon Mumbai Testnet
   - **RPC URL**: https://rpc-mumbai.maticvigil.com
   - **Chain ID**: 80001
   - **Símbolo**: MATIC
   - **Explorer**: https://mumbai.polygonscan.com

### 2. Obter MATIC de Teste

Visite o [Polygon Faucet](https://faucet.polygon.technology/) e solicite MATIC gratuitos para sua carteira.

### 3. Conectar Carteira

1. Clique em "Conectar MetaMask"
2. Aprove a conexão
3. Confirme a troca para a rede Mumbai se solicitado

### 4. Registrar Documento

1. Insira o nome do documento
2. Selecione o arquivo
3. Clique em "Registrar Documento"
4. Confirme a transação no MetaMask
5. Aguarde a confirmação na blockchain

### 5. Verificar Documento

1. Cole o hash do documento no campo de consulta
2. Clique em "Consultar"
3. Visualize as informações se o documento estiver registrado

### 6. Transferir Propriedade

1. Insira o hash do documento
2. Insira o endereço de destino
3. Clique em "Transferir Propriedade"
4. Confirme a transação

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com cobertura
npx hardhat coverage
```

## 📊 Exemplo de Uso

### Cenário: Registro de Contrato

1. **Upload**: Empresa A faz upload de um contrato PDF
2. **Hash**: Sistema calcula SHA-256: `a1b2c3d4e5f6...`
3. **Registro**: Transação registra hash na blockchain
4. **Verificação**: Qualquer pessoa pode verificar a autenticidade
5. **Transferência**: Empresa A transfere para Empresa B

### Vantagens

- ✅ **Imutabilidade**: Registros não podem ser alterados
- ✅ **Transparência**: Qualquer um pode verificar
- ✅ **Baixo Custo**: Mumbai testnet é gratuita
- ✅ **Descentralização**: Sem ponto único de falha
- ✅ **Timestamping**: Prova de existência temporal

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
blockchaindemo/
├── contracts/          # Smart contracts Solidity
├── scripts/            # Scripts de deploy
├── test/               # Testes automatizados
├── pages/              # Páginas Next.js
├── components/         # Componentes React
├── styles/             # Estilos CSS
├── hardhat.config.js   # Configuração Hardhat
└── package.json        # Dependências
```

### Smart Contract Principal

```solidity
// Principais funções do DocumentRegistry.sol
function registerDocument(string _hash, string _name) public
function isDocumentRegistered(string _hash) public view returns (bool)
function getDocument(string _hash) public view returns (Document)
function transferDocument(string _hash, address _newOwner) public
```

### Comandos Úteis

```bash
# Compilar contratos
npx hardhat compile

# Executar testes
npx hardhat test

# Deploy local
npx hardhat node
npm run deploy:local

# Verificar contrato (após deploy)
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## 🌍 Redes Suportadas

### Mumbai Testnet (Recomendado)
- **Chain ID**: 80001
- **RPC**: https://rpc-mumbai.maticvigil.com
- **Explorador**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology

### Local (Desenvolvimento)
- **Chain ID**: 1337
- **RPC**: http://localhost:8545

## 🛡️ Segurança

- ✅ Validações de entrada nos contratos
- ✅ Verificações de propriedade
- ✅ Proteção contra reentrância
- ✅ Eventos para auditoria
- ✅ Testes abrangentes

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Problemas Comuns

**"MetaMask não detectado"**
- Instale a extensão MetaMask
- Recarregue a página

**"Rede incorreta"**
- Configure a rede Mumbai no MetaMask
- Use Chain ID 80001

**"Saldo insuficiente"**
- Obtenha MATIC gratuitos no faucet
- Aguarde alguns minutos

**"Transação falhada"**
- Verifique se tem MATIC suficiente
- Tente aumentar o gas price

### Links Úteis

- [MetaMask](https://metamask.io/)
- [Polygon Faucet](https://faucet.polygon.technology/)
- [Mumbai Explorer](https://mumbai.polygonscan.com/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Next.js Docs](https://nextjs.org/docs)

## 🎓 Conceitos Aprendidos

Este projeto demonstra:

- 📝 **Smart Contracts**: Desenvolvimento e deploy
- 🔗 **Web3 Integration**: Frontend com blockchain
- 🔐 **Cryptografia**: Hashing e verificação
- 💰 **DeFi Basics**: Transações e gas
- 🏗️ **DApp Architecture**: Padrões de desenvolvimento
- 🧪 **Testing**: Testes automatizados
- 🚀 **Deployment**: Deploy em testnet

---

**Feito com ❤️ para demonstrar o poder da blockchain na autenticação de documentos**
