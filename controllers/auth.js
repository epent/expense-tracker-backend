const bcrypt = require("bcrypt");

const db = require("../db/models");
const User = db.user;

exports.signup = async (req, res, next) => {
  try {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.Email;
    const password = req.body.Password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({ user: user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.Email,
      },
    });

    const isEqual = await bcrypt.compare(
      req.body.Password,
      user.dataValues.password
    );

    res.status(200).json(user);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
