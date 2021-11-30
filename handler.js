let contract = require("./contract.js");
let method = require("./method.js");
let distribute = require('./distribute.js');

const express = require("express");

const app = express();

app.use(express.json());

const port = 8081;

// This get method "symbol" will return the symbol of the token
app.get('/symbol', async(req,res) => {
    res.send({"symbol":await contract.getSymbol()})
})

/* This post method "transfer" will transfer the specified "SKK" amount 
from the sender (my account) to address specified in "account_to" 
the user has a option to mention the gasprice in post request or could 
ignore it.
*/
app.post('/transfer', async(req, res) => {
    let account_to = req.body.account_to;
    let amount = req.body.amount;
    // will check for the gasprice is mentioned or not.
    let gasPrice = undefined===req.body.gas_price_in_gwei?0:req.body.gas_price_in_gwei;
    res.send({"balance":await method.transferToken(account_to, amount, gasPrice)});
})

/* This post method "distribute" will transfer 5% of the owner (my account) balance
to the accounts mentioned in the accounts.txt file.
 */
app.post('/distribute', async(req, res) => {
    let gasPrice = undefined===req.body.gas_price_in_gwei?0:req.body.gas_price_in_gwei;
    res.send(await distribute.distribute(gasPrice));
})

/* The get method "balance" will return the owner (my account) SKK token balance
 */
app.get('/balance', async(req,res)=>{
    res.send({"balance":await method.getBalanceOfAccount()})
})

/* The get method "gas-price" will return the current ether gas price value
 */
app.get('/gas-price', async(req,res)=>{
    res.send({"gas Price":await method.getEthGasPrice()})
})

app.get('/accounts-from-file', async(req,res)=>{
    res.send({"accounts":await method.getAccountsFromFile()})
})
app.listen(port, () => console.log(`listening on port ${port}...`));
