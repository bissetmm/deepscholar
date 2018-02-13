const DB = require("../db");
const {ObjectId} = require("mongodb");

module.exports = class User {
  static collection() {
    return DB.connection().collection("users");
  }

  static findByObjectId(id) {
    return new Promise((resolve, reject) => {
      const query = {
        "_id": ObjectId(id)
      };
      return this.collection().findOne(query, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  static findByProfileId(id) {
    return new Promise((resolve, reject) => {
      const query = {
        "profile.id": id
      };
      return this.collection().findOne(query, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  static insert(user) {
    return new Promise((resolve, reject) => {
      return this.collection().insertOne(user, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  static findOrCreate(profile) {
    const id = profile.id;

    return this.findByProfileId(id).then((user) => {
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

      return this.insert(newUser).then(() => {
        return Object.assign({_id: newUser.insertedId}, newUser);
      });
    });
  }
};
