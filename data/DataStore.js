class DataStore {
    clients;
    constructor() {
        this.clients = [];
    }

    Add(client) {
        this.clients.push(client);
    }

    Remove(client) {
        this.clients = this.clients.filter(c => c.id !== client.id);
    }

    Search(client) {
        return this.clients.find(c => client.id === c.id);
    }

    SearchExclude(client) {
        return this.clients.filter(c => c.id !== client.id);
    }
}

module.exports = DataStore;