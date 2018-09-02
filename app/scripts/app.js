
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';
import {default as sha1} from 'sha1';
import {default as getUuidByString} from 'uuid-by-string';
import {default as ethers} from 'ethers';
import ipfsAPI from 'ipfs-api';
import {default as buffer} from 'buffer';


import verify_artifacts from '../../build/contracts/Verify.json'

var provider = ethers.providers.getDefaultProvider('rinkeby');
const ipfs_net = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});

var Verify = contract(verify_artifacts);


var ipfsHash;


window.loadFileAsText = function() {
  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.readAsArrayBuffer(fileToLoad);
  fileReader.onload = function(fileLoadedEvent){
      var textFromFileLoaded = fileLoadedEvent.target.result;
      var mybuffer = new Buffer(textFromFileLoaded);
      var fileSha1Hash = sha1(mybuffer);
      var uuid = getUuidByString(fileSha1Hash);
      var fileHash = uuid.replace(/-/g,"");


      Verify.deployed().then(async function(contractInstance){
        var totallist = await contractInstance.getTotalHashes.call();

        var AsciiFileHash = web3.fromAscii(fileHash);
        if (totallist.includes(AsciiFileHash)) {
          console.log("Already Present");
          var transactionHash = await contractInstance.getTransactionDetail(AsciiFileHash);
          console.log(transactionHash);
          provider.getTransactionReceipt(transactionHash).then(async function(result){
              console.log(result);
              var block = result.blockNumber;
              console.log(block);
              var blockData = await provider.getBlock(block);
              console.log(blockData);
              console.log(blockData.timestamp);
              var d = new Date(blockData.timestamp * 1000);
              var s = d.toUTCString();
              s = s.substring(0,s.indexOf("GMT")) + "UTC";
              $('#getdoctorid').html('Block Number: '+block);
              $('#timestamp').html('Timestamp: '+s);
              ipfsHash = await contractInstance.getIpfsHash(AsciiFileHash);
              $('#displayFiles').html(ipfsHash);
              console.log("This is IPFSHASH",ipfsHash);
              $('#modal1').modal('open');
            });

        }else{
          console.log("not Present");
          contractInstance.insertHashPerson(web3.eth.accounts[0],fileHash,{gas: 990000, from: web3.eth.accounts[0]}).then(function(transaction) {
            console.log("Added");
            console.log(transaction.receipt.transactionHash);
            var transactionHash = transaction.receipt.transactionHash;
            console.log(fileHash);
            console.log(transactionHash);
            console.log("waiting for IPFS Transaction");
            ipfs_net.files.add(mybuffer, function (err, file) {
              if (err) {
                console.log(err);
              }else{
              console.log(file);
              var ipfsHash = file[0].hash;
              console.log(ipfsHash);
              contractInstance.insertTransactionDetails(fileHash,transactionHash,ipfsHash,{gas: 990000, from: web3.eth.accounts[0]}).then(function(transaction){
                console.log("Transaction Hash Added");
              })
            }
          });
        });
        }
      })
  };
}

window.getmyTransaction = function() {
  Verify.deployed().then(async function(contractInstance){
      var userDocumentList = await contractInstance.getFileHashesUser(web3.eth.accounts[0]);
      console.log(userDocumentList);
      for (var i = 0; i < userDocumentList.length; i++) {
        console.log(userDocumentList[i]);
        $(".userCollection").append('<a class="collection-item"><span class="badge"></span>'+userDocumentList[i]+'</a><br>');
        $('#modal2').modal('open');
      }
    });
}

window.myFunction = function() {
  window.open("https://gateway.ipfs.io/ipfs/"+ipfsHash,"_blank");
}


$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    window.web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/"));

  }

  Verify.setProvider(web3.currentProvider);

  Verify.deployed().then(async function(contractInstance){
      var totallist = await contractInstance.getTotalHashes();
      var latestNumber = totallist.length;
      console.log("Latest Number is ",latestNumber);
      var startNumber = latestNumber-1;
      var stopNumber = startNumber-10;
    for (var i = startNumber; i > stopNumber; i--) {
      console.log(totallist[i]);
      var transactionHash = await contractInstance.getTransactionDetail(totallist[i]);
      console.log("This is Hash",transactionHash);
      $(".collection").append('<a class="collection-item"><span class="badge">'+transactionHash+'</span>'+totallist[i]+'</a>');
    }
  });
});
