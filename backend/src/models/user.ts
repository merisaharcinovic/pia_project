import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoomSketchSchema = new Schema({
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
});


const ClientObjectSchema = new Schema({
  _id: Schema.Types.ObjectId,
  objectType: { type: String },
  address: { type: String },
  numRooms: { type: Number },
  area: { type: Number },
  sketch: { type: [RoomSketchSchema] },
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
    },
    default: null,
  },
  profilePicture: { type: String },
});

export default mongoose.model("User", UserSchema, "users");
