// NPM
import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

// Model
import * as Subscription from './models/subscription.model.js';

// Utils
import { validateEmail } from './util.js';

mongoose.connect(process.env.mongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// App Settings
let app = express();
let port = 3000;
let jsonParser = bodyParser.json();

// Set up our public folder
app.use(express.static('public'))

// A user wishes to subscribe
app.post('/subscribe/email', jsonParser, async function(req, res) {
    try {
        // Check if the email exists first of all
        let checkSubscription = await Subscription.Subscription.find({ 'email' : req.body.email });
        
        // If it doesn't..
        if(checkSubscription.length === 0) {
            // Then validate the email
            if(validateEmail(req.body.email)) {
                // And add it to the database
                const newSubscription = new Subscription.Subscription({
                    email: req.body.email,
                });
                newSubscription.save(function(err) {
                    if(err) {
                        res.status(400).send({ "message" : "Error saving your email.", "code" : "02" });
                    } else {
                        res.status(200).send({ "message" : "User has subscribed.", "code" : "03"  });
                    }
                })
            } else {
                // Otherwise show errors
                res.status(400).send({ "message" : "Error saving your email.", "code" : "02" });
            }
        } else {
            res.status(201).send({ "message" : "User Already Subscribed.", "code" : "02"  });
        }
    } catch(e) {
        // Or a real error if something really goes wrong
        console.log(e);
    }
});

app.get('/unsubscribe/:email', async (req, res) => {
    // Unsubscribe email
    if(typeof req.params.email !== "undefined") {
        // When we unsubscribe, check for an email
        let findEmail = await Subscription.Subscription.find({ "email" : req.params.email });

        if(findEmail.length > 0) {
            // If it exists, remove it
            await Subscription.Subscription.deleteOne({ "email" : req.params.email });
            res.send({ "message" : "Email deleted.", "code" : "00" });
        }
        else {
            // Otherwise the user wasn't even subscribed to begin with
            res.send({ "message" : "Email doesn't exist.", "code" : "01"})
        }
    }
});

app.listen(port);