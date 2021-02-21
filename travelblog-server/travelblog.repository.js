const uuid = require('uuid').v1;
const mongo = require('mongodb').MongoClient
const url = process.env.MONGODB_CONNECTIONSTRING;

class TravelblogRepository {

    async createTravelblog() {
        const client = await this.getClient();
        let collection = this.getCollection(client);

        let travelblogUuid = uuid();
        let travelblog = {
            id: travelblogUuid,
            entries: []
        };

        await collection.insertOne(travelblog);

        return travelblogUuid;
    }

    async getTravelblog(travelblogUuid) {
        const client = await this.getClient();
        let collection = this.getCollection(client);
        return await collection.findOne({id: travelblogUuid});
    }

    async getTravelblogs() {
        const client = await this.getClient();
        let collection = this.getCollection(client);
        let resultAsArray = await collection.find({}).toArray();
        return resultAsArray.map(n => n.id);
    }


    async updateTravelblog(travelblogUuid, travelblogBody) {
        const client = await this.getClient();
        if (!client) {
            throw "Client not available.";
        }

        let collection = this.getCollection(client);
        await collection.updateOne({id: travelblogUuid}, {$set: travelblogBody});
    }

    async deleteTravelblog(travelblogUuid) {
        const client = await this.getClient();
        if (!client) {
            throw "Client not available.";
        }

        let collection = this.getCollection(client);
        await collection.deleteOne({id: travelblogUuid});
    }

    async getClient() {
        return await mongo.connect(url).catch((err) => console.log(err));
    }

    getCollection(client) {
        const db = client.db('travelblog-app');
        let collection = db.collection('travelblogs');
        return collection;
    }
}
