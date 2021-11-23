import Joi from 'joi';
import CustomErrorHandler from '../errors/CustomErrorHandler';
import User from '../models/user-model';
import RefreshToken from '../models/refresh-token-model';
import bcrypt from 'bcrypt';
import TokenService from '../services/TokenService';
import {REFRESH_KEY} from '../config/constants';

const controller = {

// ---------------------------------------------------------------------------------------------------------------------------------------------------
    async register(req,res,next){ // register user
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirm_password: Joi.ref('password'),
        });
        const {error} = registerSchema.validate(req.body);
        if (error) { // if error while validating
            return next(error); // will catch by error middleware, bcz that middleware doesn't accept async function error
        }
        try { // verify email
            const exists = await User.exists({email: req.body.email});
            if (exists) { // if email already exists
                return next(CustomErrorHandler.exists('email already exists'));
            }
        } catch (err) {
            return next(err);
        }
        // else
        const {name, email, password} = req.body; // de-structring from req.body
        // generate hash password - one way hash
        const hashedPassword = await bcrypt.hash(password, 10);
        // model
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
        }); 
        // save to db and generate access and refresh token
        let access_token, refresh_token;
        try {
            const result = await user.save(); // save to db
            // generate token
            const payload = {_id: result.id, role: result.role};
            access_token = TokenService.sign(payload);
            refresh_token = TokenService.sign(payload, '1y', REFRESH_KEY);
            await RefreshToken.create({token: refresh_token}); // add token to db
        } catch (err) {
            return next(err);
        }
        res.json({access_token: access_token, refresh_token: refresh_token})
    },

// ---------------------------------------------------------------------------------------------------------------------------------------------------
    async login(req, res, next){ // log in
        const loginSchema = Joi.object({ // validate email & password
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });
        const {error} = loginSchema.validate(req.body);
        // if error during validation
        if (error) {
            return next(error);
        }
        // if email
        try {
            const user = await User.findOne({email: req.body.email});
            if (!user){ // user not found
                return next(CustomErrorHandler.wrongCredentials('user not found'));
            }
            // comparing bcz bcrypt is one way hashin
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            // if user found generate token
            let access_token, refresh_token;
            try {
                // token
                const payload = {_id: user.id, role: user.role};
                access_token = TokenService.sign(payload);
                refresh_token = TokenService.sign(payload, '1y', REFRESH_KEY);
                await RefreshToken.create({token: refresh_token});
            } catch (err) {
                return next(err);
            }
            res.json({access_token: access_token, refresh_token: refresh_token});
        } catch (err) {
            return next(err);
        }
    },

// ---------------------------------------------------------------------------------------------------------------------------------------------------
    async refresh(req, res, next) { // refresh - generate access token if user provides valid refresh token
        const refreshTokenSchema = Joi.object({
            refresh_token: Joi.string().required()
        });
        const {error} = refreshTokenSchema.validate(req.body);
        if (error) {
            return next(error);
        }        
        // check in db
        let refreshToken;
        try {
            refreshToken = await RefreshToken.findOne({token: req.body.refresh_token}).select('-__v');
            if (!refreshToken) {
                return next(CustomErrorHandler.unAuthorized('invalid refresh token'));
            }
            // verify token
            let userId;
            try {
                const {_id} = TokenService.verify(refreshToken.token, REFRESH_KEY);
                console.log("id", _id)
                userId = _id; // destructing _id from payloads and save in userId
            } catch (err) {
                return next(err);
            }            
            // get user on the base of user id extracted from refresh token
            const user = await User.findOne({_id: userId});
            if (!user){
                return next(CustomErrorHandler.unAuthorized('user not found'));
            }
            // generate new tokens
            let access_token, refresh_token;
            try {
                // token
                const payload = {_id: user.id, role: user.role};
                access_token = TokenService.sign(payload);
                refresh_token = TokenService.sign(payload, '1y', REFRESH_KEY);
                await RefreshToken.create({token: refresh_token});            
            } catch (err) {
                return next(err);
            }
            res.json({access_token: access_token, refresh_token: refresh_token});
        } catch (err) {
            return next(err);
        }
    },

// ---------------------------------------------------------------------------------------------------------------------------------------------------
    async logout(req, res, next){ // log out
        const refreshTokenSchema = Joi.object({
            refresh_token: Joi.string().required()
        });
        const {error} = refreshTokenSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        // delete refresh token from db
        try {
            await RefreshToken.deleteOne({token: req.body.refresh_token});
        } catch (err) {
            return next(err);
        }
        res.json({message: "log out successfully"});
    }

}

export default controller;