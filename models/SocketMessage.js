class SocketMessage {
    id;
    type;
    content;
    timestamp;
    constructor(_ = { id, type, content }) {
        this.id = _.id;
        this.type = _.type;
        this.content = _.content;
        this.timestamp = new Date().toUTCString();
    }
}

module.exports = SocketMessage;