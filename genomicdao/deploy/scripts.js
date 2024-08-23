const hre = require("hardhat");
const {ethers} = require("hardhat");

async function main() {
    const provider = ethers.provider
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account: ' + deployer.address);

    console.log("Deployer balance: ", (await provider.getBalance(deployer)).toString());
    console.log("Nonce (latest): ", await provider.getTransactionCount(deployer, 'latest'));
    console.log("Nonce (pending): ", await provider.getTransactionCount(deployer, 'pending'));

    const nft = await ethers.deployContract("GeneNFT")

    console.log("Nonce (latest): ", await provider.getTransactionCount(deployer, 'latest'));
    console.log("Nonce (pending): ", await provider.getTransactionCount(deployer, 'pending'));
    const pcspToken = await ethers.deployContract("PostCovidStrokePrevention");

    console.log("Nonce (latest): ", await provider.getTransactionCount(deployer, 'latest'));
    console.log("Nonce (pending): ", await provider.getTransactionCount(deployer, 'pending'));

    const controller = await ethers.deployContract("Controller", [nft.target, pcspToken.target]);

    console.log("Deployer balance: ", (await provider.getBalance(deployer)).toString());
    console.log("Nonce (latest): ", await provider.getTransactionCount(deployer, 'latest'));
    console.log("Nonce (pending): ", await provider.getTransactionCount(deployer, 'pending'));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });