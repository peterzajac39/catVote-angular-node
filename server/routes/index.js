// const capacityService = require('../database/capacityService');
//
// capacityService.initDBConnection();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const catfaker = require('cat-names');
const https = require('https');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);
var db = null;

// Use connect method to connect to the mongo db server
client.connect(function(err) {

  assert.equal(null, err);
  console.log("Connected successfully to mongoDB");
  db = client.db(dbName);
});

const insertDocs = function(db, catObj){
  return new Promise((resolve, reject) => {
    const collection = db.collection('cats');
    collection.insertOne(catObj, function(err, result) {
        if (err)
          reject(err)
        console.log("Inserted cat into db: ", catObj);
        resolve(result);
      });
  });
}

const insertDocuments = function(db, catObj, callback) {
  // Get the documents collection
  const collection = db.collection('cats');
  // Insert some documents
  collection.insertOne(catObj
  , function(err, result) {
    assert.equal(err, null);
    console.log("Inserted cat into db: ", catObj);
    callback(result);
  });
};

// function returns all documents from cats collection
const findDocuments = function(db, callback) {
  // Get the documents collection
  let collection = db.collection('cats');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

// function gets random document from cats collection
const getRandomDocument = function(db) {

  let collection = db.collection('cats');

  return new Promise((resolve, reject) => {
    collection.aggregate([{ $sample: { size: 1 } }])
      .toArray(function(err, result) {
        if (err)
          reject(err)
        resolve(result);
      })
  })
};

exports.getNewCat = function(req,response){

  https.get('https://api.thecatapi.com/v1/images/search?size=small', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      let pairObject = JSON.parse(data);
      // we add fake name of cat
      pairObject[0]['name'] = catfaker.random();
      response.status(200).json(pairObject);
    });

  }).on("error", (err) => {
    response.status(404).json();
  });
};

/**
 * Function returns home page.
 */
exports.index = function(req, res){
  res.render('index.html', { title: 'Cat app.' });
};

exports.getRandomDocument = function(request, response){

  getRandomDocument(db).then(cats => {
    console.log('Got random cats', cats);
    response.status(200).json(cats);
  });
};

/**
 * Functions insert capacity to capacity DB from request body in json format
 */
exports.insertLog = function(request, response){

  insertDocs(db, request.body).then(res => {
    response.status(200).json();
  });
};

exports.getAllDocs = function(request, response){

  findDocuments(db, function(docs) {
    response.status(200).json(docs);
  });
};
