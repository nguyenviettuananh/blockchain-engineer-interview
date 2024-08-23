pragma solidity ^0.8.26;

import "./NFT.sol";
import "./Token.sol";

contract Controller {
    // using Counters for Counters.Counter;

    //
    // STATE VARIABLES
    //
    uint256 private _sessionIdCounter;
    GeneNFT public geneNFT;
    PostCovidStrokePrevention public pcspToken;

    struct UploadSession {
        uint256 id;
        address user;
        string proof;
        bool confirmed;
    }

    struct DataDoc {
        string id;
        string hashContent;
    }

    mapping(uint256 => UploadSession) sessions;
    mapping(string => DataDoc) docs;
    mapping(string => bool) docSubmits;
    mapping(uint256 => string) nftDocs;

    //
    // EVENTS
    //
    event UploadData(string docId, uint256 sessionId);

    constructor(address nftAddress, address pcspAddress) {
        geneNFT = GeneNFT(nftAddress);
        pcspToken = PostCovidStrokePrevention(pcspAddress);
    }

    function uploadData(string memory docId) public returns (uint256) {
        // TODO: Implement this method: to start an uploading gene data session. 
        // The doc id is used to identify a unique gene profile.
        // Also should check if the doc id has been submited to the system before. This method return the session id
        require(!docSubmits[docId], "Doc already been submitted");
        // Create a new upload session
        sessions[_sessionIdCounter] = UploadSession(_sessionIdCounter, msg.sender, "", false);
        docSubmits[docId] = true;
        emit UploadData(docId, _sessionIdCounter);
        _sessionIdCounter += 1;
        return _sessionIdCounter;
    }

    function confirm(
        string memory docId,
        string memory contentHash,
        string memory proof,
        uint256 sessionId,
        uint256 riskScore
    ) public {
        if (bytes(docs[docId].id).length > 0) {
            revert("Doc already been submitted");
        }
        if (sessions[sessionId].confirmed) {
            revert("Session is ended");
        }
        if (sessions[sessionId].user != msg.sender) {
            revert("Invalid session owner");
        }
        // TODO: Verify proof, we can skip this step
        docs[docId] = DataDoc(docId, contentHash);
        // TODO: Mint NFT 
        geneNFT.safeMint(msg.sender);
        // TODO: Reward PCSP token based on risk stroke
        pcspToken.reward(msg.sender, riskScore);
        // TODO: Close session
        sessions[sessionId].confirmed = true;
        sessions[sessionId].proof = proof;
    }

    function getSession(uint256 sessionId) public view returns(UploadSession memory) {
        return sessions[sessionId];
    }

    function getDoc(string memory docId) public view returns(DataDoc memory) {
        return docs[docId];
    }
}
