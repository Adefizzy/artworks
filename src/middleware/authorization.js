import debug from 'debug';

class Authorization {
  static isArtist() {
    return (req, res, next) => {
      debug('app:isArtist')(req.user.isArtist);
      if (req.user.isArtist) next();
      else res.redirect('back');
    };
  }
}

export default Authorization;
