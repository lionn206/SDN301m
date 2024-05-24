const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const url = "mongodb://localhost:27017/";
const dbname = "conFusion";
const dboper = require("./routes/operations");
MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log("Connected correctly to server");

  const db = client.db(dbname);
  //const collection = db.collection("dishes");

  dboper.insertDocument(
    db,
    { name: "Com Chay", description: "Chay Com" },
    "dishes",
    (result) => {
      console.log("Insert Document:\n", result.ops);

      dboper.findDocuments(db, "dishes", (docs) => {
        console.log("Found Documents:\n", docs);

        dboper.updateDocument(
          db,
          { name: "Uthappizza" },
          { description: "Updated Test 1" },
          "dishes",
          (result) => {
            console.log("Updated Document:\n", result.result);

            dboper.findDocuments(db, "dishes", (docs) => {
              console.log("Found Updated Documents:\n", docs);

              // db.dropCollection("dishes", (result) => {
              //   console.log("Dropped Collection: ", result);

              //   client.close();
              // });
            });
          }
        );
      });
    }
  );
});
