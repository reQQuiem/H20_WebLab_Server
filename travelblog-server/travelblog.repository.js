const mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const UsersRepository = require('./user.repository')
require("dotenv").config();

const url = process.env.CONNECTIONSTRING;
const dbName = process.env.DB_NAME;
const collectionName = process.env.TRAVELBLOGS_COLLECTION_NAME;


class TravelblogRepository {

    async createTravelblog(body, name) {

        let travelblog = { owner: name};
        // TODO: Assure the data type makes sense
        if (body.title) travelblog.title = body.title;
        if (body.destination) travelblog.destination = body.destination;
        if (body.departure) travelblog.departure = body.departure;
        if (body.arrival) travelblog.arrival = body.arrival;
        if (body.abstract) travelblog.abstract = body.abstract;
        if (body.entries) travelblog.entries = body.entries;
        else travelblog.entries = [];

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

    async deleteTravelblog(id, name) {
        let repo = new UsersRepository();
        const user = await repo.getUser(name);

        if (!user) throw "No user found!";
        return this.executeOnDb(
            async c => await this.getCollection(c).deleteOne( { _id: ObjectId(id), owner: user.name} )
        )
    }

    async executeOnDb(success) {
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
