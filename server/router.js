const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requireSecure, controllers.Account.getToken);
  app.get('/getGamers', mid.requireLogin, controllers.Gamer.getGamers);
  app.get('/getRecentGamers', mid.requireLogin, controllers.Gamer.getRecentGamers);

  app.get('/login', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
  app.post('/login', mid.requireSecure, mid.requireLogout, controllers.Account.login);
  app.post('/signup', mid.requireSecure, mid.requireLogout, controllers.Account.signup);
  app.get('/logout', mid.requireLogin, controllers.Account.logout);

  app.get('/account', mid.requireLogin, controllers.Gamer.accountPage);

  app.post('/changePass', mid.requireLogin, controllers.Account.changePass);

  app.get('/home', mid.requireLogin, controllers.Gamer.homePage);
  app.post('/review', mid.requireLogin, controllers.Gamer.make);

  app.get('/getReviews', mid.requireLogin, controllers.Gamer.getReviews);
  app.post('/getReviews', mid.requireLogin, controllers.Gamer.getReviews);
  app.get('/search', mid.requireLogin, controllers.Gamer.searchPage);

  app.post('/deleteReview', mid.requireLogin, controllers.Gamer.deleteReview);

  app.get('/users', mid.requireLogin, controllers.Gamer.usersPage);
  app.get('/getUsers', mid.requireLogin, controllers.Gamer.getUsers);
  app.post('/getUsers', mid.requireLogin, controllers.Gamer.getUsers);
  
//  app.post('/deleteAccountServer', mid.requiresLogin,
//  mid.requiresSecure, controllers.Account.deleteAccount);

  app.get('/', mid.requireSecure, mid.requireLogout, controllers.Account.loginPage);
};

module.exports = router;
