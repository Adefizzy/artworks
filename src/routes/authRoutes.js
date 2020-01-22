import express from 'express';
import cloudinary from '../config/cloudinary';
import upload from '../config/multer';
import Posts from '../controller/posts';
import Message from '../controller/message';
import isLoggedIn from '../middleware/isLoggedIn';
import Authorization from '../middleware/authorization';

const Router = express.Router();

function authRoutes(UserModel, PostModel, MessageModel) {
  Router.use(isLoggedIn.loggedIn());
  Router.route('/frontpage').get(Posts.populatePage(UserModel, PostModel, 'frontPage'));
  Router.route('/artpreview/:id').get(Posts.getSinglePost(UserModel, PostModel, 'artPreview'));
  Router.route('/request/:id').get(Message.artRequest(PostModel, MessageModel));
  // Router.route('/job').get(Posts.backgroundJob(PostModel));
  Router.use(Authorization.isArtist());
  Router.route('/postpreview/:id').get(Posts.getSinglePost(UserModel, PostModel, 'postPreview'));
  Router.route('/editpost/:id')
    .get(Posts.getEditPost(PostModel))
    .put(upload.array('images', 3), Posts.editPost(cloudinary, PostModel));
  Router.route('/postad')
    .get(Posts.getPostForm())
    .post(upload.array('images', 3), Posts.addPost(cloudinary, PostModel));
  Router.route('/posts')
    .get(Posts.getPosts(UserModel, PostModel));
  Router.route('/deletepost/:id').delete(Posts.deletePosts(PostModel, cloudinary));

  return Router;
}

export default authRoutes;
