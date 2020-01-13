import mongoose from 'mongoose';

// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);

const { Schema } = mongoose;

const posts = new Schema({
  title: { type: String },
  description: { type: String },
  authorId: { type: String },
  images: { type: Array },
  price: { type: String },
});

export default mongoose.model('posts', posts);
