const Client = require('./models/Client');
const SocketMessage = require('./models/SocketMessage');
const MessageTypes = require('./models/MessageTypes');
const DataStore = require('./data/DataStore');

const WebSocket = require('ws');
const { v4: UUID } = require('uuid');

const WebSocketServer = new WebSocket.Server({ port: 7775 });
const store = new DataStore();

WebSocketServer.on('listening', () => console.log('WebSocketServer: Running on port 7775.'));

WebSocketServer.on('error', (error) => console.log('WebSocketServe: Error: \n', error));

WebSocketServer.on('connection', (socket) => {

    socket.on('open', () => {
        console.log('WebSocketServer: New connection');
        if (!('id' in socket) && !store.Search(new Client(socket.id))) {
            socket['id'] = UUID();
            store.Add(new Client(socket.id));
            console.log(`WebSocketServer: New connection added to store ${socket.id}`);
        }
    });

    socket.on('message', (data) => {
        console.log(`WebSocketServer: New message from ${socket.id}`);
        const Message = new SocketMessage(JSON.parse(data));
        switch (Message.type) {
            case (MessageTypes.chat || MessageTypes.video):
                const peers = store.SearchExclude(new Client(socket.id));
                (peers && peers.length > 0) ?
                    peers.forEach((peer) => socket.send(JSON.stringify(Message))) :
                    console.log(`WebSocketServer: No peers found ${socket.id}`);
                break;
            case MessageTypes.info:
                const client = store.Search(new Client(socket.id));
                client ?
                    client._socketInfo = Message.content :
                    console.log(`WebSocketServer: Client not found ${socket.id}`);
                break;

            default:
                break;
        }
    });

    socket.on('error', (error) => {
        console.log(`WebSocketServer: Error and connection closed ${socket.id} \n`, error);
        data.Remove(new Client(socket.id));
    });

    socket.on('close', () => {
        console.log(`WebSocketServer: Connection closed ${socket.id}`);
        data.Remove(new Client(socket.id));
    });

});

WebSocketServer.on('close', () => console.log('WebSocketServer: Shut down'));