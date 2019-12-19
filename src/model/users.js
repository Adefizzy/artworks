import mongoose from 'mongoose';

mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const users = new Schema({
  name: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  phone: { type: String },
  address: { type: String },
  media: { type: Object },
  isArtist: { type: Boolean },
});

export default mongoose.model('users', users);
