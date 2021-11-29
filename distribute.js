// create a method that will be called by the web server

// in this method:
// - read the accounts.txt file
// put the N accounts into an array
// get the totalsupply for the token owner
// calculate 5% of that totalSupply
// loop N times, and execute N transactions transferring the token
// collect tea and medals

let fs = require("fs");
let BigNumber = require("big-number")
let contract = require('./contract.js')

let method = require('./method.js');

// this sets up my .env file
require('dotenv').config()

// let's load our environment variables
infuraToken = process.env.INFURA_TOKEN
contractAddress = process.env.CONTRACT_ADDRESS
ownerAddress = process.env.OWNER_ADDRESS
privateKey = Buffer.from(process.env.SUPER_SECRET_PRIVATE_KEY, 'hex')

const distribute = async() => {
    // read in the file
    let distributionAddresses = fs.readFileSync('./accounts.txt', 'utf8').split('\n');
    console.log(`distro addresses are: ${ distributionAddresses}`);

    let tokenSymbol=await contract.getSymbol()

    let bal = new BigNumber(await contract.getBalanceOfOwner(ownerAddress))

    console.log(`Owner Balance is ${bal}`)
    let fivePerCent = bal.div(20)
    // then we need to divide fivePerCent by the number of addresses in the file
    let accounts = distributionAddresses.length
    console.log(` we have ${accounts} accounts in our file and 5% is ${fivePerCent}`) 

    // for(i=0;i<accounts;i++){
    //     console.log(`The account ${distributionAddresses[i]} will get ${fivePerCent} ${tokenSymbol} `)
    //     await method.transferToken(distributionAddresses[i],fivePerCent);
    // }

}

//distribute();
module.exports = { distribute }