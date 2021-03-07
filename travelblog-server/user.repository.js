const mongo = require('mongodb').MongoClient;
require("dotenv").config();
const url = process.env.CONNECTIONSTRING;
const dbName = process.env.DB_NAME;
const collectionName = process.env.USERS_COLLECTION_NAME;

class UsersRepository {

    // TODO: username sollte in der DB eindeutig sein.
    async createUser(user) {
        return this.executeOnDb(async c =>
            (await this.getCollection(c).insertOne(user)));
    }

    async getUser(name) {
        return this.executeOnDb(async c =>
            await this.getCollection(c).findOne( { name: name } )
        )
    }

    // TODO: nur für Testzwecke
    async getUsers() {
        return this.executeOnDb(async c =>
            await this.getCollection(c).find({}).toArray());
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
}
module.exports = UsersRepository
