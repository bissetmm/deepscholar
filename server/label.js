const express = require("express");
const bodyParser = require('body-parser');
const Label = require("./models/label");

function getLabel(req, res) {
  const profile_id = req.body.profile_id;
  Label.findByProfileId(profile_id).then((label) => {
    // console.log('GET');
    // console.log('profile_id : ' + profile_id);
    // console.log(label);
    if (label) {
      res.send(label);    
    } else {
      res.send('error');    
    }    
  });
}

function setLabel(req, res) {
  const profile_id = req.body.profile_id;
  const labelList = req.body.labelList;
  // console.log('SET');
  // console.log('profile_id : ' + profile_id);
  // console.log('labelList : ' + labelList);
  Label.insertOrCreate(profile_id, labelList).then((label) => {
    if (label) {
      res.send('done');    
    } else {
      res.send('error');    
    }    
  });
}

module.exports = (app) => {

  const router = express.Router();

  app.use( bodyParser.json() );
  app.use( bodyParser.urlencoded({
    extended: true
  })); 

  router.use('/get/', function (req, res) {
    getLabel(req, res);
  });

  router.use('/set/', function (req, res) {
    setLabel(req, res);
  });

  return router;
};
