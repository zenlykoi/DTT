var basebet = 0.00000100;
var nextbet = basebet; // bet amount kế tiếp
var previousbet; // bet amount trước
var bethigh = false; // đặt cược dưới hay trên
var chance = 50;
var win = false;
var delay = 2000;

function bet(amount, chance, bethigh) {
    return new Promise(function (resolve, reject) {
        const betData = `{"type":"auto","m":true,"roll":{"over":${bethigh ? 1 : 0},"rv":${bethigh ? parseFloat((99.99 - chance).toFixed(2)) : chance},"pa":${Math.floor((99/chance) * 1000) / 1000},"bet":${amount.toFixed(8)},"short":"usdt"},"auto":{"bet":${amount.toFixed(8)},"over":${bethigh ? 1 : 0},"chance":${chance},"num":1,"pr":null,"l":{"n":0,"sn":0,"ev":[0,1],"be":[0,0],"ch":[0,0],"st":[1,0],"re":[0,0]},"w":{"n":0,"sn":0,"ev":[0,1],"be":[0,0],"ch":[0,0],"st":[1,0],"re":[0,0]},"li":[0,0,0,0,0]}}`;
        
        _socket.emit('dice', {
            z: Compresser.compressToBase64(betData)
        }, function (res) {
            res = JSON.parse(Compresser.decompressFromBase64(res.z));
            if (res.error) {
                return reject(res.message);
            }

            return resolve(res);
        });
    });
}

