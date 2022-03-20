const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db/models");
const User = db.user;

exports.signup = async (req, res, next) => {
  try {
    const userExists = await User.findOne({
      where: {
        email: req.body.Email,
      },
    });

    if (userExists) {
      const error = new Error("User exists");
      error.statusCode = 422;
      throw error;
    }

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

    // const token = jwt.sign(
    //   {
    //     email: email,
    //     userId: user.dataValues.id,
    //   },
    //   "f7AfW2hvZfUEP24S6xL5Dv27j94e4JPx",
    //   { expiresIn: "1h" }
    // );

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

    if (!user) {
      const error = new Error("Wrong email");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(
      req.body.Password,
      user.dataValues.password
    );

    if (!isEqual) {
      const error = new Error("Wrong password");
      error.statusCode = 401;
      throw error;
    }

    // const token = jwt.sign(
    //   {
    //     email: req.body.Email,
    //     userId: user.dataValues.id,
    //   },
    //   "f7AfW2hvZfUEP24S6xL5Dv27j94e4JPx",
    //   { expiresIn: "1h" }
    // );

    res.status(200).json({ user: user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
