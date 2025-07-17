// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DocumentRegistry
 * @dev Contract for secure document registration on blockchain
 * @author Blockchain Demo
 */
contract DocumentRegistry {

    struct Document {
        string hash;           // Document hash
        string name;           // Document name
        address owner;         // Document owner
        uint256 timestamp;     // Registration timestamp
        bool exists;           // Flag to check if document exists
    }

    // Mapping from document hash to document data
    mapping(string => Document) public documents;

    // Mapping from addresses to list of document hashes
    mapping(address => string[]) public ownerDocuments;

    // Array with all registered document hashes
    string[] public allDocuments;

    // Events
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
     * @dev Registers a new document on the blockchain
     * @param _hash Unique hash of the document
     * @param _name Name of the document
     */
    function registerDocument(string memory _hash, string memory _name) public {
        require(bytes(_hash).length > 0, "Document hash cannot be empty");
        require(bytes(_name).length > 0, "Document name cannot be empty");
        require(!documents[_hash].exists, "Document already registered");

        // Create the document
        documents[_hash] = Document({
            hash: _hash,
            name: _name,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        // Add to owner's list
        ownerDocuments[msg.sender].push(_hash);

        // Add to global list
        allDocuments.push(_hash);

        emit DocumentRegistered(_hash, _name, msg.sender, block.timestamp);
    }

    /**
     * @dev Checks if a document is registered
     * @param _hash Document hash
     * @return bool Whether the document exists
     */
    function isDocumentRegistered(string memory _hash) public view returns (bool) {
        return documents[_hash].exists;
    }

    /**
     * @dev Gets information about a document
     * @param _hash Document hash
     * @return Document Document data
     */
    function getDocument(string memory _hash) public view returns (Document memory) {
        require(documents[_hash].exists, "Document not found");
        return documents[_hash];
    }

    /**
     * @dev Transfers ownership of a document
     * @param _hash Document hash
     * @param _newOwner New owner
     */
    function transferDocument(string memory _hash, address _newOwner) public {
        require(documents[_hash].exists, "Document not found");
        require(documents[_hash].owner == msg.sender, "Only owner can transfer");
        require(_newOwner != address(0), "Invalid address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");

        address previousOwner = documents[_hash].owner;

        // Update the owner
        documents[_hash].owner = _newOwner;

        // Remove from previous owner's list
        _removeFromOwnerList(previousOwner, _hash);

        // Add to new owner's list
        ownerDocuments[_newOwner].push(_hash);

        emit DocumentTransferred(_hash, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Gets all documents of an owner
     * @param _owner Owner's address
     * @return string[] Array with document hashes
     */
    function getDocumentsByOwner(address _owner) public view returns (string[] memory) {
        return ownerDocuments[_owner];
    }

    /**
     * @dev Gets the total number of registered documents
     * @return uint256 Total number of documents
     */
    function getTotalDocuments() public view returns (uint256) {
        return allDocuments.length;
    }

    /**
     * @dev Gets all registered document hashes
     * @return string[] Array with all hashes
     */
    function getAllDocuments() public view returns (string[] memory) {
        return allDocuments;
    }

    /**
     * @dev Removes a hash from the owner's document list
     * @param _owner Owner
     * @param _hash Hash to be removed
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
