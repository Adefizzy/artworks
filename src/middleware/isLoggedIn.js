class isLoggedIn {
  static loggedIn() {
    return (req, res, next) => {
      if (req.user) {
        const [firstname] = req.user.name.split(' ');
        req.username = firstname;
        next();
      } else {
        res.redirect('/');
      }
    };
  }
}
export default isLoggedIn;
