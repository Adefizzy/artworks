import debug from 'debug';


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

  static populatePage(UserModel, PostModel, view) {
    return async (req, res) => {
      try {
        const posts = await PostModel.find({});
        let counter = 0;
        while (counter < posts.length) {
          const author = await UserModel.findById(posts[counter].authorId);
          const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_auto/v${posts[counter].images[0].version || ''}/${posts[counter].images[0].public_id || ''}.${posts[counter].images[0].format || ''}`;
          posts[counter].author = author.name;
          posts[counter].image = img;
          counter += 1;
        }

        debug('app:homepage')(posts);
        res.render(view, {
          posts,
          username: req.username || '',
        });
      } catch (error) {
        debug('app:frontpage')(error);
      }
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
        res.render(view, {
          post,
          username: req.username,
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
        // Object.entries(req.body).forEach((data) => {
        //   const [key, value] = data;
        //   oldPost[key] = value;
        // });
        // const newPost = await oldPost.save();
        res.redirect(`/auth/postpreview/${req.params.id}`);
      } catch (error) {
        req.flash('error', 'an error occurred, kindly retry');
        res.redirect('back');
      }
    };
  }
}

export default Posts;
