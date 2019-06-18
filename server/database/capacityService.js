var fs = require('fs');
var cloudant;
var capacityDB;

const dbCredentials = {
    dbName: 'capacity-plan'
};

const mockups = require('./mockups')

const getDBCredentialsUrl = (jsonData) => {

    let vcapServices = JSON.parse(jsonData);

    for (let vcapService in vcapServices) {
        if (vcapService.match(/cloudant/i)) {
            // check if name of DB is for capacity plan, we can have more DBs in app
            if (vcapServices[vcapService][0].name == "KaizenDashboard DB")
                return vcapServices[vcapService][0].credentials.url;
        }
    }
}
const initDBConnection = () => {

    //When running on Bluemix, this variable will be set to a json object
    //containing all the service credentials of all the bound services
    if (process.env.VCAP_SERVICES) {
        dbCredentials.url = getDBCredentialsUrl(process.env.VCAP_SERVICES);
    } else {
        //When running locally, the VCAP_SERVICES will not be set
        // dbCredentials.url = getDBCredentialsUrl(fs.readFileSync("env.json", "utf-8"));
    }

    cloudant = require('@cloudant/cloudant')(dbCredentials.url);

    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function(err, res) {
        if (err) {
            console.log('Could not create new db: ' + dbCredentials.dbName + ', it might already exist.');
        }
    });

    capacityDB = cloudant.use(dbCredentials.dbName);

    // insert one mock document
    // insertCapacityRequest(mockups.capacityObject)
    //     .then(body => console.log('Mockup document created successfuly!'))
    //     .catch(err => console.log('Couldnt create mockup document.'))
}

/**
 * Function inserts single capacity request into DB.
 * @param {doc} json object with info to store.
 */
const insertCapacityRequest = (doc)  => new Promise((resolve, reject) => {

    capacityDB.insert(doc, function(err, body) {
        if (err)
          reject(err)
        else
          resolve(body)
      })
});

/**
 * Function lists all capacity records.
 */
const listCapacityRecords = () =>  new Promise((resolve, reject) => {

    capacityDB.list({include_docs:true}, function (err, body) {
        if (err)
            reject(err);

        // object to be resolved
        let docs = {
            totalRows: body.total_rows,
            rows: []
        };

        body.rows.forEach(row => {
            docs.rows.push(row.doc)
        });

        resolve(docs);
      })
});

module.exports.initDBConnection = initDBConnection;
module.exports.insertCapacityRequest = insertCapacityRequest;
module.exports.listCapacityRecords = listCapacityRecords;
