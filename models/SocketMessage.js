class SocketMessage {
    id;
    type;
    content;
    timestamp;
    constructor(_ = { _id, _type, _content, _timestamp: new Date().toUTCString() }) {
        this.id = _._id;
        this.type = _._type;
        this.content = _._content;
        this.timestamp = _._timestamp;
    }
}

module.exports = SocketMessage;