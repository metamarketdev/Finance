# Crocodile Finance

This a Ponzi DApp I created on Tron blockchain using NodeJS.

<!-- GETTING STARTED -->
# Getting Started

1- First you need to install required packages.
* npm
  ```sh
  npm install
  ```
2- Deploy the Solidity smart contract on Tron Blockchain (Either Mainnet or Testnet).

3- Create a Tron wallet and copy it's privatekey.

3- Create a `.env` file in the project's root directory and enter the following values :
```sh
PRIVATEKEY='Your_Private_Key'
CONTRACTADDRESS='Smart_Contract_Address'
OWNERADDRESS='Your_Own_Wallet_Address'
```

4- Run `node crocodile.js` and you should get the app perfectly running on port 3000.

5- The DApp uses the Nile Testnet by default. In order to use the Mainnet replace `https://api.nile.trongrid.io` with `https://api.trongrid.io` lines 12,13,14 of crocodile.js file. 