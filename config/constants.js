require('dotenv').config();

// coming from .env and send sending globally
const {
    PORT,
    DEBUG_MODE,
    MONGO_URL,
    SECRET_KEY,
    REFRESH_KEY
} = process.env;

export {PORT, DEBUG_MODE, MONGO_URL, SECRET_KEY, REFRESH_KEY};