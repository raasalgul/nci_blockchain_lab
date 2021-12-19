// load the web3 dependency
const Web3 = require('web3')

// load the etherium transaction dependency
const Tx = require('ethereumjs-tx').Transaction

let contractImport = require("./contract.js");

// loading file access dependencies
let fs = require("fs");

require('dotenv').config()

infuraToken = process.env.INFURA_TOKEN
contractAddress = process.env.CONTRACT_ADDRESS_3
ownerAddress = process.env.OWNER_ADDRESS
privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex')

// get the ABI (interface) for our contract
const abi=[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "_totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
// instantiate web3 with the infura rpc url
const web3 = new Web3("https://ropsten.infura.io/v3/" + infuraToken);

const address = contractAddress;
const owner = ownerAddress;

// connect to our contract
const contract = new web3.eth.Contract(abi, address);

// set up the ropsten infura remote procedure call to connect to an ethereum node
const sendTx = async(raw) => {
    return await web3.eth.sendSignedTransaction(raw);
}

const transferToken = async(toAccount, amount,gasPrice) => {

    // get the unique nonce
    let txCount = await web3.eth.getTransactionCount(owner);
    console.log("tx count is " + txCount);
	
    // form the transation data
    const txObject = {
        nonce: web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(500000),
		// check if the gas price is given by the user or else we will generate a default gas price
        gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice===0?await getEthGasPrice():gasPrice, 'gwei')),
        to: contractAddress,
        data: contract.methods.transfer(toAccount, amount).encodeABI()
    }

    // assign a chain id (ropsten: 3)
    const tx = new Tx(txObject, {chain: 'ropsten', hardfork: 'petersburg'})

    // sign the transation with our private key
    tx.sign(privateKey);

    console.log("signed transaction with super secret private key");

    // serialize the raw transation
    const serializedTx = tx.serialize();
    const raw = '0x' + serializedTx.toString('hex');

    console.log('about to send transaction' + raw)

    // broadcast the transaction
    let txResponse = await sendTx(raw);
    console.log("transaction hash: " + txResponse.transactionHash)
    console.log("transaction in block: " + txResponse.blockNumber)

	return await getBalanceOfAccount();
}

/* In this method we will generate the default gas price for our transaction. Since if we have same 
transation price, in some cases it gets rejected by the network by thinking we were trying to modify the block.
In order to avoid that confusion and to get the exact on going gas price we use this method.
*/
const getEthGasPrice = async()=>{
	currentGasPrice=100;
	// Get the current etheirum gas price and increase 10% of that price and add it to our transation.
	await web3.eth.getGasPrice().then(gasPrice => {
		console.log('gasPrice = ' + gasPrice);
		// The gas price is converted to GWEI with three digit followed by decimals and added 10% extra to the exisiting gas price
		currentGasPrice=((gasPrice*100.1)/1000000000).toFixed(9);
	});
	console.log('gas price ' +currentGasPrice)
	// let afterConversion=web3.utils.toWei(currentGasPrice.toString(),'gwei');
	// console.log(`after conversion ${afterConversion}`)
	return currentGasPrice.toString()
}

// This method will get the current balance of the owner
const getBalanceOfAccount=async ()=>{
	return await contractImport.getBalanceOfAccount(owner);
}

const getAccountsFromFile=async ()=>{
  // read in the file
  let addresses =[] 
  addresses= await fs.readFileSync('./accounts.txt', 'utf8').split('\n');

  console.log(`Addresses in the files : ${ addresses}`);
	return addresses;
}

module.exports = { transferToken,getEthGasPrice,getBalanceOfAccount,getAccountsFromFile }