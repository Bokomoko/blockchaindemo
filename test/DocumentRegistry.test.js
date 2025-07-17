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

    describe("Registro de Documentos", function () {
        it("Deve registrar um documento com sucesso", async function () {
            const hash = "QmTest123";
            const name = "Documento Teste";

            await expect(documentRegistry.registerDocument(hash, name))
                .to.emit(documentRegistry, "DocumentRegistered")
                .withArgs(hash, name, owner.address, anyValue);

            expect(await documentRegistry.isDocumentRegistered(hash)).to.be.true;
        }); it("Não deve registrar documento com hash vazio", async function () {
            await expect(documentRegistry.registerDocument("", "Teste"))
                .to.be.revertedWith("Hash do documento nao pode estar vazio");
        });

        it("Não deve registrar documento com nome vazio", async function () {
            await expect(documentRegistry.registerDocument("QmTest123", ""))
                .to.be.revertedWith("Nome do documento nao pode estar vazio");
        });

        it("Não deve registrar documento duplicado", async function () {
            const hash = "QmTest123";
            const name = "Documento Teste";

            await documentRegistry.registerDocument(hash, name);

            await expect(documentRegistry.registerDocument(hash, name))
                .to.be.revertedWith("Documento ja foi registrado");
        });
    });

    describe("Consulta de Documentos", function () {
        beforeEach(async function () {
            await documentRegistry.registerDocument("QmTest123", "Documento 1");
            await documentRegistry.connect(addr1).registerDocument("QmTest456", "Documento 2");
        });

        it("Deve retornar informações corretas do documento", async function () {
            const doc = await documentRegistry.getDocument("QmTest123");

            expect(doc.hash).to.equal("QmTest123");
            expect(doc.name).to.equal("Documento 1");
            expect(doc.owner).to.equal(owner.address);
            expect(doc.exists).to.be.true;
        });

        it("Deve retornar documentos do proprietário", async function () {
            const ownerDocs = await documentRegistry.getDocumentsByOwner(owner.address);
            const addr1Docs = await documentRegistry.getDocumentsByOwner(addr1.address);

            expect(ownerDocs).to.have.lengthOf(1);
            expect(ownerDocs[0]).to.equal("QmTest123");

            expect(addr1Docs).to.have.lengthOf(1);
            expect(addr1Docs[0]).to.equal("QmTest456");
        });

        it("Deve retornar total de documentos correto", async function () {
            expect(await documentRegistry.getTotalDocuments()).to.equal(2);
        });
    });

    describe("Transferência de Documentos", function () {
        beforeEach(async function () {
            await documentRegistry.registerDocument("QmTest123", "Documento Teste");
        });

        it("Deve transferir documento com sucesso", async function () {
            await expect(documentRegistry.transferDocument("QmTest123", addr1.address))
                .to.emit(documentRegistry, "DocumentTransferred")
                .withArgs("QmTest123", owner.address, addr1.address, anyValue);

            const doc = await documentRegistry.getDocument("QmTest123");
            expect(doc.owner).to.equal(addr1.address);
        }); it("Não deve permitir transferência por não proprietário", async function () {
            await expect(documentRegistry.connect(addr1).transferDocument("QmTest123", addr2.address))
                .to.be.revertedWith("Apenas o proprietario pode transferir");
        });

        it("Não deve transferir para endereço zero", async function () {
            await expect(documentRegistry.transferDocument("QmTest123", ethers.ZeroAddress))
                .to.be.revertedWith("Endereco invalido");
        });

        it("Não deve transferir para si mesmo", async function () {
            await expect(documentRegistry.transferDocument("QmTest123", owner.address))
                .to.be.revertedWith("Nao pode transferir para si mesmo");
        });
    });
});
