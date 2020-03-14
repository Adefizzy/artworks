import debug from 'debug';


class Posts {
  static uploadImages(files, cloudinary) {
          const refinedImage = files.map(async file => {
            const tempImg = {};
            const postedImage = await cloudinary.uploader.upload(file.path);
            tempImg.public_id = postedImage.public_id;
            tempImg.version = postedImage.version;
            tempImg.width = postedImage.width;
            tempImg.heigth = postedImage.height;
            tempImg.created_at = postedImage.created_at;
            tempImg.format = postedImage.format;
            return tempImg;
          }) 
          
        return refinedImage;
  }

  static destroyImages(images, cloudinary) {
     return images.map( async image =>{
      await cloudinary.uploader.destroy(image.public_id);
     });
  }

  static addPost(cloudinary, PostModel) {
    return async (req, res) => {
      try {
        req.body.post.author = req.user._id;
        const postedImages = await Promise.all(Posts.uploadImages(req.files, cloudinary));
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
    const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_29/v${data.images[0].version}/${data.images[0].public_id}.${data.images[0].format}`;
    // eslint-disable-next-line
    refinedData.author = username;
    // eslint-disable-next-line
    refinedData.image = img;
    return refinedData;
  }

  static useMap(rawPosts, cb, UserModel = null){
    const updatedPost = rawPosts.map(async post => {
    let author;
    if(UserModel !== null){
      author = await UserModel.findById(post.authorId);
      post.author = author.name;
    }
      const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_29/v${post.images[0].version}/${post.images[0].public_id}.${post.images[0].format}`;
      post.image = img;
      return post;
    })
    cb(updatedPost);
  }

  static populatePage(PostModel, UserModel, view) {
    return async (req, res) => {
      try {
        const rawPosts = await PostModel.find({});

        Posts.useMap(rawPosts, async (data) => {
          const posts = await Promise.all(data);
          res.render(view, {
            posts,
            username: req.username || '',
            // eslint-disable-next-line
            isArtist: req.user? req.user.isArtist : '',
          });
        },UserModel);
        
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
        const img = post.images.map((image) => `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_0.2,c_limit,q_29/v${image.version}/${image.public_id}.${image.format}`);
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
          await Promise.all(Posts.destroyImages(images, cloudinary));
          const postedImages = await Promise.all(Posts.uploadImages(req.files, cloudinary));
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
        const rawPosts = await PostModel.find({ authorId: req.user._id });
        Posts.useMap(rawPosts, async(data) => {
          const posts = await Promise.all(data);
          res.render('posts', {
            posts,
            username: req.username,
            artist: req.user.name,
            success: req.flash('success')[0],
            error: req.flash('error')[0],
          });
        })
        
        
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
        await Promise.all(Posts.destroyImages(images, cloudinary));
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
