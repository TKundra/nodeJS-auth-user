import express from 'express';
import {PORT} from './config/constants';
import route from './routes/route';
import errorHandler from './middlewares/error-handler';
import connectDB from './db/database-connection';
const app = express();

connectDB();
app.use(express.json());
app.use('/v1/api', route);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
});