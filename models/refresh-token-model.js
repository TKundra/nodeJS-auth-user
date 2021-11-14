import mongoose from 'mongoose';

const RefreshTokenModel = new mongoose.Schema({
    token: {type: String, unique: true}
}, {timestamps: false});

export default mongoose.model('RefreshToken', RefreshTokenModel, 'refreshTokens');