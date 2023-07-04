import mongoose from "mongoose";

const Schema = mongoose.Schema;

let CollaborationRequestSchema = new Schema({
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    object: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User.client.objects',
        required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: null
    }
  });

export default mongoose.model('CollaborationRequest', CollaborationRequestSchema, 'collaborationRequests');