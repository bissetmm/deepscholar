const express = require("express");
const bodyParser = require('body-parser');
const Label = require("./models/label");

function getLabel(req, res) {
  const profileId = req.body.profile_id;
  Label.findByProfileId(profileId).then((label) => {
    // console.log('GET');
    // console.log('profileId : ' + profileId);
    // console.log(label);
    if (label) {
      res.send(label);
    } else {
      res.send('error');
    }
  });
}

function setLabel(req, res) {
  const profileId = req.body.profile_id;
  const labelList = req.body.labelList;
  // console.log('SET');
  // console.log('profileId : ' + profileId);
  // console.log('labelList : ' + labelList);
  Label.insertOrCreate(profileId, labelList).then((label) => {
    if (label) {
      res.send('done');
    } else {
      res.send('error');
    }
  });
}

module.exports = (app) => {

  const router = new express.Router();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  router.use('/get/', (req, res) => {
    getLabel(req, res);
  });

  router.use('/set/', (req, res) => {
    setLabel(req, res);
  });

  return router;
};
