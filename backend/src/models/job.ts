import mongoose from "mongoose";
import { ClientObjectSchema } from "./user";

const Schema = mongoose.Schema;

let JobSchema = new Schema({
    _id: Schema.Types.ObjectId,
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agency: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    object: { type: ClientObjectSchema, required: true },
    numWorkers: { type: Number, default: 0 },
    deadline: {type: Date,required: true},
    status: { type: String, default: "aktivan" },
    price: { type: Number, required: true }
});

export default mongoose.model('Job', JobSchema, 'jobs');