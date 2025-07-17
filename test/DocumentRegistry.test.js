const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("DocumentRegistry", function () {
  let documentRegistry;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
    documentRegistry = await DocumentRegistry.deploy();
    await documentRegistry.waitForDeployment();
  });

  describe("Document Registration", function () {
    it("Should register a document successfully", async function () {
      const hash = "QmTest123";
      const name = "Test Document";

      await expect(documentRegistry.registerDocument(hash, name))
        .to.emit(documentRegistry, "DocumentRegistered")
        .withArgs(hash, name, owner.address, anyValue);

      expect(await documentRegistry.isDocumentRegistered(hash)).to.be.true;
    });

    it("Should not register document with empty hash", async function () {
      await expect(documentRegistry.registerDocument("", "Test"))
        .to.be.revertedWith("Document hash cannot be empty");
    });

    it("Should not register document with empty name", async function () {
      await expect(documentRegistry.registerDocument("QmTest123", ""))
        .to.be.revertedWith("Document name cannot be empty");
    });

    it("Should not register duplicate document", async function () {
      const hash = "QmTest123";
      const name = "Test Document";

      await documentRegistry.registerDocument(hash, name);
      
      await expect(documentRegistry.registerDocument(hash, name))
        .to.be.revertedWith("Document already registered");
    });
  });

  describe("Document Query", function () {
    beforeEach(async function () {
      await documentRegistry.registerDocument("QmTest123", "Document 1");
      await documentRegistry.connect(addr1).registerDocument("QmTest456", "Document 2");
    });

    it("Should return correct document information", async function () {
      const doc = await documentRegistry.getDocument("QmTest123");
      
      expect(doc.hash).to.equal("QmTest123");
      expect(doc.name).to.equal("Document 1");
      expect(doc.owner).to.equal(owner.address);
      expect(doc.exists).to.be.true;
    });

    it("Should return documents by owner", async function () {
      const ownerDocs = await documentRegistry.getDocumentsByOwner(owner.address);
      const addr1Docs = await documentRegistry.getDocumentsByOwner(addr1.address);

      expect(ownerDocs).to.have.lengthOf(1);
      expect(ownerDocs[0]).to.equal("QmTest123");
      
      expect(addr1Docs).to.have.lengthOf(1);
      expect(addr1Docs[0]).to.equal("QmTest456");
    });

    it("Should return correct total documents", async function () {
      expect(await documentRegistry.getTotalDocuments()).to.equal(2);
    });
  });

  describe("Document Transfer", function () {
    beforeEach(async function () {
      await documentRegistry.registerDocument("QmTest123", "Test Document");
    });

    it("Should transfer document successfully", async function () {
      await expect(documentRegistry.transferDocument("QmTest123", addr1.address))
        .to.emit(documentRegistry, "DocumentTransferred")
        .withArgs("QmTest123", owner.address, addr1.address, anyValue);

      const doc = await documentRegistry.getDocument("QmTest123");
      expect(doc.owner).to.equal(addr1.address);
    });

    it("Should not allow transfer by non-owner", async function () {
      await expect(documentRegistry.connect(addr1).transferDocument("QmTest123", addr2.address))
        .to.be.revertedWith("Only owner can transfer");
    });

    it("Should not transfer to zero address", async function () {
      await expect(documentRegistry.transferDocument("QmTest123", ethers.ZeroAddress))
        .to.be.revertedWith("Invalid address");
    });

    it("Should not transfer to same address", async function () {
      await expect(documentRegistry.transferDocument("QmTest123", owner.address))
        .to.be.revertedWith("Cannot transfer to yourself");
    });
  });
});
