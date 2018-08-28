pragma solidity ^0.4.18;

contract Verify {
    
  bytes32[] totalHashes;

  struct userStruct {
    address userAddress;
    bytes32[] hash;
    bool present;
  }

  mapping(bytes32 => bool) private condition;
  mapping(bytes32 => string) private details;
  mapping(address => userStruct) private userstructs;
  
  modifier notPresent(bytes32 inputHash) {
      require(condition[inputHash]==false);
      _;
  }

   function insertHashPerson (address instowner,bytes32 fileHash) notPresent(fileHash)  public  {

       userstructs[instowner].userAddress = instowner;
       userstructs[instowner].hash.push(fileHash);
       totalHashes.push(fileHash);
       condition[fileHash] = true;
  }
  
  function insertTransactionDetails(bytes32 fileHash, string transactionDetail) public {
      details[fileHash]=transactionDetail;
  }
  
  function getTransactionDetail(bytes32 fileHash) constant public returns (string) {
      return details[fileHash];
  }

  function getTotalHashes ()  constant  public  returns(bytes32[])   {
    return(totalHashes);
  }

   function getFileHashesUser(address user) constant public returns(bytes32[]) {
      return userstructs[user].hash;
  }
 
}
