import mongoose from 'mongoose';

// using unique takes unique data
const UserModel = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: "guest"}
}, {timestamps: true});

export default mongoose.model('User', UserModel, 'users'); // 3rd paramter is of collection-name (optional)