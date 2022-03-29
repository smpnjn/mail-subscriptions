import dotenv from 'dotenv'
dotenv.config();

import mongoose from 'mongoose'

mongoose.createConnection(process.env.mongooseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const schema = new mongoose.Schema({ 
    email: 'string'
});

const Subscription = mongoose.model('Subscription', schema);

export { Subscription };