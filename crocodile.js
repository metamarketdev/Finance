const TronWeb = require('tronweb');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));


const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.nile.trongrid.io");
const solidityNode = new HttpProvider("https://api.nile.trongrid.io");
const eventServer = new HttpProvider("https://api.nile.trongrid.io");
const privateKey = "B12DB18A29379C314921238F7D6F915C0711253EAAC702785296D9A83053F6FB"; //Enter a Tron wallet private key.
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);

let contractAddress = 'TKZFkNV3fzyWakw4D2n1KNp6CuYU7WrDUf' //Enter your smart contract address.

let Owner_Address = 'TBwtV7fPJsqMU2QAw6PMzkJViLTBM2VyQo'; //Enter the owners account address.
const rate = 10;

app.set('view engine', 'ejs');

///////////// English
app.get('/', (req, res) => {
    res.render('index.ejs', {CTAdress : contractAddress, refid : Owner_Address, rate : rate, owner : Owner_Address});
});
app.get('/refer/:RefAdd', async function(req, res) {
    res.render('index.ejs', {CTAdress : contractAddress, refid : req.params.RefAdd, rate : rate, owner : Owner_Address});
});
///////////// Russian
app.get('/ru', async function(req, res) {
    res.render('indexru.ejs', {CTAdress : contractAddress, refid : Owner_Address, rate : rate, owner : Owner_Address});
});
app.get('/ru/refer/:RefAdd', async function(req, res) {
    res.render('indexru.ejs', {CTAdress : contractAddress, refid : req.params.RefAdd, rate : rate, owner : Owner_Address});
});
///////////// Chinese
app.get('/zh', async function(req, res) {
    res.render('indexzh.ejs', {CTAdress : contractAddress, refid : Owner_Address, rate : rate, owner : Owner_Address});
});
app.get('/zh/refer/:RefAdd', async function(req, res) {
    res.render('indexzh.ejs', {CTAdress : contractAddress, refid : req.params.RefAdd, rate : rate, owner : Owner_Address});
});
///////////// Spanish
app.get('/se', async function(req, res) {
    res.render('indexes.ejs', {CTAdress : contractAddress, refid : Owner_Address, rate : rate, owner : Owner_Address});
});
app.get('/se/refer/:RefAdd', async function(req, res) {
    res.render('indexes.ejs', {CTAdress : contractAddress, refid : req.params.RefAdd, rate : rate, owner : Owner_Address});
});

app.listen("3000");