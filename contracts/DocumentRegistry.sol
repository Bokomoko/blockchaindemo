// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DocumentRegistry
 * @dev Contrato para registro seguro de documentos em blockchain
 * @author Blockchain Demo
 */
contract DocumentRegistry {

    struct Document {
        string hash;           // Hash do documento
        string name;           // Nome do documento
        address owner;         // Proprietário do documento
        uint256 timestamp;     // Timestamp do registro
        bool exists;           // Flag para verificar se o documento existe
    }

    // Mapeamento de hash do documento para os dados do documento
    mapping(string => Document) public documents;

    // Mapeamento de endereços para lista de hashes de documentos
    mapping(address => string[]) public ownerDocuments;

    // Array com todos os hashes de documentos registrados
    string[] public allDocuments;

    // Eventos
    event DocumentRegistered(
        string indexed documentHash,
        string name,
        address indexed owner,
        uint256 timestamp
    );

    event DocumentTransferred(
        string indexed documentHash,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    /**
     * @dev Registra um novo documento na blockchain
     * @param _hash Hash único do documento
     * @param _name Nome do documento
     */
    function registerDocument(string memory _hash, string memory _name) public {
        require(bytes(_hash).length > 0, "Hash do documento nao pode estar vazio");
        require(bytes(_name).length > 0, "Nome do documento nao pode estar vazio");
        require(!documents[_hash].exists, "Documento ja foi registrado");

        // Cria o documento
        documents[_hash] = Document({
            hash: _hash,
            name: _name,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        // Adiciona à lista do proprietário
        ownerDocuments[msg.sender].push(_hash);

        // Adiciona à lista global
        allDocuments.push(_hash);

        emit DocumentRegistered(_hash, _name, msg.sender, block.timestamp);
    }

    /**
     * @dev Verifica se um documento está registrado
     * @param _hash Hash do documento
     * @return bool Se o documento existe
     */
    function isDocumentRegistered(string memory _hash) public view returns (bool) {
        return documents[_hash].exists;
    }

    /**
     * @dev Obtém informações de um documento
     * @param _hash Hash do documento
     * @return Document Dados do documento
     */
    function getDocument(string memory _hash) public view returns (Document memory) {
        require(documents[_hash].exists, "Documento nao encontrado");
        return documents[_hash];
    }

    /**
     * @dev Transfere a propriedade de um documento
     * @param _hash Hash do documento
     * @param _newOwner Novo proprietário
     */
    function transferDocument(string memory _hash, address _newOwner) public {
        require(documents[_hash].exists, "Documento nao encontrado");
        require(documents[_hash].owner == msg.sender, "Apenas o proprietario pode transferir");
        require(_newOwner != address(0), "Endereco invalido");
        require(_newOwner != msg.sender, "Nao pode transferir para si mesmo");

        address previousOwner = documents[_hash].owner;

        // Atualiza o proprietário
        documents[_hash].owner = _newOwner;

        // Remove da lista do proprietário anterior
        _removeFromOwnerList(previousOwner, _hash);

        // Adiciona à lista do novo proprietário
        ownerDocuments[_newOwner].push(_hash);

        emit DocumentTransferred(_hash, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Obtém todos os documentos de um proprietário
     * @param _owner Endereço do proprietário
     * @return string[] Array com hashes dos documentos
     */
    function getDocumentsByOwner(address _owner) public view returns (string[] memory) {
        return ownerDocuments[_owner];
    }

    /**
     * @dev Obtém o número total de documentos registrados
     * @return uint256 Total de documentos
     */
    function getTotalDocuments() public view returns (uint256) {
        return allDocuments.length;
    }

    /**
     * @dev Obtém todos os hashes de documentos registrados
     * @return string[] Array com todos os hashes
     */
    function getAllDocuments() public view returns (string[] memory) {
        return allDocuments;
    }

    /**
     * @dev Remove um hash da lista de documentos do proprietário
     * @param _owner Proprietário
     * @param _hash Hash a ser removido
     */
    function _removeFromOwnerList(address _owner, string memory _hash) private {
        string[] storage ownerDocs = ownerDocuments[_owner];
        for (uint256 i = 0; i < ownerDocs.length; i++) {
            if (keccak256(bytes(ownerDocs[i])) == keccak256(bytes(_hash))) {
                ownerDocs[i] = ownerDocs[ownerDocs.length - 1];
                ownerDocs.pop();
                break;
            }
        }
    }
}
