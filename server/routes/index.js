// const capacityService = require('../database/capacityService');
//
// capacityService.initDBConnection();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url);
var db = null;

// Use connect method to connect to the Server
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

const findDocuments = function(db, callback) {
  // Get the documents collection
  let collection = db.collection('cats');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
  });
};

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

}

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

  console.log("CAT LOG IS GOING ON!", request.body);
  insertDocs(db, request.body).then(res => {
    console.log('CAT IS THERE');
    response.status(200).json();
  });
};

// export.getCatsByVotes = function(request, response){
//
//   let allCats = [];
//
//   findDocuments(db, function(docs) {
//
//     docs.forEach(doc=>{
//       allCats.push(doc.cats);
//     })
//   });
// };

exports.getAllDocs = function(request, response){

  findDocuments(db, function(docs) {

    response.status(200).json(docs);
  });
};
