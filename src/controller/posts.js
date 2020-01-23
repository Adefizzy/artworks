import debug from 'debug';
// import Queue from 'bull';
// import util from 'util';
// import redis from 'redis';

// redis.createClient();

// const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';


// const workQueue = new Queue('work', { redis: { port: 6379, host: '127.1.1.0' } });

class Posts {
  static uploadImages(files, cloudinary) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const refinedImage = [];
          let i = 0;
          while (i < files.length) {
            const tempImg = {};
            const postedImage = await cloudinary.uploader.upload(files[i].path);
            tempImg.public_id = postedImage.public_id;
            tempImg.version = postedImage.version;
            tempImg.width = postedImage.width;
            tempImg.heigth = postedImage.height;
            tempImg.created_at = postedImage.created_at;
            tempImg.format = postedImage.format;
            refinedImage.push(tempImg);
            i += 1;
          }
          resolve(refinedImage);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  static destroyImages(images, cloudinary) {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          let i = 0;
          while (i < images.length) {
            await cloudinary.uploader.destroy(images[i].public_id);
            i += 1;
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  static addPost(cloudinary, PostModel) {
    return async (req, res) => {
      try {
        req.body.post.author = req.user._id;
        const postedImages = await Posts.uploadImages(req.files, cloudinary);
        req.body.post.img = postedImages;

        const postedAd = new PostModel({
          title: req.body.post.title,
          description: req.body.post.description,
          authorId: req.body.post.author,
          images: req.body.post.img,
          price: req.body.post.price,
        });

        const data = await postedAd.save();
        res.redirect(`/auth/postpreview/${data._id}`);
      } catch (error) {
        req.flash('error', 'an error occurred, kindly retry');
        res.redirect('back');
      }
    };
  }

  static modifyPost(post, username) {
    debug('app:modifiedPosts')(post);
    const [data] = post;
    const refinedData = {};
    refinedData.title = data.title;
    refinedData.price = data.price;
    refinedData._id = data._id;
    refinedData.description = data.description;
    refinedData.authorId = data.authorId;

    // const author = await UserModel.findById(post.authorId);
    debug('app:modifyPost')('modifying..');
    const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_auto/v${data.images[0].version}/${data.images[0].public_id}.${data.images[0].format}`;
    // eslint-disable-next-line
    refinedData.author = username;
    // eslint-disable-next-line
    refinedData.image = img;
    return refinedData;
  }

  static async worker(UserModel) {
    debug('app:posts')(Posts.posts);
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          if (Posts.posts.length === 0) {
            return;
          }
          // eslint-disable-next-line
        let subPost = Posts.posts.splice(0, 1);
          const username = await UserModel.findById(subPost[0].authorId);
          debug('app:username')(subPost[0].authorId);
          Posts.returnedData.push(Posts.modifyPost(subPost, username.name));
          resolve();
          debug('app:resolved')('resolved');
          setImmediate(Posts.worker);
        } catch (error) {
          reject(error);
        }
      })();
    });
  }

  static useWorker(UserModel, PostModel) {
    return async (req, res, next) => {
      try {
        Posts.posts = await PostModel.find({});
        Posts.returnedData = [];
        await Posts.worker(UserModel);
        req.returnedData = Posts.returnedData;
        next();
      } catch (error) {
        debug('app:error')(error);
      }
    };
  }

  static populatePage(view) {
    return async (req, res) => {
      // try {
      //   const posts = await PostModel.find({});
      //   debug('app:homepage')(posts);
      //   let counter = 0;
      //   while (counter < posts.length) {
      //     const author = await UserModel.findById(posts[counter].authorId);
      //     const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_auto/v${posts[counter].images[0].version}/${posts[counter].images[0].public_id}.${posts[counter].images[0].format}`;
      //     posts[counter].author = author.name;
      //     posts[counter].image = img;
      //     counter += 1;
      //   }
      //   debug('app:homepage')(posts);

      //   res.render(view, {
      //     posts,
      //     username: req.username || '',
      //     // eslint-disable-next-line
      //     isArtist: req.user? req.user.isArtist : '',
      //   });
      // } catch (error) {
      //   debug('app:frontpage')(error);
      // }


      res.render(view, {
        posts: req.returnedData,
        username: req.username || '',
        // eslint-disable-next-line
        isArtist: req.user? req.user.isArtist : '',
      });
    };
  }


  static getSinglePost(UserModel, PostModel, view) {
    return async (req, res) => {
      try {
        const { id } = req.params;
        const post = await PostModel.findById(id);
        const artist = await UserModel.findById(post.authorId);
        const img = post.images.map((image) => `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_0.2,c_limit,q_auto/v${image.version}/${image.public_id}.${image.format}`);
        post.images = img;
        const artistInfo = {};
        artistInfo.name = artist.name;
        artistInfo.facebook = artist.facebook;
        artistInfo.whatsapp = artist.whatsapp;
        artistInfo.phone = artist.phone;
        post.artist = artistInfo;
        debug('app:post')(post);
        res.render(view, {
          post,
          username: req.username,
          isArtist: req.user.isArtist,
        });
      } catch (error) {
        debug('app:error')(error);
      }
    };
  }

  static editPost(cloudinary, PostModel) {
    return async (req, res) => {
      try {
        const oldPost = await PostModel.findById(req.params.id);
        if (req.files.length > 0) {
          const { images } = oldPost;
          await Posts.destroyImages(images, cloudinary);
          const postedImages = await Posts.uploadImages(req.files, cloudinary);
          req.body.images = postedImages;
        }

        debug('app:putpost')(req.body);

        await PostModel.findByIdAndUpdate(req.params.id, req.body);
        res.redirect(`/auth/postpreview/${req.params.id}`);
      } catch (error) {
        req.flash('error', 'an error occurred, kindly retry');
        res.redirect('back');
      }
    };
  }

  static getEditPost(PostModel) {
    return (req, res) => {
      PostModel.findById(req.params.id, (err, post) => {
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
    };
  }

  static getPostForm() {
    return (req, res) => {
      res.render('postArt', {
        error: req.flash('error')[0],
      });
    };
  }

  static getPosts(UserModel, PostModel) {
    return async (req, res) => {
      try {
        const posts = await PostModel.find({ authorId: req.user._id });
        let counter = 0;
        while (counter < posts.length) {
          const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_auto/v${posts[counter].images[0].version}/${posts[counter].images[0].public_id}.${posts[counter].images[0].format}`;
          posts[counter].image = img;
          counter += 1;
        }
        debug('app:posts')(posts);
        res.render('posts', {
          posts,
          username: req.username,
          artist: req.user.name,
          success: req.flash('success')[0],
          error: req.flash('error')[0],
        });
      } catch (error) {
        req.flash('error', 'error occured');
      }
    };
  }

  static deletePosts(PostModel, cloudinary) {
    return async (req, res) => {
      try {
        const { id } = req.params;
        const post = await PostModel.findById(id);
        const { images } = post;
        await Posts.destroyImages(images, cloudinary);
        await PostModel.findByIdAndDelete(id);
        req.flash('success', 'post has been deleted');
        res.redirect('/auth/posts');
      } catch (error) {
        req.flash('error', 'Please try again');
        res.redirect('/auth/posts');
      }
    };
  }
}

export default Posts;
