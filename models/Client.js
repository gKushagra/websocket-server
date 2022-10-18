class Client {
    _id;
    _socketInfo = { name: null, roomid: null }

    constructor(id) {
        this._id = id;
    }
}

module.exports = Client;