import dotenv from 'dotenv'
dotenv.config();

import mail from 'nodemailer'
import schedule from 'node-schedule'
import { promises as fs } from 'fs'
import mongoose from 'mongoose'
import { replaceHTML } from '../util.js'

import * as Subscription from '../models/subscription.model.js';

mongoose.connect(process.env.mongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const mailer = async function(title, obj, emailAddress) {	
    try {
        var email = await fs.readFile('./templates/mail.html', { encoding:'utf-8' } );
        var text = replaceHTML(email, obj);
        let transporter = mail.createTransport({
            host: process.env.contactHost,
            port: 465,
            debug: true,
            secure: true,
            auth:{
                user: process.env.contactEmail,
                pass: process.env.contactPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        transporter.sendMail({
            from   : `${process.env.contactEmail} <${process.env.contactEmail}>`,
            to     : emailAddress,
            subject: title,
            pool   : true,
            maxMessages: Infinity,
            replyTo: process.env.contactEmail,
            headers: { 'Mime-Version' : '1.0', 'X-Priority' : '3', 'Content-type' : 'text/html; charset=iso-8859-1' },
            html   : text
        }, (err, info) => {
            if(err !== null) {
                console.log(err);
            }
            else {
                console.log(`Email sent to ${emailAddress} at ${new Date().toISOString()}`);
            }
        });
    } catch(e) {
        console.log(e);
    }
}

// This will run on a CronJob
const generateEmail = async function() {        
    try {
        let allSubs = await Subscription.Subscription.find();
        allSubs.forEach(function(item) {
            if(typeof item.email !== "undefined") {
                mailer(`This is our Subscription Email`, {
                    'content' : "Hello, welcome to our email 👋"
                }, item.email);
            }
        })
    } catch(e) {
        console.log(e);
    }
}

schedule.scheduleJob("00 30 10 * * 1", async function() {
    try {
        generateEmail();
    } catch(e) {
        console.log(e);
    }
});