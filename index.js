const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://dbUser1:tCUeeUsLd5zFGzmq@cluster0.hvky29s.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const usercollection = client.db("FoodExpress").collection("users");
        //post
        app.post('/user', (req, res) => {
            const user = req.body;
            console.log('create user success', user)
            const result = usercollection.insertOne(user)
            res.send(result)
        })

        //get

        app.get('/user', async (req, res) => {

            const query = {};
            const cursor = usercollection.find(query);
            const users = await cursor.toArray()
            res.send(users)
        })

        //get one 

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usercollection.findOne(query)
            res.send(result)
        })

        //update 

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                }
            }

            const result = await usercollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        //delete

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usercollection.deleteOne(query)
            res.send(result)
        })
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hey mama im  start code node with mongodb yahh')
});


app.listen(port, () => {
    console.log('node with mongodb', port)
})