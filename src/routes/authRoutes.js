import express from 'express';
import debug from 'debug';
import cloudinary from '../config/cloudinary';
import upload from '../config/multer';
import Posts from '../controller/posts';
import isLoggedIn from '../middleware/isLoggedIn';

const Router = express.Router();

function authRoutes(UserModel, PostModel) {
  Router.use(isLoggedIn.loggedIn());
  Router.route('/frontpage').get(Posts.populatePage(UserModel, PostModel, 'frontPage'));
  Router.route('/artpreview/:id').get(Posts.getSinglePost(UserModel, PostModel, 'artPreview'));
  Router.route('/postpreview/:id').get(Posts.getSinglePost(UserModel, PostModel, 'postPreview'));

  Router.route('/editpost/:id')
    .get((req, res) => {
      PostModel.findById(req.params.id, (err, post) => {
        debug('app:edit')(post.title);
        if (err) {
          req.flash('error', 'Error, please reload');
          res.redirect('back');
        }
        res.render('editPost', {
          username: req.username,
          post,
          error: req.flash('error')[0],
        });
      });
    })
    .put(upload.array('images', 3), Posts.editPost(cloudinary, PostModel));

  Router.route('/postad')
    .get((req, res) => {
      res.render('postArt', {
        error: req.flash('error')[0],
      });
    })
    .post(upload.array('images', 3), Posts.addPost(cloudinary, PostModel));

  return Router;
}

export default authRoutes;
