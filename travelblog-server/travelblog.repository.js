const mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId; 

const url = 'mongodb+srv://Server:comi1234@travelblogcluster.6hqwt.mongodb.net/myFirstDatabase';

class TravelblogRepository {

    async createTravelblog() {
        let travelblog = { entries: [] };
        return this.executeOnDb(async c =>
            (await this.getCollection(c).insertOne(travelblog))["ops"][0]["_id"])
    }

    async getTravelblog(id) {
        return this.executeOnDb(async c =>
            await this.getCollection(c).findOne( { _id: ObjectId(id) } )
        )
    }

    async getTravelblogs() {
        return this.executeOnDb(async c =>
            await this.getCollection(c).find({}).toArray()
        )
    }

    // TODO: entries separately
    async updateTravelblog(body) {
        return this.executeOnDb(async c =>
            await this.getCollection(c).updateOne(
                { _id: ObjectId(body._id) },
                { $set: {
                    title: body.title,
                    destination: body.destination,
                    travelTime: body.travelTime,
                    abstract: body.abstract,
                    entries: body.entries
                }}
            )
        );
    }

    async deleteTravelblog(id) {
        return this.executeOnDb(
            async c => await this.getCollection(c).deleteOne( { _id: ObjectId(id) } )
        )
    }

    async executeOnDb(success) {
        return mongo.connect(url, { useUnifiedTopology: true })
            .then(c => success(c))
            .catch(err => { throw err; })
    }

    getCollection(client) {
        const db = client.db('travelblog-app');
        let collection = db.collection('travelblogs');
        return collection;
    }
}
module.exports = TravelblogRepository