const models = require('../models');
const Gamer = models.Gamer;
let gameTitle = '';
let username = '';

const accountPage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }
    return res.render('app', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const homePage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }
    return res.render('home', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const searchPage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }
    return res.render('search', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const usersPage = (req, res) => {
  Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured!',
      });
    }
    return res.render('users', { csrfToken: req.csrfToken(), gamers: docs });
  });
};

const makeGamer = (req, res) => {
  if (!req.body.name || !req.body.recommend || !req.body.review) {
    return res.status(400).json({
      error: 'Hey! Game title, recommend, and review are required.',
    });
  }

  const gamerData = {
    name: req.body.name,
    recommend: req.body.recommend,
    review: req.body.review,
    owner: req.session.account._id,
  };

  const newGamer = new Gamer.GamerModel(gamerData);
  const gamerPromise = newGamer.save();

  gamerPromise.then(() => res.json({
    redirect: '/account',
  }));

  gamerPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Gamer already exists.',
      });
    }

    return res.status(400).json({
      error: 'An error occurred.',
    });
  });

  return gamerPromise;
};

const getReviews = (request, response) => {
  const req = request;
  const res = response;

  if (req.body.name !== undefined) {
    gameTitle = req.body.name;
  }

  return Gamer.GamerModel.findByName(gameTitle, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured!' });
    }
    return res.json({ gamers: docs });
  });
};

const getUsers = (request, response) => {
  const req = request;
  const res = response;

  if (req.body.name !== undefined) {
    username = req.body.name;
  }
  
  // we tried going off the id, but it didnt work right
  // a few different ways didn't work, so heres some
  // of what we tried

  return Gamer.GamerModel.findByUser(username, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ gamers: docs });
  });
};

const getGamers = (request, response) => {
  const req = request;
  const res = response;

  return Gamer.GamerModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ gamers: docs });
  });
};

const getRecentGamers = (request, response) => {
  const req = request;
  const res = response;

  console.log(`Account Id: ${req.session.account._id}`);

  return Gamer.GamerModel.findRecent((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ gamers: docs });
  });
};

const deleteReview = (request, response) => {
  const req = request;
  const res = response;

  return Gamer.GamerModel.deleteOne({ _id: req.body.gamerid }, (err2) => {
    if (err2) {
      return res.json({ err2 });
    }
    console.log('console statement');
    return res.json({ message: 'Review deleted!' });
  });
};

module.exports.homePage = homePage;
module.exports.accountPage = accountPage;
module.exports.searchPage = searchPage;
module.exports.usersPage = usersPage;
module.exports.getUsers = getUsers;
module.exports.getGamers = getGamers;
module.exports.getRecentGamers = getRecentGamers;
module.exports.make = makeGamer;
module.exports.getReviews = getReviews;
module.exports.deleteReview = deleteReview;
