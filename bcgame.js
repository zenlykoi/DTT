var amount = 100.012345;
var chance = 69.96;
var isHigh = true;
var delay = 2000;

function bet(amount, chance, isHigh)
{
	cd.amount.constructor(amount);
	cd.betChance = chance;
	cd.isHigh = isHigh;

	cd.handleBet().then(function(){
	    handleWhenFinishBet({
	    	currency : cd.myBets[0].currencyName,
            balances : document.querySelector('#header .amount-str').innerText,
            gameResult : parseFloat(cd.gameResult/100),
            profit : cd.myBets[0].profitAmount,
            amount : amount,
            chance : chance,
            isHigh : isHigh
	    });
	});
}

function disableSound()
{
	cd.sounds.soundEnable = false;
}

function enableTurboBet()
{
    cd.settings.fastEnable = true;
}

function handleWhenFinishBet(data)
{
	window.__np__gameProfit = (window.__np__gameProfit) ? window.__np__gameProfit : 0;
	window.__np__gameProfit = (parseFloat(window.__np__gameProfit) + parseFloat(data.profit)).toFixed(8);

	document.querySelector('#__np__insertDOM ul #gameResult').innerText = data.gameResult;
    document.querySelector('#__np__insertDOM ul #currency').innerText = data.currency;
    document.querySelector('#__np__insertDOM ul #betProfit').innerText = data.profit;
    document.querySelector('#__np__insertDOM ul #profit').innerText = window.__np__gameProfit;
    document.querySelector('#__np__insertDOM ul #balances').innerText = data.balances;
    document.querySelector('#__np__insertDOM ul #amount').innerText = data.amount;
    document.querySelector('#__np__insertDOM ul #chance').innerText = data.chance;
    document.querySelector('#__np__insertDOM ul #isHigh').innerText = data.isHigh;
}

function insertDom()
{
    const html = `
        <div id="__np__insertDOM" style="position: absolute;top: 0px;right: 0px;z-index: 10000000000000000!important;width: 250px;height: 380px;border: 1px solid red;background: rgb(54, 80, 18, 0.6);">
            <button id="__np__startbtn" style="background-color: white;font-size: 25px;margin: 5px;padding: 3px;">Start</button>
            <button id="__np__stopbtn" style="background-color: white;font-size: 25px;margin: 5px;padding: 3px;">Stop</button>
            <br>
            <ul style="margin-left: 5px;">
                <li style="font-size: 17px;color: white;">
                    Game Result: <span id="gameResult" style="font-size: 17px;color: yellow;"></span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Bet Profit: <span id="betProfit" style="font-size: 17px;color: yellow;"></span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Profit: <span id="profit" style="font-size: 17px;color: yellow;"></span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Balances: <span id="balances" style="font-size: 17px;color: yellow;">${document.querySelector('#header .amount-str').innerText}</span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Currency: <span id="currency" style="font-size: 17px;color: yellow;">${cd.myBets[0].currencyName}</span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Amount: <span id="amount" style="font-size: 17px;color: yellow;"></span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Chance: <span id="chance" style="font-size: 17px;color: yellow;"></span>
                </li>
                <li style="font-size: 17px;color: white;">
                    IsHigh: <span id="isHigh" style="font-size: 17px;color: yellow;"></span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Loop: <span id="loop" style="font-size: 17px;color: yellow;"></span>
                </li>
            </ul>
        </div>
    `;

    if (!window.__np__isInsertedDom)
    {
        window.__np__isInsertedDom = true;

        const div = document.createElement('div');
        div.innerHTML = html.trim();
        document.body.appendChild(div.firstChild);

        let loop = null;

        document.querySelector('#__np__insertDOM #__np__startbtn').onclick = function()
        {
            loop = setInterval(function(){
                bet(parseFloat(amount), parseFloat(chance), isHigh);
            }, delay);
            document.querySelector('#__np__insertDOM ul #loop').innerText = (loop) ? 'ON' : 'OFF';
        }

        document.querySelector('#__np__insertDOM #__np__stopbtn').onclick = function()
        {
            clearInterval(loop);
            loop = null;
            document.querySelector('#__np__insertDOM ul #loop').innerText = (loop) ? 'ON' : 'OFF';
        }
    }
}

/*********************************************************************************/

function AddJS(src, cb) 
{
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = src
    s.onload = cb
    document.head.appendChild(s)
}

AddJS('https://code.jquery.com/jquery-3.5.1.min.js', function(){
    disableSound();
    enableTurboBet();
    insertDom();
});
