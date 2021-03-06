const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', {
    csrfToken: req.csrfToken(),
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({
      error: 'Hey! All fields are required!',
    });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({
        error: 'Wrong username or password!',
      });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({
      redirect: '/account',
    });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'Hey! All fields are required!',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Hey! Passwords do not match!',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({
        redirect: '/account',
      });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({
          error: 'Username already in use.',
        });
      }

      return res.status(400).json({
        error: 'An error occurred.',
      });
    });
  });
};

const changePass = (request, response) => {
  const req = request;
  const res = response;

  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.pass || !req.body.pass2) {
    return res.status(400).json({
      error: 'Hey! All fields are required!',
    });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({
      error: 'Hey! Passwords do not match!',
    });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) =>
    Account.AccountModel.updateOne({
      username: req.session.account.username,
    },

      {
        salt,
        password: hash,
      },

      (err) => {
        if (err) {
          console.log(err);

          return res.status(400).json({
            error: 'An error occurred.',
          });
        }

        res.json({
          redirect: '/account',
        });

        return res.status(200).json();
      }
    )
  );
};

// we tried making a function to Delete the
// user's account, but couldn't finish
//
//const deleteAccountServer = (request, response) => {
//  const req = request;
//  const res = response;
//  
//  Account.AccountModel.authenticate(req.session.account.username,
//req.body.currentPass,
//    (err, doc) => {
//      if (err) {
//        return res.json({ error: 'An error occured' });
//      }
//      if (!doc) {
//        return res.status(401).json({ error: 'Current password is incorrect' });
//      }
//      console.log('console statement');
//      return res.json({ message: 'Review deleted!' });
//    });
//  return true;
//};


const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePass = changePass;
//module.exports.deleteAccountServer = deleteAccountServer;
