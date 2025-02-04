const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId  } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vhllknp.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const productCollection = client.db('carDoctor').collection('services');
      const peopleCollection = client.db('carDoctor').collection('people');

      app.get('/services', async (req, res) => {
        const cursor = productCollection.find();
        const products = await cursor.toArray();
        res.send(products);
    })
    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: id }
        console.log(query)
        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: { title: 1, price: 1, service_id: 1, img: 1 },
        };

        const result = await productCollection.findOne(query);
        console.log(result)
        res.send(result);
    })
    app.get('/manpower', async (req, res) => {
      const manpower = peopleCollection.find();
      const products = await manpower.toArray();
      res.send(products);
  })
    app.post('/people', async (req, res) => {
      const people = req.body;
      console.log(people);
      const result = await peopleCollection.insertOne(people);
      res.send(result);
  });
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
     //   await client.close();
    }
  }
  run().catch(console.dir);



app.get('/', async (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log("listening to server")
})