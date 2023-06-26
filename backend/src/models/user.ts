import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User=new Schema({
    username: { type: String },
    password: { type: String},
    email: { type: String},
    phone: { type: String},
    role: { type: String},
    
    client: {
        firstname: { type: String },
        lastname: { type: String }
    },
    agency: {
        name: { type: String },
        address: { type: String },
        PIB: { type: String },
        description: { type: String }
    },
    profilePicture: { type: String },
})

export default mongoose.model('User', User, 'users');