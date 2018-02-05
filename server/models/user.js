const DB = require("../db");

module.exports = class User {
  static collection() {
    return DB.connection().collection("users");
  }

  static find(id) {
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

    return this.find(id).then((user) => {
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
