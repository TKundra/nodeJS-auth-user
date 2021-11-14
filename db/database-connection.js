import mongoose from 'mongoose';
import {MONGO_URL as url} from '../config/constants';

// db connections
function connectDB(){
    mongoose.connect(url);
    const connection = mongoose.connection;
    connection.once('open', () => { // if successfuly
        console.log('database connected');
    });
    connection.on("error", ()=>{
        console.log("error");
    })
}

export default connectDB;