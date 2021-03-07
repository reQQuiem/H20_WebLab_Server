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
        this.applyAttributes(body, travelblog)

        return this.executeOnDb(async c =>
            (await this.getCollection(c).insertOne(travelblog))["ops"][0]["_id"])
    }

    async getTravelblogById(id) {
        return this.executeOnDb(async c =>
            await this.getCollection(c).findOne( { _id: ObjectId(id) } )
        )
    }

    async getTravelblogs(filter) {
        return this.executeOnDb(async c =>
            await this.getCollection(c).find(filter).toArray()
        )
    }

    // TODO: entries separately
    async updateTravelblog(body, name) {
        let repo = new UsersRepository();
        const user = await repo.getUser(name);
        if (!user)
            throw "No user found!";

        return this.executeOnDb(async c =>
            await this.getCollection(c).updateOne(
                { _id: ObjectId(body._id), owner: user.name },
                { $set: {
                    title: body.title,
                    destination: body.destination,
                    departure: body.departure,
                    arrival: body.arrival,
                    abstract: body.abstract,
                    entries: body.entries
                }}
            )
        );
    }

    async deleteTravelblog(id, name) {
        let repo = new UsersRepository();
        const user = await repo.getUser(name);
        if (!user)
            throw "No user found!";

        return this.executeOnDb(
            async c => await this.getCollection(c).deleteOne( { _id: ObjectId(id), owner: user.name} )
        )
    }

    async executeOnDb(success) {
        return mongo.connect(url)
            .then(c => success(c))
            .catch(err => { throw err; })
    }

    getCollection(client) {
        const db = client.db(dbName);
        let collection = db.collection(collectionName);
        return collection;
    }

    applyAttributes(from, to) {
        // TODO: Assure the data type makes sense
        if (from.title)
            to.title = from.title;
        if (from.destination)
            to.destination = from.destination;
        if (from.departure)
            to.departure = from.departure;
        if (from.arrival)
            to.arrival = from.arrival;
        if (from.abstract)
            to.abstract = from.abstract;
        // TODO: Check parameters of entries as well
        if (from.entries)
            to.entries = from.entries;
        else
            to.entries = [];
    }
}
module.exports = TravelblogRepository
