import mongoose from "mongoose";

const Schema = mongoose.Schema;

let User=new Schema({
    username: { type: String },
    password: { type: String},
    email: { type: String},
    phone: { type: String},
    role: { type: String},
    
    client: {type:{
        firstname: { type: String },
        lastname: { type: String }
    }, default:null},
    agency: {type:{
        name: { type: String },
        address: { type:{
            country:String,
            city:String,
            street:String,
            number:String
        }},
        PIB: { type: String },
        description: { type: String }
    }, default:null},
    profilePicture: { type: String },
})

export default mongoose.model('User', User, 'users');