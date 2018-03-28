pragma solidity ^0.4.0;

contract wager {

    address creator;
    uint gameStart;
    uint gameEnd;
    uint interval;
    uint highestBid;
    uint currentPot;
    uint remainingTime;
    address highestBidder;
    struct Entry {
    address creator;
    uint balance;
    }

    modifier onlyowner {
        if (msg.sender == creator) {
            _;
        }
    }

    event Bet(address indexed _from, uint _value);

    event Time(uint _left);

    function wager(){
        highestBid = 0;
        highestBidder = msg.sender;
        currentPot = this.balance;
        interval = 1 hours;
        creator = msg.sender;
        gameStart = now + 30;
        startGame(gameStart, 0);
    }

    function newBet() payable {
        Bet(msg.sender, msg.value);
        if (msg.value > highestBid) {
            highestBid = msg.value;
            highestBidder = msg.sender;
            currentPot += msg.value;
            gameEnd += interval;
        }
    }

    function startGame(uint start, uint pot) {
        gameStart = start;
        gameEnd = gameStart + interval;
        currentPot = pot;
        highestBid = 0;
        highestBidder = creator;
    }

    function getRemaining() constant returns(uint) {
        remainingTime = gameEnd - now;
        Time(remainingTime);
        return remainingTime;
        Time(remainingTime);
    }

    function gameOver() constant returns(bool) {
        if (gameEnd <= now) {
            return true;
        } else {
            return false;
        }
    }

    function resetGame() onlyowner {
        require(gameOver());
        uint ownerShare = (this.balance * 5) / 100;
        uint winnerShare = (this.balance * 9) / 100;
        uint nextPot = (this.balance * 5) /  100;

        highestBidder.transfer(winnerShare);
        creator.transfer(ownerShare);
        Time(remainingTime);
        startGame(gameEnd + 30, nextPot);
    }

    function getCurrentKing() constant returns (address){
        return highestBidder;
    }

    function getCurrentBid() constant returns (uint){
        return highestBid;
    }

    function getCurrentPot() constant returns (uint){
        return currentPot;
    }

    function getEndTime() returns (uint){
        return (gameEnd - gameStart);
    }

    function kill() {
        require(msg.sender == creator);
        selfdestruct(creator);
    }

}