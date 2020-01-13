import express from 'express';
import debug from 'debug';
import chalk from 'chalk';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import methodOverride from 'method-override';
import { Strategy } from 'passport-local';
import flash from 'connect-flash';


import home from './routes/home';
import authRoutes from './routes/authRoutes';

import users from './model/users';
import postModel from './model/posts';
import messageModel from './model/message';

import database from './config/database';
import authenticateUser from './config/passport';

database();

dotenv.config();

const app = express();


const { PORT } = process.env.PORT || 6868;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({ secret: 'artworks', resave: false, saveUninitialized: false }));
app.use(methodOverride('_method'));
app.use(flash());

authenticateUser(app, users, passport, Strategy);

app.use(express.static('public'));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/', home(passport, users, postModel));
app.use('/auth/', authRoutes(users, postModel, messageModel));

app.listen(PORT, debug('app:')(chalk.red(`Server running on port ${PORT}`)));