const Compresser = function () {
    var e = String.fromCharCode
        , t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        , n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$"
        , r = {};
    function i(e, t) {
        if (!r[e]) {
            r[e] = {};
            for (var n = 0; n < e.length; n++)
                r[e][e.charAt(n)] = n
        }
        return r[e][t]
    }
    var o = {
        compressToBase64: function (e) {
            if (null == e)
                return "";
            var n = o._compress(e, 6, (function (e) {
                return t.charAt(e)
            }
            ));
            switch (n.length % 4) {
                default:
                case 0:
                    return n;
                case 1:
                    return n + "===";
                case 2:
                    return n + "==";
                case 3:
                    return n + "="
            }
        },
        decompressFromBase64: function (e) {
            return null == e ? "" : "" == e ? null : o._decompress(e.length, 32, (function (n) {
                return i(t, e.charAt(n))
            }
            ))
        },
        compressToUTF16: function (t) {
            return null == t ? "" : o._compress(t, 15, (function (t) {
                return e(t + 32)
            }
            )) + " "
        },
        decompressFromUTF16: function (e) {
            return null == e ? "" : "" == e ? null : o._decompress(e.length, 16384, (function (t) {
                return e.charCodeAt(t) - 32
            }
            ))
        },
        compressToUint8Array: function (e) {
            for (var t = o.compress(e), n = new Uint8Array(2 * t.length), r = 0, i = t.length; r < i; r++) {
                var a = t.charCodeAt(r);
                n[2 * r] = a >>> 8,
                    n[2 * r + 1] = a % 256
            }
            return n
        },
        decompressFromUint8Array: function (t) {
            if (null === t || void 0 === t)
                return o.decompress(t);
            for (var n = new Array(t.length / 2), r = 0, i = n.length; r < i; r++)
                n[r] = 256 * t[2 * r] + t[2 * r + 1];
            var a = [];
            return n.forEach((function (t) {
                a.push(e(t))
            }
            )),
                o.decompress(a.join(""))
        },
        compressToEncodedURIComponent: function (e) {
            return null == e ? "" : o._compress(e, 6, (function (e) {
                return n.charAt(e)
            }
            ))
        },
        decompressFromEncodedURIComponent: function (e) {
            return null == e ? "" : "" == e ? null : (e = e.replace(/ /g, "+"),
                o._decompress(e.length, 32, (function (t) {
                    return i(n, e.charAt(t))
                }
                )))
        },
        compress: function (t) {
            return o._compress(t, 16, (function (t) {
                return e(t)
            }
            ))
        },
        _compress: function (e, t, n) {
            if (null == e)
                return "";
            var r, i, o, a = {}, s = {}, u = "", l = "", c = "", h = 2, f = 3, p = 2, d = [], m = 0, y = 0;
            for (o = 0; o < e.length; o += 1)
                if (u = e.charAt(o),
                    Object.prototype.hasOwnProperty.call(a, u) || (a[u] = f++,
                        s[u] = !0),
                    l = c + u,
                    Object.prototype.hasOwnProperty.call(a, l))
                    c = l;
                else {
                    if (Object.prototype.hasOwnProperty.call(s, c)) {
                        if (c.charCodeAt(0) < 256) {
                            for (r = 0; r < p; r++)
                                m <<= 1,
                                    y == t - 1 ? (y = 0,
                                        d.push(n(m)),
                                        m = 0) : y++;
                            for (i = c.charCodeAt(0),
                                r = 0; r < 8; r++)
                                m = m << 1 | 1 & i,
                                    y == t - 1 ? (y = 0,
                                        d.push(n(m)),
                                        m = 0) : y++,
                                    i >>= 1
                        } else {
                            for (i = 1,
                                r = 0; r < p; r++)
                                m = m << 1 | i,
                                    y == t - 1 ? (y = 0,
                                        d.push(n(m)),
                                        m = 0) : y++,
                                    i = 0;
                            for (i = c.charCodeAt(0),
                                r = 0; r < 16; r++)
                                m = m << 1 | 1 & i,
                                    y == t - 1 ? (y = 0,
                                        d.push(n(m)),
                                        m = 0) : y++,
                                    i >>= 1
                        }
                        0 == --h && (h = Math.pow(2, p),
                            p++),
                            delete s[c]
                    } else
                        for (i = a[c],
                            r = 0; r < p; r++)
                            m = m << 1 | 1 & i,
                                y == t - 1 ? (y = 0,
                                    d.push(n(m)),
                                    m = 0) : y++,
                                i >>= 1;
                    0 == --h && (h = Math.pow(2, p),
                        p++),
                        a[l] = f++,
                        c = String(u)
                }
            if ("" !== c) {
                if (Object.prototype.hasOwnProperty.call(s, c)) {
                    if (c.charCodeAt(0) < 256) {
                        for (r = 0; r < p; r++)
                            m <<= 1,
                                y == t - 1 ? (y = 0,
                                    d.push(n(m)),
                                    m = 0) : y++;
                        for (i = c.charCodeAt(0),
                            r = 0; r < 8; r++)
                            m = m << 1 | 1 & i,
                                y == t - 1 ? (y = 0,
                                    d.push(n(m)),
                                    m = 0) : y++,
                                i >>= 1
                    } else {
                        for (i = 1,
                            r = 0; r < p; r++)
                            m = m << 1 | i,
                                y == t - 1 ? (y = 0,
                                    d.push(n(m)),
                                    m = 0) : y++,
                                i = 0;
                        for (i = c.charCodeAt(0),
                            r = 0; r < 16; r++)
                            m = m << 1 | 1 & i,
                                y == t - 1 ? (y = 0,
                                    d.push(n(m)),
                                    m = 0) : y++,
                                i >>= 1
                    }
                    0 == --h && (h = Math.pow(2, p),
                        p++),
                        delete s[c]
                } else
                    for (i = a[c],
                        r = 0; r < p; r++)
                        m = m << 1 | 1 & i,
                            y == t - 1 ? (y = 0,
                                d.push(n(m)),
                                m = 0) : y++,
                            i >>= 1;
                0 == --h && (h = Math.pow(2, p),
                    p++)
            }
            for (i = 2,
                r = 0; r < p; r++)
                m = m << 1 | 1 & i,
                    y == t - 1 ? (y = 0,
                        d.push(n(m)),
                        m = 0) : y++,
                    i >>= 1;
            for (; ;) {
                if (m <<= 1,
                    y == t - 1) {
                    d.push(n(m));
                    break
                }
                y++
            }
            return d.join("")
        },
        decompress: function (e) {
            return null == e ? "" : "" == e ? null : o._decompress(e.length, 32768, (function (t) {
                return e.charCodeAt(t)
            }
            ))
        },
        _decompress: function (t, n, r) {
            var i, o, a, s, u, l, c, h = [], f = 4, p = 4, d = 3, m = "", y = [], v = {
                val: r(0),
                position: n,
                index: 1
            };
            for (i = 0; i < 3; i += 1)
                h[i] = i;
            for (a = 0,
                u = Math.pow(2, 2),
                l = 1; l != u;)
                s = v.val & v.position,
                    v.position >>= 1,
                    0 == v.position && (v.position = n,
                        v.val = r(v.index++)),
                    a |= (s > 0 ? 1 : 0) * l,
                    l <<= 1;
            switch (a) {
                case 0:
                    for (a = 0,
                        u = Math.pow(2, 8),
                        l = 1; l != u;)
                        s = v.val & v.position,
                            v.position >>= 1,
                            0 == v.position && (v.position = n,
                                v.val = r(v.index++)),
                            a |= (s > 0 ? 1 : 0) * l,
                            l <<= 1;
                    c = e(a);
                    break;
                case 1:
                    for (a = 0,
                        u = Math.pow(2, 16),
                        l = 1; l != u;)
                        s = v.val & v.position,
                            v.position >>= 1,
                            0 == v.position && (v.position = n,
                                v.val = r(v.index++)),
                            a |= (s > 0 ? 1 : 0) * l,
                            l <<= 1;
                    c = e(a);
                    break;
                case 2:
                    return ""
            }
            for (h[3] = c,
                o = c,
                y.push(c); ;) {
                if (v.index > t)
                    return "";
                for (a = 0,
                    u = Math.pow(2, d),
                    l = 1; l != u;)
                    s = v.val & v.position,
                        v.position >>= 1,
                        0 == v.position && (v.position = n,
                            v.val = r(v.index++)),
                        a |= (s > 0 ? 1 : 0) * l,
                        l <<= 1;
                switch (c = a) {
                    case 0:
                        for (a = 0,
                            u = Math.pow(2, 8),
                            l = 1; l != u;)
                            s = v.val & v.position,
                                v.position >>= 1,
                                0 == v.position && (v.position = n,
                                    v.val = r(v.index++)),
                                a |= (s > 0 ? 1 : 0) * l,
                                l <<= 1;
                        h[p++] = e(a),
                            c = p - 1,
                            f--;
                        break;
                    case 1:
                        for (a = 0,
                            u = Math.pow(2, 16),
                            l = 1; l != u;)
                            s = v.val & v.position,
                                v.position >>= 1,
                                0 == v.position && (v.position = n,
                                    v.val = r(v.index++)),
                                a |= (s > 0 ? 1 : 0) * l,
                                l <<= 1;
                        h[p++] = e(a),
                            c = p - 1,
                            f--;
                        break;
                    case 2:
                        return y.join("")
                }
                if (0 == f && (f = Math.pow(2, d),
                    d++),
                    h[c])
                    m = h[c];
                else {
                    if (c !== p)
                        return null;
                    m = o + o.charAt(0)
                }
                y.push(m),
                    h[p++] = o + m.charAt(0),
                    o = m,
                    0 == --f && (f = Math.pow(2, d),
                        d++)
            }
        }
    };
    return o
}();

