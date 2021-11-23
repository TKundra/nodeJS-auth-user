import express from 'express';
import {PORT} from './config/constants';
import route from './routes/route';
import errorHandler from './middlewares/error-handler';
import connectDB from './db/database-connection';
const app = express();

connectDB(); // db connections

app.use(express.json()); // middleware to accept JSON data from client side
app.use('/v1/api', route); // routing

app.use(errorHandler); // to use express error handling using next(err)

app.listen(PORT, () => { // creating server
    console.log(`app listening on port ${PORT}!`)
});