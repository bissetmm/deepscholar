const {MongoClient} = require("mongodb");

class DB {
  constructor() {
    this.db = null;

    MongoClient.connect("mongodb://deepscholar.database:27017")
      .then((client) => {
        this.db = client.db("deepscholar");
      });
  }

  findUser(id) {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection("users");

      const query = {
        "profile.id": id
      };
      return collection.findOne(query, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  insertUser(user) {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection("users");

      return collection.insertOne(user, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  findOrCreateUser(profile) {
    const id = profile.id;

    return this.findUser(id).then((user) => {
      if (user) {
        return user;
      }

      const {displayName, username, profileUrl, emails, photos, provider} = profile;

      const newUser = {
        profile: {
          id,
          displayName,
          username,
          profileUrl,
          emails,
          photos,
          provider
        }
      };

      return this.insertUser(newUser).then(() => {
        return Object.assign({_id: newUser.insertedId}, newUser);
      });
    });
  }
}

module.exports = new DB();