import mongoose from 'mongoose';

function database() {
  mongoose.connect('mongodb://localhost/artworks', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default database;
