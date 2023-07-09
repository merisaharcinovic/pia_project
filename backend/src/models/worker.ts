import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WorkerSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    available: { type: Boolean, default: true },
    agency: { type: Schema.Types.ObjectId, ref: 'User' },
  });

export default mongoose.model('Worker', WorkerSchema, 'workers');