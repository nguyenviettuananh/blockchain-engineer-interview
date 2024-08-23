const path = require('path')
const fs = require('fs')
const { getGeneDataReport } = require('./geneData');
// const { ethers } = require('ethers');
const privateStorageDir = path.join(__dirname, 'private-storage');
require("dotenv").config("../../.env")
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const { ethers } = require('ethers');

// const provider = ethers.provider
// async function deployControllerFixture() {
//     const [owner, addr1, addr2] = await ethers.getSigners();

//     const nft = await ethers.deployContract("GeneNFT");
//     const pcspToken = await ethers.deployContract("PostCovidStrokePrevention");

//     const controller = await ethers.deployContract("Controller", [nft.target, pcspToken.target]);
//     await nft.transferOwnership(controller.target)
//     await pcspToken.transferOwnership(controller.target)

//     return { controller, nft, pcspToken, owner, addr1, addr2 }
// }

function shouldExecutionDecider() {
    // if false then execute, if true then throw
    return Math.random() >= 0.5;
}


async function safetyExecution(userId) {
    // execute decrypt user encrypted geneData
    const { code, message, data } = await getGeneDataReport(userId)
    if (code != 200) {
        return { code, data, message }
    }
    const isSubmittedGene = shouldExecutionDecider() // should mark user gene has been submitted already
    if (isSubmittedGene) {
        return {
            code: 422,
            message: "User gene has already subbmited"
        }
    }
    const reward = rewardPCSP(userId, data)
    
    // execute smart contract init upload file session and confirm (mint gnft, issue reward for userId and close session) it here
    // mark user gene executed
    // Assume it work


    // should send it throught some kind of other channels (email, push noti, sms ......)
    return {
        code: 200, 
        geneData: data,
        reward: reward,
        nftOwner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    }
} 

async function rewardPCSP(userId, riskScore) {
    let reward;
    if (riskScore === 'extremely high risk') {
        reward = 15000;
    } else if (riskScore === 'high risk') {
        reward = 3000;
    } else if (riskScore === 'slightly high risk') {
        reward = 225;
    } else {
        reward = 30;
    }

    return reward

    // const transaction = await contract.rewardPCSP(userId, reward);
    // await transaction.wait();

    // return { userId, reward, txHash: transaction.hash };
}

module.exports = { safetyExecution };
