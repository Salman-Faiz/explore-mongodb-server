const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// require express Js
const express = require('express');
const app = express();
// adding middleware to prevent undefine and others errors
const cors = require('cors');
// port must be declared 
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
// express.json used for convert data to json ,when data post to server
app.use(express.json());




const uri = "mongodb+srv://salmanfaizcse:TnPUtEWK3WubOtJ7@cluster0.pc8mx8l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

        // send data to db
        const database = client.db("usersDB");
        const userCollection = database.collection("userCollection");


        // get data ********************
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        // to get specific data by id for update

        app.get(`/users/:id`,async(req,res) =>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const user = await userCollection.findOne(query);
            res.send(user);
        })


        // to post data ***********************
        app.post('/users', async (req, res) => {

            const user = req.body;
            console.log('new User', user);
            // insert one data to usersDB
            const result = await userCollection.insertOne(user);
            res.send(result);

        })

        // put or patch for updating data

        app.put('/users/:id',async(req,res)=>{
            const id = req.params.id;
            const userUpdate = req.body;
            console.log(id,userUpdate);
            // add value to database
            const filter = { _id : new ObjectId(id)};
            const options = {upsert :true}
            const updatedUser = {
                $set : {
                    name :userUpdate.name,
                    email: userUpdate.email
                }
            }
            const result = await userCollection.updateOne(filter,updatedUser,options)
            res.send(result)

            

          
        })

        // Delete data ************************

        app.delete('/users/:id',async(req,res)=>{
            const id = req.params.id;
            console.log('please delete data from database',id);
            const query = {_id : new ObjectId(id)};
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// get method to get data

app.get('/', (req, res) => {
    res.send('SIMPLE CRUD IS RUNNING')
})

// to run this server
app.listen(port, () => {
    console.log(`SIMPLE CRUD IS RUNNING ON PORT, ${port}`)
})