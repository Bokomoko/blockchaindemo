#!/bin/bash

echo "🚀 Configuração do Projeto Blockchain Document Registry"
echo "======================================================"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

echo "✅ Node.js $(node --version) detectado"

# Verificar se está na versão correta
if [ -f ".nvmrc" ] && command -v nvm &> /dev/null; then
    echo "🔧 Usando nvm para configurar a versão correta do Node.js..."
    nvm use
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Compilar contratos
echo "⚙️ Compilando smart contracts..."
npm run compile

# Executar testes
echo "🧪 Executando testes..."
npm run test

echo ""
echo "✅ Configuração concluída com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Copie .env.example para .env e configure suas chaves"
echo "2. Execute 'npm run deploy:mumbai' para fazer deploy na testnet"
echo "3. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo ""
echo "🔗 Links úteis:"
echo "- Faucet Mumbai: https://faucet.polygon.technology/"
echo "- Explorer Mumbai: https://mumbai.polygonscan.com/"
echo "- MetaMask: https://metamask.io/"
echo ""
echo "🎉 Pronto para começar!"
