# 🦊 Guia Completo MetaMask para Desenvolvimento Blockchain

## 📋 Índice

1. [Instalação da MetaMask](#1-instalação-da-metamask)
2. [Configuração para Desenvolvimento](#2-configuração-para-desenvolvimento)
3. [Configuração para Uso Real](#3-configuração-para-uso-real)
4. [Redes de Teste (Testnets)](#4-redes-de-teste-testnets)
5. [Segurança e Boas Práticas](#5-segurança-e-boas-práticas)
6. [Configuração do Projeto](#6-configuração-do-projeto)
7. [Solução de Problemas](#7-solução-de-problemas)

---

## 1. 🔧 Instalação da MetaMask

### Opção A: MetaMask Normal (Recomendado)
- **URL**: https://metamask.io/
- **Estabilidade**: ✅ Produção
- **Para**: Desenvolvimento e uso real
- **Compatibilidade**: Total

### Opção B: MetaMask Flask (Experimental)
- **URL**: https://metamask.io/flask/
- **Estabilidade**: ⚠️ Beta
- **Para**: Features experimentais
- **Compatibilidade**: Pode ter bugs

**🎯 Recomendação**: Use a **MetaMask Normal** para este projeto.

---

## 2. 🏗️ Configuração para Desenvolvimento

### Passo 1: Criar Carteira de Desenvolvimento

```bash
# ⚠️ IMPORTANTE: Esta carteira é APENAS para desenvolvimento
# Nunca use esta carteira para dinheiro real!
```

1. **Abra MetaMask** → "Create a new wallet"
2. **Crie senha forte** para a extensão
3. **Anote a seed phrase** em local seguro
4. **Nomeie a conta**: "DEV - Blockchain Demo"

### Passo 2: Adicionar Rede Mumbai (Testnet)

**Configuração Manual:**
```json
Nome da Rede: Polygon Mumbai Testnet
Nova URL RPC: https://rpc-mumbai.maticvigil.com
ID da Cadeia: 80001
Símbolo da Moeda: MATIC
URL do Explorador de Blocos: https://mumbai.polygonscan.com
```

**Ou use nosso script automático:**
```javascript
// Cole no console do browser na página da DApp
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
```

### Passo 3: Obter MATIC de Teste

1. **Faucet Principal**: https://faucet.polygon.technology/
2. **Faucet Backup**: https://mumbaifaucet.com/
3. **Processo**:
   - Cole seu endereço da carteira
   - Resolva o CAPTCHA
   - Clique em "Send Me MATIC"
   - Aguarde 1-2 minutos

### Passo 4: Obter Chave Privada

```bash
# ⚠️ CUIDADO: Só faça isso com carteira de DESENVOLVIMENTO!
```

1. **MetaMask** → Clique nos 3 pontos → "Account Details"
2. **"Export Private Key"**
3. **Digite sua senha**
4. **Copie a chave privada**

### Passo 5: Configurar Arquivo .env

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações
nano .env
```

```bash
# Configuração para DESENVOLVIMENTO
PRIVATE_KEY=sua_chave_privada_de_desenvolvimento_aqui
POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=80001
```

---

## 3. 💰 Configuração para Uso Real

### ⚠️ NUNCA misture desenvolvimento com uso real!

### Carteira Principal (Uso Real)
```bash
✅ Use para:
- Comprar/vender NFTs
- DeFi real
- Transações mainnet
- Guardar criptomoedas de valor

❌ NUNCA use para:
- Desenvolvimento de DApps
- Testes de smart contracts
- Experimentação
- Compartilhar chaves privadas
```

### Carteira de Desenvolvimento
```bash
✅ Use para:
- Desenvolvimento de DApps
- Testes de contratos
- Aprendizado
- Demos e apresentações

❌ NUNCA use para:
- Guardar dinheiro real
- Transações mainnet importantes
- Investimentos
```

### Estrutura Recomendada

```
MetaMask Principal
├── 📄 Conta 1: "Principal" (uso real)
├── 🏗️ Conta 2: "DEV - Polygon" (desenvolvimento)
├── 🧪 Conta 3: "DEV - Ethereum" (testes)
└── 📚 Conta 4: "Learning" (estudos)
```

---

## 4. 🌐 Redes de Teste (Testnets)

### Mumbai (Polygon) - Recomendado
```json
Nome: Polygon Mumbai Testnet
RPC: https://rpc-mumbai.maticvigil.com
Chain ID: 80001
Símbolo: MATIC
Explorer: https://mumbai.polygonscan.com
Faucet: https://faucet.polygon.technology/
```

### Sepolia (Ethereum)
```json
Nome: Sepolia Testnet
RPC: https://sepolia.infura.io/v3/YOUR-PROJECT-ID
Chain ID: 11155111
Símbolo: ETH
Explorer: https://sepolia.etherscan.io
Faucet: https://sepoliafaucet.com/
```

### Goerli (Ethereum) - Deprecated
```bash
⚠️ AVISO: Goerli será descontinuada
Use Sepolia em vez de Goerli
```

---

## 5. 🔐 Segurança e Boas Práticas

### ✅ Sempre Faça:

1. **Carteiras Separadas**
   ```bash
   Desenvolvimento ≠ Uso Real
   ```

2. **Backup da Seed Phrase**
   ```bash
   Anote em papel, guarde em local seguro
   Nunca tire foto ou salve digitalmente
   ```

3. **Senhas Fortes**
   ```bash
   Use gerenciador de senhas
   Ative 2FA quando possível
   ```

4. **Verificar URLs**
   ```bash
   ✅ https://metamask.io/
   ❌ metamask.com.phishing-site.com
   ```

### ❌ NUNCA Faça:

1. **Compartilhar Chave Privada Real**
   ```bash
   ❌ Chave de carteira com dinheiro real
   ✅ Chave de carteira de desenvolvimento
   ```

2. **Usar Carteira Principal para Desenvolvimento**
   ```bash
   ❌ Uma carteira para tudo
   ✅ Carteiras separadas por uso
   ```

3. **Ignorar Avisos de Segurança**
   ```bash
   Se a MetaMask avisar sobre algo suspeito, PARE!
   ```

---

## 6. ⚙️ Configuração do Projeto

### Deploy do Contrato

```bash
# 1. Compile o contrato
npm run compile

# 2. Execute os testes
npm run test

# 3. Deploy na testnet
npm run deploy:mumbai

# 4. Copie o endereço do contrato
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x..." >> .env
```

### Iniciar a DApp

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Conectar MetaMask

1. **Abra a DApp** em http://localhost:3000
2. **Clique** em "Conectar MetaMask"
3. **Aprove** a conexão
4. **Troque** para Mumbai se solicitado
5. **Pronto!** Agora você pode interagir

---

## 7. 🆘 Solução de Problemas

### "MetaMask não detectado"
```bash
Solução:
1. Verifique se a extensão está instalada
2. Recarregue a página
3. Verifique se está habilitada no browser
```

### "Rede incorreta"
```bash
Solução:
1. Configure Mumbai manualmente
2. Use o script automático
3. Verifique Chain ID: 80001
```

### "Saldo insuficiente"
```bash
Solução:
1. Use o faucet: https://faucet.polygon.technology/
2. Aguarde 1-2 minutos
3. Verifique se está na rede correta
```

### "Transação falhou"
```bash
Possíveis causas:
1. Gas insuficiente → Aumente o gas limit
2. Preço baixo → Aumente o gas price
3. Rede congestionada → Aguarde e tente novamente
4. Nonce incorreto → Reset account na MetaMask
```

### "Contrato não encontrado"
```bash
Verifique:
1. Endereço do contrato no .env
2. Rede correta (Mumbai)
3. Deploy foi realizado com sucesso
```

---

## 🎯 Checklist Final

### ✅ Desenvolvimento
- [ ] MetaMask instalada
- [ ] Carteira de desenvolvimento criada
- [ ] Rede Mumbai adicionada
- [ ] MATIC de teste obtido
- [ ] Chave privada configurada no .env
- [ ] Contrato deployado
- [ ] DApp funcionando

### ✅ Segurança
- [ ] Carteiras separadas (dev vs real)
- [ ] Seed phrase anotada e guardada
- [ ] Chave privada real NUNCA exposta
- [ ] Apenas tokens de teste na carteira dev
- [ ] URLs verificadas

---

## 📚 Recursos Adicionais

### Links Oficiais
- **MetaMask**: https://metamask.io/
- **Polygon**: https://polygon.technology/
- **Mumbai Explorer**: https://mumbai.polygonscan.com/
- **Documentação**: https://docs.metamask.io/

### Faucets
- **Mumbai MATIC**: https://faucet.polygon.technology/
- **Backup**: https://mumbaifaucet.com/
- **Sepolia ETH**: https://sepoliafaucet.com/

### Comunidade
- **Discord MetaMask**: https://discord.gg/metamask
- **Reddit**: r/Metamask
- **Support**: https://metamask.zendesk.com/

---

**🎉 Parabéns! Agora você está pronto para desenvolver DApps com segurança!**

> **Lembre-se**: A segurança na blockchain é IRREVERSÍVEL. Uma vez que uma transação é confirmada, não pode ser desfeita. Sempre use carteiras de teste para desenvolvimento!

---

*Este guia foi criado para o projeto Blockchain Document Registry. Para dúvidas específicas, consulte o README.md principal.*
