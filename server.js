const Client = require('./models/Client');
const SocketMessage = require('./models/SocketMessage');
const MessageTypes = require('./models/MessageTypes');
const DataStore = require('./data/DataStore');

const WebSocket = require('ws');
const { v4: UUID } = require('uuid');

const WebSocketServer = new WebSocket.Server({ port: 7775 });
const store = new DataStore();

WebSocketServer.on('listening', () => console.log('WebSocketServer: Running on port 7775'));

WebSocketServer.on('error', (error) => console.log('WebSocketServe: Error: \n', error));

WebSocketServer.on('connection', (socket) => {

    console.log('WebSocketServer: New connection');
    if (!('_id' in socket) && !store.Search(new Client(socket._id))) {
        socket['_id'] = UUID();
        store.Add(new Client(socket._id));
        console.log(`WebSocketServer: New connection added to store ${socket._id}`);
    }

    socket.on('message', (data) => {
        console.log(`WebSocketServer: New message from ${socket._id}`);
        const parsedData = JSON.parse(data);
        if (('id' in parsedData) || ('type' in parsedData) || ('content' in parsedData)) {
            const Message = new SocketMessage(parsedData);
            switch (Message.type) {
                case (MessageTypes.chat || MessageTypes.video):
                    const peers = store.SearchExclude(new Client(socket._id));
                    (peers && peers.length > 0) ?
                        WebSocketServer.clients.forEach((client) => {
                            if (client._id !== socket._id) client.send(JSON.stringify(Message));
                        })
                        :
                        console.log(`WebSocketServer: No peers found ${socket._id}`);
                    break;
                case MessageTypes.info:
                    const client = store.Search(new Client(socket._id));
                    client ?
                        client.socketInfo = Message.content :
                        console.log(`WebSocketServer: Client not found ${socket._id}`);
                    break;

                default:
                    console.log(`WebSocketServer: Invalid message type ${Message.type} ${socket._id}`);
                    break;
            }
        } else {
            console.log(`WebSocketServer: Error: Ignoring Message - missing required properties id, type & content ${socket._id}`);
        }
    });

    socket.on('error', (error) => {
        console.log(`WebSocketServer: Error and connection closed ${socket._id} \n`, error);
        store.Remove(new Client(socket._id));
    });

    socket.on('close', () => {
        console.log(`WebSocketServer: Connection closed ${socket._id}`);
        store.Remove(new Client(socket._id));
    });

});

WebSocketServer.on('close', () => console.log('WebSocketServer: Shut down'));