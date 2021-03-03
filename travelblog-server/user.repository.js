const mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
//const url = process.env.CONNECTIONSTRING;
const url = 'mongodb+srv://Server:comi1234@travelblogcluster.6hqwt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//const dbName = process.env.DB_NAME;
const dbName = 'travelblog-app';
//const collectionName = process.env.USERS_COLLECTION_NAME;
const collectionName = 'users';

class UsersRepository {

    // TODO: username sollte in der DB eindeutig sein.
    async createUser(user) {
        return this.executeOnDb(async c =>
            (await this.getCollection(c).insertOne(user)));
    }

    async getUser(name) {
        console.log("name in getUser:" + name);
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
module.exports = UsersRepository
