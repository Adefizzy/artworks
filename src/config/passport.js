import debug from 'debug';
import localStrategy from './strategy/localStrategy';


function authenticateUsers(app, userModel, passport, Strategy) {
  app.use(passport.initialize());
  app.use(passport.session());
  localStrategy(userModel, passport, Strategy);

  passport.serializeUser((user, done) => {
    debug('app:passport')('serialize');
    // eslint-disable-next-line
    done(null, user._id)
  });

  passport.deserializeUser((userId, done) => {
    debug('app:passport')('deserialize');
    userModel.findById(userId, (err, user) => {
      debug('app:passport')('database');
      if (err) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  });
}

export default authenticateUsers;
