pragma solidity ^0.4.18;

contract Verify {

  //this is where all the document hashes get saved as inside an array    
  bytes32[] totalHashes;

  //created to store hashes corresponding to a unique particular user
  struct userStruct {
    address userAddress;
    bytes32[] hash;
  }
  
  //created to store deatils corresponding to a file Hash
  struct fileHash {
    bytes32 createdFileHash;
    string blockchainHash;
    string ipfsHash;
  }
  
  //structs will be stored corresponding to the communicating user address
  mapping(address => userStruct) private userstructs;
  
  //mapping to ensure that file condition is set to true once uploaded
  mapping(bytes32 => bool) private condition;
  
  //mapping to store the transaction hash, ipfsHash inside blockchan 
  mapping(bytes32 => fileHash) private fileHashDetails;
  
  
  //check condition to ensure that same hash cannot be saved again on the blockchain
  modifier notPresent(bytes32 inputHash) {
      require(condition[inputHash]==false);
      _;
  }


   //main function to insert the file hash 
   function insertHashPerson (address instowner,bytes32 fileHash) notPresent(fileHash)  public  {

       userstructs[instowner].userAddress = instowner;
       userstructs[instowner].hash.push(fileHash);
       totalHashes.push(fileHash);
       condition[fileHash] = true;
  }
  
  //to store transaction hash
  function insertTransactionDetails(bytes32 fileHash, string transactionDetail,string ipfsUploadedHash) public {
      fileHashDetails[fileHash].createdFileHash=fileHash;
      fileHashDetails[fileHash].blockchainHash = transactionDetail;
      fileHashDetails[fileHash].ipfsHash = ipfsUploadedHash;
  }
  
  //to get transaction hash corresponding to the file hash
  function getTransactionDetail(bytes32 fileHash) constant public returns (string) {
      return fileHashDetails[fileHash].blockchainHash;
  }


 function getIpfsHash(bytes32 fileHash) constant public returns (string) {
     return fileHashDetails[fileHash].ipfsHash;
 }

  //to get all the file hashes uploaded in the blockchain
  function getTotalHashes ()  constant  public  returns(bytes32[])   {
    return(totalHashes);
  }

   //getting all file hashes corresponding to a particular user
   function getFileHashesUser(address user) constant public returns(bytes32[]) {
      return userstructs[user].hash;
  }
 
}
