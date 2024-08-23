const path = require('path')
const fs = require('fs')
const { encryptData, decryptData }  = require("./crypto")
// const { ethers } = require('ethers');
const privateStorageDir = path.join(__dirname, 'private-storage');
require("dotenv").config("../../.env")
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

function getRandomRiskLevel() {
    const riskLevels = ["extremely high risk", "high risk", "slightly high risk", "low risk"];
    const randomIndex = Math.floor(Math.random() * riskLevels.length);
    return riskLevels[randomIndex];
}

function processGeneData(geneData) {
    // assume execution above
    return getRandomRiskLevel()
}

function readFromPrivateStorage(privateStoragePath, filenameRegex) {
    return new Promise((resolve, reject) => {
        // Read the directory content
        fs.readdir(privateStoragePath, (err, files) => {
            if (err) {
                return reject({
                    code: 500,
                    message: 'Internal server error',
                });
            }

            // Filter files using the provided regex pattern
            const matchedFile = files.find((file) => filenameRegex.test(file));

            if (matchedFile) {
                // A file matching the regex exists
                return reject({
                    code: 409,
                    message: `File matching pattern already exists: ${matchedFile}`,
                });
            }

            // If no file matches, you can return or process further
            resolve(null); // Or handle this case differently
        });
    });
}

// Function to submit gene data and save it as a file in private storage
async function submitGeneData(userId, geneData) {
    // should implement each user 1 gene data only here
    const existedUserGene = await readFromPrivateStorage(privateStorageDir,  new RegExp(`gene_data_${userId}`))
    if (existedUserGene) {
        return existedUserGene
    }
    const processedData = processGeneData(geneData)
    const encryptedData = encryptData(processedData, ENCRYPTION_KEY);
    // Define the directory and file path for private storage
    
    const fileName = `gene_data_${userId}_${Date.now()}.txt`; // Unique file name
    const filePath = path.join(privateStorageDir, fileName);
    // Ensure the directory exists
    if (!fs.existsSync(privateStorageDir)) {
        fs.mkdirSync(privateStorageDir, { recursive: true });
    }

    // Save the encrypted data to the file
    fs.writeFileSync(filePath, encryptedData, 'utf8');

    return { userId, filePath };
}

async function getGeneDataReport(userId) {
    // implement find files
    const files = fs.readdirSync(privateStorageDir)
    const matchedFile = files.find((file) => new RegExp(`gene_data_${userId}`).test(file));
    if (!matchedFile) {
        return {
            code: 404,
            message: "Not found entity"
        }
    }
    const encryptedContent = fs.readFileSync(path.join(privateStorageDir, matchedFile), { encoding: "utf8" })
    const decryptedResult = decryptData(encryptedContent, ENCRYPTION_KEY)
    return { code: 200, data: decryptedResult }
}

module.exports = { submitGeneData, getGeneDataReport };

