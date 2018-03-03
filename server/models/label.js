const DB = require("../db");
const {ObjectId} = require("mongodb");

module.exports = class Label {
  static collection() {
    return DB.connection().collection("users");
  }

  static findByProfileId(id) {
    return new Promise((resolve, reject) => {
      const query = {
        "label.id": id
      };
      return this.collection().findOne(query, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  static insertOrCreate(id,labelList) {

    return this.findByProfileId(id).then((result) => {

      const label = {
        label: { id, labelList }
      };

      if (result) {
        const query = { "label.id": id };
        return this.collection().update(query, label).then(() => {
          return Object.assign({_id: label.insertedId}, label);
        });
      } else {
        return this.collection().insertOne(label).then(() => {
          return Object.assign({_id: label.insertedId}, label);
        });
      }
      
    });
  }
};
