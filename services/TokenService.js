import {SECRET_KEY} from '../config/constants';
import jwt from 'jsonwebtoken';

class TokenService { // after 60s token expires by-default
    static sign(payload, expiry = '60s', secret = SECRET_KEY){ // sign - generates token
        return jwt.sign(payload, secret, {expiresIn: expiry});
    }
    static verify(token, secret = SECRET_KEY){ // verify - validate token
        return jwt.verify(token, secret);
    }
}

export default TokenService;