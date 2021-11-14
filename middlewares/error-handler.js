import {DEBUG_MODE} from '../config/constants';
import {ValidationError} from 'joi';
import CustomErrorHandler from '../errors/CustomErrorHandler';

const errorHandler = (error, req, res, next) => { // error catch data coming from next(error)
    let statusCode = 500;
    let data = {
        message: 'internal server error',
        ...(DEBUG_MODE === 'true' && {originalError: error.message}) // if DEBUF_MODE true throw proper error else custom error
    };

    if (error instanceof ValidationError) { // error from validation
        statusCode = 422;
        data = {
            message: error.message
        }
    }

    if (error instanceof CustomErrorHandler) { // error from CustomErrorHandler
        statusCode = error.statusCode; // statusCode from CustomErrorHandler class
        data = {
            message: error.message // message from CustomErrorHandler class
        }
    }

    return res.status(statusCode).json({message: data});
}

export default errorHandler;