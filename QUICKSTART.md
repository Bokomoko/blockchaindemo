# 🚀 Início Rápido - Blockchain Document Registry

## 📋 Checklist de Setup

### 1. ✅ Pré-requisitos Instalados
- [x] Node.js v22.17.1 (LTS)
- [x] npm v10.9.2
- [x] Dependências instaladas
- [x] Smart contracts compilados
- [x] Testes passando

### 2. 🔧 Próximos Passos

#### A. Configurar Ambiente
```bash
# Copiar arquivo de configuração
cp .env.example .env

# Editar configurações (adicionar sua chave privada)
nano .env
```

#### B. Configurar MetaMask
1. Instale a extensão MetaMask
2. Adicione a rede Polygon Mumbai:
   - **Nome**: Polygon Mumbai Testnet
   - **RPC URL**: https://rpc-mumbai.maticvigil.com
   - **Chain ID**: 80001
   - **Símbolo**: MATIC
   - **Explorer**: https://mumbai.polygonscan.com

#### C. Obter MATIC de Teste
1. Acesse: https://faucet.polygon.technology/
2. Cole seu endereço da carteira
3. Solicite MATIC gratuitos

#### D. Deploy do Contrato
```bash
# Deploy na rede Mumbai
npm run deploy:mumbai

# Copie o endereço do contrato para .env
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x..." >> .env
```

#### E. Iniciar Aplicação
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Ou usar a tarefa do VS Code
# Ctrl+Shift+P -> "Tasks: Run Task" -> "Start Development Server"
```

### 3. 🎯 Funcionalidades Disponíveis

#### 📝 Registro de Documentos
- Upload de qualquer arquivo
- Cálculo automático do hash SHA-256
- Registro imutável na blockchain
- Prova de existência com timestamp

#### 🔍 Verificação de Autenticidade
- Consulta por hash do documento
- Verificação de propriedade
- Histórico de registro

#### 🔄 Transferência de Propriedade
- Transferir documentos entre endereços
- Validação de propriedade
- Registro de transferências

### 4. 🧪 Comandos Úteis

```bash
# Compilar contratos
npm run compile

# Executar testes
npm run test

# Deploy local (para desenvolvimento)
npx hardhat node  # Em um terminal
npm run deploy:local  # Em outro terminal

# Verificar contrato no explorer
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>

# Limpar cache
npx hardhat clean
```

### 5. 📊 Status do Projeto

- ✅ Smart Contract: Desenvolvido e testado
- ✅ Frontend React: Interface funcional
- ✅ Integração Web3: MetaMask + Ethers.js
- ✅ Deploy Scripts: Prontos para Mumbai
- ✅ Testes: 11/11 passando
- ✅ Documentação: Completa

### 6. 🔗 Links Importantes

- **Faucet Mumbai**: https://faucet.polygon.technology/
- **Explorer Mumbai**: https://mumbai.polygonscan.com/
- **MetaMask**: https://metamask.io/
- **Polygon Docs**: https://docs.polygon.technology/
- **Hardhat Docs**: https://hardhat.org/docs

### 7. 🆘 Solução de Problemas

#### "MetaMask não detectado"
- Verifique se a extensão está instalada
- Recarregue a página
- Verifique se está conectado à rede Mumbai

#### "Saldo insuficiente"
- Obtenha MATIC no faucet
- Aguarde confirmação (pode demorar alguns minutos)

#### "Contrato não encontrado"
- Verifique se o deploy foi feito
- Confirme o endereço no .env
- Verifique se está na rede correta

#### "Transação falhou"
- Verifique saldo de MATIC
- Tente aumentar o gas price
- Aguarde alguns blocos e tente novamente

---

**🎉 Pronto! Seu projeto blockchain está configurado e funcionando!**

Para demonstrar:
1. Faça upload de um documento
2. Veja o hash sendo calculado
3. Registre na blockchain
4. Verifique no explorer
5. Transfira para outro endereço
6. Consulte a autenticidade

**🔐 Lembre-se: Esta é uma demonstração educacional usando testnet. Nunca use chaves privadas reais em projetos de demonstração!**
