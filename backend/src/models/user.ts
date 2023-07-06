import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const RoomSketchSchema = new Schema({
  x: { type: Number },
  y: { type: Number },
  width: { type: Number },
  height: { type: Number },
  door: {
    type: {
      x: { type: Number },
      y: { type: Number },
    },
  },
  status: { type: String, default: "nedovrseno" }
});


export const ClientObjectSchema = new Schema({
  _id: Schema.Types.ObjectId,
  objectType: { type: String },
  address: { type: String },
  numRooms: { type: Number },
  area: { type: Number },
  sketch: { type: [RoomSketchSchema] },
});

export const WorkerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
});

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  email: { type: String },
  phone: { type: String },
  role: { type: String },
  client: {
    type: {
      firstname: { type: String },
      lastname: { type: String },
      objects: [ClientObjectSchema],
    },
    default: null,
  },
  agency: {
    type: {
      name: { type: String },
      address: {
        type: {
          country: String,
          city: String,
          street: String,
          number: String,
        },
      },
      PIB: { type: String },
      description: { type: String },
      workers: [WorkerSchema]
    },
    default: null,
  },
  profilePicture: { type: String },
});

export default mongoose.model("User", UserSchema, "users");