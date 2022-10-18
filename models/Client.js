class Client {
    id;
    socketInfo = { name: null, roomid: null }

    constructor(_id) {
        this.id = _id;
    }
}

module.exports = Client;