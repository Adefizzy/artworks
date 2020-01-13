import dotenv from 'dotenv';
import mongoose from 'mongoose';
import debug from 'debug';

dotenv.config();
const { ATLAS_PASSWORD } = process.env;
const uri = `mongodb+srv://adefizzy:${ATLAS_PASSWORD}@cluster0-lkuon.mongodb.net/artworks?retryWrites=true&w=majority`;

async function database() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (error) {
    debug('app:database')(error);
  }
}

export default database;
