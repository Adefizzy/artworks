import debug from 'debug';

class UserController {
  static createUser(Users) {
    return (req, res) => {
      const {
        name, username, password, phone, address, facebook, whatsapp,
      } = req.body;
      const isArtist = address !== '' && facebook !== '' && whatsapp !== '';
      const media = { facebook };
      media.whatsapp = `https://wa.me/${whatsapp}`;
      const user = new Users({
        name,
        username,
        password,
        phone,
        media,
        address,
        isArtist,
      });

      user.save((err, artuser) => {
        if (err) {
          Users.find({ username: req.body.username }, (error, existingUser) => {
            debug('app:findUser')(existingUser);
            if (error) {
              req.flash('message', 'server error, please try again');
              return res.redirect('/signup');
            }

            if (existingUser.length !== 0) {
              req.flash('message', 'Email already exist');
              return res.redirect('/signup');
            }
            req.flash('message', 'server error, please try again');
            return res.redirect('/signup');
          });
        } else if (artuser === undefined) {
          req.flash('message', 'email already exist');
          res.redirect('/signup');
        } else {
          req.login(artuser, () => {
            res.redirect('/auth/frontpage');
          });
        }
      });
    };
  }

//   static forgotPassword(Users, transporter) {
//     return (req, res) => {
//       Users.findOne({ username: req.body.username }, (err, user) => {
//         const mailOptions = {
//           from: process.env.MY_EMAIL,
//           to: user.username,
//           subject: 'Your Password',
//           text: user.password,
//         };
//         transporter.sendMail(mailOptions, (error, info) => {
//           if (error) {
//             debug('app:email')(error);
//           } else {
//             res.redirect('/signin');
//             debug('app:email')(info);
//           }
//         });
//       });
//     };
//   }
}

export default UserController;
