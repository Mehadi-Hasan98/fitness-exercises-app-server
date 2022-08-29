const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0pfunz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const itemCollection = client.db('ironFit').collection('item');

        // GET API
        app.get('/item', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        app.get('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item);
        });


        app.get('/myitems', async(req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = itemCollection.find(query);
            const myitem = await cursor.toArray();
            res.send(myitem);
        })

        // POST
        app.post('/item', async(req, res) => {
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });


         // DELETE
    app.delete('/item/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await itemCollection.deleteOne(query);
        res.send(result);
    });


    // update stock  quantity
   app.put("/item/:id", async (req, res) => {
    const id = req.params.id;
    const newQuantity = req.body;

    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
      $set: {
        quantity: newQuantity.quantity,
      },
    };
    const result = await itemCollection.updateOne(
      filter,
      updatedDoc,
      options
    );
    res.send(result);
  });


    } finally{

    }
    
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Running IronFit Server")
});


app.listen(port, () => {
    console.log("Hello, I'm Listening to port", port)
});
