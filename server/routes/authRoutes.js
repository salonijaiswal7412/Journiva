const express=require('express');
const passport=require('passport');
const jwt=require('jsonwebtoken');
const router=express.Router();


router.get('/google',
    passport.authenticate('google',{scope:['profile','email']})
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Redirect to frontend with token as query param
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);

  }
);

module.exports = router;