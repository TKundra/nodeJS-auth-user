import CustomErrorHandler from "../../errors/CustomErrorHandler";
import TokenService from "../../services/TokenService";

// middleware - to authenticate user - is valid or not.
const auth = (req, res, next) => {
    let authHeader = req.headers.authorization; // header - Authorization : Bearer access_token
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }
    const token = authHeader.split(' ')[1]; // split space and return array
    try {
        const {_id, role} = TokenService.verify(token); // from token extracts payloads and verify token
        const user = { // store data
            _id: _id,
            role: role
        };
        req.user = user; // adding property to req
        next(); // call next -> when work done.. when work done call next work
    } catch (err) {
        return next(err);
    }
}

export default auth;