async function getFp() {
    const fp = await FingerprintJS.load();
    const {visitorId} = await fp.get();
    return visitorId;
}

async function connect() {
    const token = JSON.parse(localStorage.cr_token).key;
    const namespace = 'sck';
    const fp = await getFp();
    const url = new URL('wss://wintomato.com/');
    
    url.pathname = namespace;
    url.searchParams.set('token', token);
    url.searchParams.set('browser', 'chrome');
    url.searchParams.set('os', 'Windows 10');
    url.searchParams.set('EIO', 4);
    url.searchParams.set('fp', fp);

    const socket = new _io(url.href, { 
        transports: ["websocket"],
        parser: _parser
    });

    return socket;
}

function handleWhenFinishBet(data)
{
    const {roll, auto} = data;

	window.__np__gameProfit = (window.__np__gameProfit) ? window.__np__gameProfit : 0;
	window.__np__gameProfit = (parseFloat(window.__np__gameProfit) + parseFloat(roll.delta)).toFixed(8);

	document.querySelector('#__np__insertDOM ul #gameResult').innerText = roll.outcome;
    document.querySelector('#__np__insertDOM ul #currency').innerText = roll.short;
    document.querySelector('#__np__insertDOM ul #betProfit').innerText = roll.profit;
    document.querySelector('#__np__insertDOM ul #profit').innerText = window.__np__gameProfit;
    document.querySelector('#__np__insertDOM ul #balances').innerText = roll.after;
    document.querySelector('#__np__insertDOM ul #amount').innerText = auto.bet;
    document.querySelector('#__np__insertDOM ul #chance').innerText = auto.chance;
    document.querySelector('#__np__insertDOM ul #isHigh').innerText = (auto.over == 1) ? true : false;
}

function insertDom(initialData)
{
    const currency = document.querySelector('.diceGame .stats .diceBtn img').title;
    const {balance: balances} = initialData;
    const balance = balances['balance' + '_' + currency];

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
                    Balances: <span id="balances" style="font-size: 17px;color: yellow;">${balance}</span>
                </li>
                <li style="font-size: 17px;color: white;">
                    Currency: <span id="currency" style="font-size: 17px;color: yellow;">${currency}</span>
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
                bet(parseFloat(nextbet), parseFloat(chance), bethigh).then(function(res){
                    handleWhenFinishBet(res);
                });
		        ChienLuoc();
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

function randomnumber(min, max)
{
    if (!max) return Math.floor(Math.random() * (min - 0 + 1)) + 0
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function ChienLuoc()
{
    var r = randomnumber(1, 2);
    if (r % 2 == 0)
    {
        bethigh = true; // đặt cược trên
        chance = randomnumber(30, 40);
    }
    else
    {
        bethigh = false; // đặt cược dưới
        chance = randomnumber(35, 65);
    }

    if (win == true)
    {
        nextbet = basebet;
    }
    else
    {
        var t = randomnumber(10, 30);
        nextbet = (previousbet ? previousbet : basebet) * (t/10);
    }
}

AddJS('https://code.jquery.com/jquery-3.5.1.min.js', function(){
    AddJS('https://zenlykoi.github.io/DTT/socket_client.js', function(){
        AddJS('https://zenlykoi.github.io/DTT/fingerprint.js', function(){
            connect().then(function(socket){
                socket.on('onInit', function(res){
                    const initialData = JSON.parse(Compresser.decompressFromBase64(res.z));
                    insertDom(initialData);
                });
                window._socket = socket;
            });
        });
    });
});
