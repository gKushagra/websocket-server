class DataStore {
    clients;
    constructor() {
        this.clients = [];
    }

    Add(client) {
        this.clients.push(client);
    }

    Remove(client) {
        this.clients = this.clients.filter(c => c._id !== client._id);
    }

    Search(client) {
        return this.clients.find(c => client._id === c._id);
    }

    SearchExclude(client) {
        return this.clients.filter(c => c._id !== client._id);
    }
}

module.exports = DataStore;