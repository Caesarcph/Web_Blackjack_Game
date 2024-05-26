var playerMoneyLeft = 1000;
var moneyBet;
$("#moneyLeft").html("You have $" + playerMoneyLeft + " left.");
deck= new Array();
suits = ["S", "D", "C", "H"];
cardValues = ["A","2","3","4","5","6","7","8","9","T","J","Q","K"];
// add 5 sets of cards to the deck
function addCardsToDeck(){
    for (var i=0; i<5; i++)
{
    for (var j=0; j<suits.length; j++)
    {
        for (var k=0; k<cardValues.length; k++)
        {
            deck.push(cardValues[k]+suits[j]);
        }
    }
}
}

playerCards = new Array();
dealerCards = new Array();
cardSource = "/static/src/img/Pokercards/";

function playerDeal()
{
        //randomly pick 1 card from the deck
        var index = Math.floor(Math.random()*deck.length);
        var card = deck[index];
        playerCards.push(card[0]);
        
        //delete the card from the deck
        deck.splice(index,1);
        newCard = $('<img>').attr('src', cardSource+card+'.png').attr('id', 'card1').addClass('card') .css({
            'height': '100%',
            'width': 'auto',
            'object-fit': 'contain'
            ,'margin-left': '10px'
        });
        $('#playerCardsContainer').append(newCard);
}

function dealerDeal()
{
        //randomly pick 1 card from the deck
        var index = Math.floor(Math.random()*deck.length);
        var card = deck[index];
        dealerCards.push(card[0]);
        //delete the card from the deck
        deck.splice(index,1);
        newCard = $('<img>').attr('src', cardSource+card+'.png').attr('id', 'card1').addClass('card') .css({
            'height': '100%',
            'width': 'auto',
            'object-fit': 'contain'
            ,'margin-left': '10px'
        });
        $('#dealerCardsContainer').append(newCard);
}


function calculateScore(cards){
    var score=0;
    for (var i=0; i<cards.length; i++)
    {
        if (cards[i] == "T" || cards[i] == "J" || cards[i] == "Q" || cards[i] == "K")
        {
            score += 10;
        }
        else if (cards[i] == "A")
        {
            continue;
        }
        else
        {
            score += parseInt(cards[i]);
        }
    }
    for (var i=0; i<cards.length; i++)
    {
        if (cards[i] == "A" && score < 11)
        {
            score += 11;
        }
        else if (cards[i] == "A" && score >=11)
        {
            score += 1;
        }
    }
    return score;

}
function dealerTurn() {
    if (calculateScore(dealerCards) < 17) {
        setTimeout(dealerTurn, 500);
        dealerDeal();
    } else {
        if(calculateScore(dealerCards)>21){
            $("#dealerBust").css("visibility", "visible");
            playerMoneyLeft += moneyBet;
            $("#moneyLeft").html("You have $" + playerMoneyLeft + " left.");
        }
        else if (calculateScore(dealerCards) < calculateScore(playerCards)){
            $("#playerWin").css("visibility", "visible");
            playerMoneyLeft += moneyBet;
            $("#moneyLeft").html("You have $" + playerMoneyLeft + " left.");
        }
        else if (calculateScore(dealerCards) > calculateScore(playerCards)){
            $("#dealerWin").css("visibility", "visible");
            playerMoneyLeft -= moneyBet;
            $("#moneyLeft").html("You have $" + playerMoneyLeft + " left.");
        }
        else{
            $("#tie").css("visibility", "visible");
            playerMoneyLeft += 0;
            $("#moneyLeft").html("You have $" + playerMoneyLeft + " left.");
        }
        onEnd();

    }
}


function onEnd(){
    $('#hitButton').remove();
    $('#stayButton').remove();
    $("#betDiv").css("visibility", "visible");
}


function game(){
    playerDeal();
    playerDeal();
    dealerDeal();
    $(".start").append($("<button id='hitButton' class='btn btn-primary' type='button'>Hit</button>"));
    $(".start").append($("<button id='stayButton' class='btn btn-primary' type='button'>Stay</button>"));
}

function reStart(){
    moneyBet = parseInt($("#RestartBetsInput").val(),10);
    //reset the game
    $('#playerCardsContainer').empty();
    $('#dealerCardsContainer').empty();
    playerCards = new Array();
    dealerCards = new Array();
    deck= new Array();
    addCardsToDeck();
    $("#betDiv").css("visibility", "hidden");
    $("#playerBust").css("visibility", "hidden");
    $("#dealerBust").css("visibility", "hidden");
    $("#playerWin").css("visibility", "hidden");
    $("#dealerWin").css("visibility", "hidden");
    $("#tie").css("visibility", "hidden");
    game();
}


$(document).ready(function() 
{   
    // Start the game
    $('#startButton').click(function() 
    {
        addCardsToDeck();
        $('#moneyLeft').animate({top: 0}, 1000);
        //delete the start button
        $("#BetForm").css("visibility", "hidden");
        moneyBet = parseInt($("#BetsInput").val(),10);
        game();
    });
    
    // Event delegation for hit button
    $(document).on('click', '#hitButton', function() {
        playerDeal();
        if (calculateScore(playerCards) > 21){
            $("#playerBust").css("visibility", "visible");
            playerMoneyLeft -= moneyBet;
            $("#moneyLeft").html("You have $" + playerMoneyLeft + " left.");
            onEnd();
        }
    });

    $(document).on('click', '#stayButton', function() {
        dealerTurn();
    });

    $(document).on('click', '#betButton', function() {
        reStart();
    })
});
