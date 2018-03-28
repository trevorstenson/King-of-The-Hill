var contract_address = "0x4B3EAF702ee93ECE7bf9aF1b1b528E0ed24c1aAa";
var contract_abi = [ { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "getEndTime", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "start", "type": "uint256" }, { "name": "pot", "type": "uint256" } ], "name": "startGame", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getCurrentBid", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "newBet", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "getCurrentKing", "outputs": [ { "name": "", "type": "address", "value": "0x44aed4d1ee18ebc372200bf9ce136dd4ae132374" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "resetGame", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "gameOver", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getRemaining", "outputs": [ { "name": "", "type": "uint256", "value": "3586" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getCurrentPot", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Bet", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "_left", "type": "uint256" } ], "name": "Time", "type": "event" } ];
window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
        console.log('metamask')
    } else {
        console.log('No web3 found');
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
})

var wager_contract = web3.eth.contract(contract_abi).at(contract_address);
var betEvent = wager_contract.Bet();
var timeEvent = wager_contract.Time();
var eventCount = 0;

function updateInfo() {
    document.getElementById("currentKing").innerText = wager_contract.getCurrentKing();
    document.getElementById("currentBet").innerText = web3.fromWei(wager_contract.getCurrentBid().toNumber(), "ether");
    document.getElementById("jackpot").innerText = web3.fromWei(wager_contract.getCurrentPot().toNumber(), "ether");
}

function startTimer() {
    var count = eventCount;
    var timer = wager_contract.getRemaining();
    var hours, minutes, seconds;
    var x = setInterval(function () {
        hours = parseInt(Math.floor(timer / 3600) % 24, 10);
        minutes = parseInt(Math.floor(timer % 3600) / 60 % 60, 10);
        seconds = parseInt(Math.floor(timer % 60), 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (count == eventCount) {
            if (timer-- < 0) {
                timer = timer;
            }
        } else if (count !== eventCount){
            count = eventCount;
            clearInterval(x);
            startTimer();
        }
        document.getElementById("remaining").innerText = hours + "h " + minutes + "m " + seconds + "s";
    }, 1000);
}

function sendBet(number) {
    document.getElementById("betInfo").value = "";
    if (number != "") {
        var num = number;
        console.log(num)
        wager_contract.newBet.sendTransaction({
            from: web3.eth.accounts[1],
            value: web3.toWei(num, 'ether'),
            to: contract_address
        }, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
    } else {
        console.log("invalid")
    }
}
betEvent.watch(function (error, result) {
    if (!error) {
        console.log("A bet has been placed.")
        console.log(result);
        updateInfo();
        eventCount++;
    }
});

timeEvent.watch(function (error, result) {
    if(!error) {
        console.log("time change")
        startTimer();
    }
});