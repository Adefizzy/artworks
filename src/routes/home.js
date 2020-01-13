import express from 'express';
// import debug from 'debug';
import UserController from '../controller/user';
import PostController from '../controller/posts';
// import transporter from '../config/emailTransporter';

const Router = express.Router();

function home(passport, Users, PostModel) {
  Router.route('/').get(PostController.populatePage(Users, PostModel, 'index'));

  Router.route('/signin').get((req, res) => {
    res.render('login', {
      message: req.flash('error')[0],
    });
  })
    .post(passport.authenticate('local', {
      failureRedirect: '/signin',
      successRedirect: '/auth/frontpage',
      failureFlash: true,
    }));

  // Router.route('/forgotpassword')
  //   .get((req, res) => {
  //     res.render('forgotPassword');
  //   })
  //   .post(UserController.forgotPassword(Users, transporter));

  Router.route('/signup')
    .get((req, res) => {
      res.render('register', {
        message: req.flash('message')[0],
      });
    })
    .post(UserController.createUser(Users));

  Router.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });

  return Router;
}

export default home;
