const WebSocket = require('ws');

var p = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: p });
console.log('port:',p)

var clients = [];


function searchClients(array, key, value) {
    array.forEach(element => {
        if (element[key] == value){
            //console.log(element[key] + ' ' + element['id']);
            return value;
        }
    });
}


wss.on('connection', ws => {
    console.log('connection from new client! ');

    //clients.push({ 'id': Math.random().toString(36).slice(2, 8) , 'client':ws});
    clients.push(ws);

    ws.on('message', data => {
        data = JSON.parse(data);
        console.log(data);
        /*console.log(`Clients list ${clients.findIndex(user => {
            return user == ws;
        })}`); */

        clients.forEach(client => {
            if (client != ws){
                
                client.send(JSON.stringify(data));
            }
        });

    });

    ws.on('close', () => {
        delete clients[clients.findIndex(user => {return user == ws;})];
        console.log('client has disconnected!');
    })
});


/**
 * 
 * zrób pokoje
 * mozliwojs dołączania
 * wyślij zapytasnie o server lub jak z kodem to od razu
 * 
 * 
 */
