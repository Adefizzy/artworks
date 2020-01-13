import mongoose from 'mongoose';

const { Schema } = mongoose;

const messages = new Schema({
  artistId: { type: Schema.ObjectId },
  purchaseRequests: { type: Array },
});

export default mongoose.model('messages', messages);
