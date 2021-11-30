let BigNumber = require("big-number")

let method = require('./method.js');
let contract = require('./contract.js');

// this sets up my .env file
require('dotenv').config()

// let's load our environment variables
infuraToken = process.env.INFURA_TOKEN
contractAddress = process.env.CONTRACT_ADDRESS
ownerAddress = process.env.OWNER_ADDRESS
privateKey = Buffer.from(process.env.PRIVATE_KEY, 'hex')

const distribute = async(gasPrice) => {
  
    // get the balance of the token owner
    let ownerBalance = await contract.getBalanceOfAccount(ownerAddress);
    let ob = new BigNumber(ownerBalance);
    console.log(`owner balance is ${ob}`);

    // get five percent of this balance
    let fivePerCent = ob.div(20);
    console.log(`five per cent of owner balance is ${fivePerCent}`);

    // get the array of addresses from the file
    let accountsToSend=await method.getAccountsFromFile();

    // work out how many addresses in file (N)
    let numberOfAddresses = accountsToSend.length;
    console.log(`number of addresses in file is ${numberOfAddresses}`);

    // divide the 5% by N to get distroAmount
    let distributionAmount = fivePerCent.div(numberOfAddresses)
    console.log(`distribution amount per address is ${distributionAmount}`);

    for (looper = 0; looper < numberOfAddresses; looper++) {
        console.log(`about to distribute ${distributionAmount} tokens go to ${accountsToSend[looper]}`)
        let retval = await method.transferToken(accountsToSend[looper], distributionAmount, gasPrice)
        console.log(`Balance after transation ${retval}`)
    }
}

module.exports = { distribute }