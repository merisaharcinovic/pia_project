import mongoose from "mongoose";
import { ClientObjectSchema } from "./user";

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  });

let JobSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    agency: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    object: { type: ClientObjectSchema, required: true },
    numWorkers: { type: Number, default: 0 },
    deadline: {type: Date,required: true},
    status: { type: String, default: "aktivan" },
    price: { type: Number, required: true },
    review: { type: ReviewSchema },
});

export default mongoose.model('Job', JobSchema, 'jobs');