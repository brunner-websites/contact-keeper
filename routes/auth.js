const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

const { check, validationResult } = require('express-validator');
const User = require('../models/User');


//  @route    GET    /api/auth
//  @desc     Get logged in user
//  @access   Private    

// passing 'auth' as the second parameter uses the middleware (middleware/auth)
router.get('/', auth, async (req, res) => {
  try {
    // This req.'user' object is set in the middleware/auth.js 
    // -password says that we don't want the password to return
    const user = await User.findById(req.user.id).select('-password');

    res.json(user);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//  @route    POST    /api/users
//  @desc     Auth user & get token
//  @access   Public    
router.post('/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password').exists()
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Send response (webtoken) / Create webtoken (jwt)

      // This payload will be part of the jwt-token (its contents can be read by jwt.verify)
      const payload = {
        user: {
          id: user.id
        }
      }

      // Create the jwt token
      jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 360000,
      }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }

  });

module.exports = router;

