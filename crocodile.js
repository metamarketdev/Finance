const TronWeb = require('tronweb');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(express.static(__dirname + '/public'));


const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.nile.trongrid.io");
const solidityNode = new HttpProvider("https://api.nile.trongrid.io");
const eventServer = new HttpProvider("https://api.nile.trongrid.io");
const privateKey = process.env.PRIVATEKEY; //Enter a Tron wallet private key.
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);

let contractAddress = process.env.CONTRACTADDRESS //Enter your smart contract address.

let Owner_Address = process.env.OWNERADDRESS; //Enter the owner's account address.

const rate = 10; //Daily ROI.

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