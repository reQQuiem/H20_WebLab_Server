const mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.CONNECTIONSTRING;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;


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
        console.log("URL: " + url);
        return mongo.connect(url, { useUnifiedTopology: true })
            .then(c => success(c))
            .catch(err => { throw err; })
    }

    getCollection(client) {
        const db = client.db(dbName);
        let collection = db.collection(collectionName);
        return collection;
    }
}
module.exports = TravelblogRepository
