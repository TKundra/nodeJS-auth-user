class CustomErrorHandler extends Error{
    constructor(statusCode, message) {
        super(); // parent class - Error
        this.statusCode = statusCode;
        this.message = message;
    }
    static exists(msg) {
        return new CustomErrorHandler(409, msg); // return object and use to get error in middleware accordingly
    }
    static wrongCredentials(msg = 'wrong username or password') {
        return new CustomErrorHandler(401, msg); // return object and use to get error in middleware accordingly
    }
    static unAuthorized(msg = 'un-authorized') {
        return new CustomErrorHandler(401, msg); // return object and use to get error in middleware accordingly
    }
    static notFound(msg = '404 not found') {
        return new CustomErrorHandler(404, msg); // return object and use to get error in middleware accordingly
    }
}

export default CustomErrorHandler;