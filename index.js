const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f8emp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// server and mongodb connection

async function run() {
    try {
        await client.connect();
        const database = client.db("Tour-and-Travel");
        const destinationCollection = database.collection("spot");
        const placeBookingCollection = database.collection("placeOrder");

        // get api for all data

        app.get("/allBooking", async (req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        });

        //get api for a single data

        app.get("/allBooking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleBookingInfo = await destinationCollection.findOne(
                query
            );
            res.send(singleBookingInfo);
        });

        // Post api

        app.post("/allBooking", async (req, res) => {
            const booking = req.body;
            const result = await destinationCollection.insertOne(booking);
            res.json(result);
        });

        // get api
        app.get("/manageAllOrder", async (req, res) => {
            const manageOrder = await placeBookingCollection.find({}).toArray();
            res.send(manageOrder);
        });

        // get api for place booking

        app.get("/myBooking/:email", async (req, res) => {
            const email = req.params.email;
            const myBooking = await placeBookingCollection
                .find({ email })
                .toArray();
    
            res.send(myBooking);
        });

        // delete api for my booking

        app.delete("/myBooking/:id", async (req, res) => {
            const bookingId = req.params.id;
            const query = { _id: ObjectId(bookingId) };
            const deleteBooking = await placeBookingCollection.deleteOne(query);
            // console.log(deleteBooking);
            res.json(deleteBooking);
        });

        // update api for status

        app.put("/myBooking/:id", async (req, res) => {
            const updateId = req.params.id;
            const updatedStatus = req.body;
            // console.log(updatedStatus);

            const filter = { _id: ObjectId(updateId) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                },
            };


            const approveOrders = await placeBookingCollection.updateOne(
                filter,
                updateDoc,
                options
            );
        

            res.json(approveOrders);
        });

        // post api for booking order collection
        app.post("/placeBooking", async (req, res) => {
            const placeBooking = req.body;
            const result = await placeBookingCollection.insertOne(placeBooking);
            
            res.json(result);
        });


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


// important code

app.get("/", (req, res) => {
    res.send("Hello World from my local server !!");
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
