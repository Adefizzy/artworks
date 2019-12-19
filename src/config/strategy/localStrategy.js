import debug from 'debug';

function localStrategy(users, passport, Strategy) {
  debug('app:strategy')('start');
  passport.use(new Strategy((username, password, done) => {
    users.findOne({ username }, (err, user) => {
      debug('app:strategy')('database');
      if (err) {
        debug('app:strategy')('error');
        done(err);
      } else if (!user) {
        debug('app:strategy')('user not found');
        done(null, false, { message: 'invalid username' });
      } else if (password !== user.password) {
        debug('app:strategy')('password not correct');
        done(null, false, { message: 'invalid password' });
      } else {
        debug('app:strategy')('logged in');
        done(null, user);
      }
    });
  }));
}

export default localStrategy;
