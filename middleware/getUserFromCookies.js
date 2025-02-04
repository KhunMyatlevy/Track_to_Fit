const getUserFromCookies = (req, res, next) => {

    const userId = req.cookies.userId;
  
    if (!userId) {
      return res.status(401).json({ message: 'No userId found in cookies' });
    }

    req.userId = userId;
    next();
};

module.exports = getUserFromCookies;

  