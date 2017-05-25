'use strict'

// node required modules
const express = require('express')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const bcrypt = require('bcrypt-nodejs')
const router = express.Router()
const mongoose = require('mongoose')

// models
const User = require("../models/user.js")
const Idea = require("../models/idea.js")
const Category = require("../models/category.js")
const Feedback = require("../models/feedback.js")
const Guest = require("../models/guest.js")

// config files
const invite = require("../config/createinvitation.js")
const jwtConfig = require("../config/jwt.js")

// storage and upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, 'public/uploads/'),
  filename: (req, file, callback) => {
    callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
})

const upload = multer({storage: storage}).single('file') //single file upload using this variable

//TODO: this should be accessed only with a valid token. Accessed here due to the fact that a profile picture could be uploaded before autheticating (@sign up)
router.post('/upload', function(req, res) { // API path that will upload the files
  upload(req, res, function(err){
    if(err)
    return res.status(500).json({error_code:1, error_desc:err});
    res.json({error_code:0, file_name:req.file.filename});
  })
})

// invite a user to Wetopia
router.post('/invitation', function(req, res) {
  //find if the user is not already in the invitation database
  Guest.findOne({ 'email': req.body.email.toLowerCase()}, 'email')
  .exec(function (err, user) { // if there are any errors, return the error
    if (err) {
      res.status(500).json({'error': err, 'success': "false", 'message': "Error finding that user or email."}); // return shit if a server error occurs
    }
    else {
      if (user) { //TODO: it would be better to validate all this with mongoose
        if (user.email == req.body.email)
          res.status(400).json({'message': "That email and username are already registered. Try with another ones."})
      }
      else {
        invite.insertInvite(req, function(response){
          if (response.success)
            res.status(201).json({'message': 'Thanks, please check your email :)'})
          else
            res.status(500).json({'message': 'Ops! Please try again :('})
        })
      }
    }
  })
})

// register NEW USER
router.post('/signup', function(req, res){
  User.findOne({ $or: [ { 'email': req.body.email.toLowerCase() }]}, 'email')
  .exec(function (err, user) { // if there are any errors, return the error
    if (err) {
      res.status(500).json({'error': err, 'success': "false", 'message': "Error finding that email."}); // return shit if a server error occurs
    } else {
      if (user) { //TODO: it would be better to validate all this with mongoose
        if (user.email == req.body.email)
          res.status(400).json({'message': "That email is already registered. Try with another one."})
      } else {
        new User({
          email: req.body.email,
          name: req.body.name,
          username: req.body.username,
          lastname: req.body.lastname,
          password: bcrypt.hashSync(req.body.password),
          image: req.body.image || null//?
        })
        .save(function (err, user) { // Save the user
          if (err)
            res.status(500).json({'error': err, 'message': "Could not save user."});
          else { // Create a token and --- sign with the user information --- and secret password
            var token = jwt.sign({"_id": user._id}, jwtConfig.secret, { expiresIn: 216000 }) //Expires in 60 hours
            res.status(200).json({ '_id': user._id, 'username': user.username, 'token': token })
          }
        })
      }
    }
  })
})

// AUTHENTICATE TO GIVE NEW TOKEN (This should be done @login)
router.post('/authenticate', function(req, res) {
  console.log(req.body);
  if (!req.body || !req.body.email)
    return res.status(400).json({'message': "Authentication failed. No user specified." });
  User.findOne({ $or: [ { 'email': req.body.email.toLowerCase() } ] })
  .exec(function(err, user) {
    if (err)
      res.status(500).json({'error': err})
    else if (!user) {
      console.log('---------no user');
      res.status(401).json({'message': "Authentication failed. Wrong user or password."})
    } else {
      if (!user.comparePassword(req.body.password)) { // check if password matches
        console.log('---------bad password');
        res.status(401).json({'message': "Authentication failed. Wrong user or password."})
      } else {
        console.log('---------all cool!!');
        var token = jwt.sign({"_id": user._id}, jwtConfig.secret, { expiresIn: 216000 }) // expires in 6 hours
        res.status(200).json({ '_id': user._id, 'username': user.username, 'token': token })  // Return the information including token as JSON
      }
    }
  })
})


/*************************************
***                                ***
***          MIDDLEWARE JWT        ***
***                                ***
*************************************/
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var token = req.headers['x-access-token']; // check header or url parameters or post parameters for token

  if (token) {
    var decodedToken = jwt.decode(token); //Decode token
    jwt.verify(token, jwtConfig.secret, function(err, decoded) { // decode token
      if (err) {
        res.status(401).json({'success': false, 'message': 'Failed to authenticate token.'});
      } else { //Send the decoded token to the request body
        req.U_ID = decoded._id; //Save the decoded user_id from the token to use in next routes
        next();
      }
    })
  } else {
    res.status(403).json({'message': "No token provided"});
  }
});


/*************************************
***                                ***
***         CATEGORIES             ***
***                                ***
*************************************/
// RETURN ALL AVAILABLE CATEGORIES
router.get('/tags', function(req, res){
  Category.find({})
  .exec(function(err, tags){
    if (err)
      res.status(500).json({'error': err})
    else
      res.json(tags);
  })
})

/*************************************
***                                ***
***              USERS             ***
***                                ***
*************************************/
// RETURN ALL USERS
router.get('/members', function(req, res) {
  User.find({}, 'name lastname username image', function(err, users){
    res.json(users);
  })
})

// RETURN ALL USERS EXCEPT THE USER WHO IS MAKING THE PETITION
router.route('/members/:user_id')
.get(function(req, res) {
  User.find({}, 'name lastname username image')
  .where('_id')
  .nin([req.params.user_id])
  .exec(function(err, users){
    res.json(users);
  })
})

// UPDATE A PROFILE PICTURE
router.route('/users/:user_id/avatar')
.post(upload, function(req,res){
  User.findById(req.params.user_id)
  .exec(function(err, user) {
    if (err)
      return res.status(500).json({'error': err})
    if (req.params.user_id.indexOf(req.U_ID) <= -1)
      return res.status(300).json({error: {message: "This are not you >:|"}})
    user.image = '/static/uploads/'+ req.file.filename
    user.save(function(err){
      if (err)
        return res.status(500).json({'error': err})
      return res.status(200).json({message: "Avatar updated", path: "/static/uploads/" + req.file.filename})
    })
  })
})

// GET PROFILE INFORMATION
router.route('/users/:user_id') //just when the url has "id=" it will run, otherwise it will look for a username
.get(function (req, res) {
  User.findById(req.params.user_id, '-password') //Return all excepting password
  .exec(function(err, user) {
    if (err)
      return res.status(500).json({'error': err})
      console.log(user.projects);
    res.status(200).json({'user': user})
  })
})
.put(function (req, res) {
  //TODO: Update user
  res.status(501).json({'message':'Not yet supported.'})
})
.delete(function (req, res) {
  //TODO: *Deactivate* user, validate user us deleting himself
  res.status(501).json({'message':'Not yet supported.'})
})

/*************************************
***                                ***
***          FEEDBACK              ***
***                                ***
*************************************/
// GIVE FEEDBACK TO AN IDEA
router.route('/ideas/:idea_id/feedback')
.post(function (req, res) {
  /* COMMENT AN IDEA */
  let feedback = new Feedback({
    user: req.U_ID,
    comment: req.body.text,
    idea: req.params.idea_id
  });

  feedback.save(function(err, feedback) {
    if (err)
      return res.status(500).json({'err':err})
    Idea.update(
      { _id: {$in: req.params.idea_id} },
      { $push: {"feedback":  feedback._id} },
      { multi: true }
    )
    .exec(function(err){
      if (err)
        return res.status(500).json({'error': err,});
      else
        res.status(201).json({message: 'Feedback sent.'});
    })
  })
});

// STAR A FEEDBACK
router.route('/ideas/:idea_id/:feedback_id/star')
.post(function (req, res) {
  /* Starr a Feddback on an IDEA */
  Feedback.findById(req.params.feedback_id)
  .update({ $addToSet: { 'stars': req.U_ID } })
  .exec(function(err, result) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (result.nModified == 0) //If the comment wasn't modified, it was already starred
      res.status(400).json({'message': "Already starred."})
    else {
      res.status(201).json(result)
    }
  })
})


/*************************************
***                                ***
***          IDEAS                 ***
***                                ***
*************************************/
// SHOW INTEREST ON AN IDEA
router.route('/ideas/:idea_id/interest')
.post(function (req, res) {
  Idea.findById(req.params.idea_id)
  .update({ $addToSet: {'interest': {'userID': req.U_ID, 'type':req.body.interest} } })
  .exec(function(err, result) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (result.nModified == 0) //If the comment wasn't modified, it was already starred
      res.status(400).json({'message': "Already shown interest."})
    else {
      res.status(201).json(result)
    }
  })
})

router.route('/users/:user_id/ideas')
// CREATE AN IDEA
.post(function (req, res) {
  let ideaname = req.body.name.split(' ').join('-').toLowerCase()

  Idea.findOne({members: req.U_ID, ideaname: ideaname})
  .exec(function(err, ideaFound){
    if (err) {
      return res.status(500).json({'err':err})
    }
    if (ideaFound)
      return res.status(300).json({'err':{message: "Error, you already have an idea with this name."}})

    let idea = new Idea({
      admin: req.U_ID,
      banner: req.body.banner,
      description: req.body.description,
      problem: req.body.problem,
      name: req.body.name,
      category: req.body.category,
      ideaname: ideaname
    })
    if (!req.body.members || req.body.members.length == 0)
      idea.members = [req.U_ID]
    else {
      idea.members = req.body.members
      idea.members.push(req.U_ID)
    }
    idea.save(function(err, idea) {
      if (err)
        return res.status(500).json({'err':err})
      User.update(
        { _id: {$in: idea.members} },
        { $push: {"ideas":  idea._id} },
        { multi: true }
      )
      .exec(function(err){
        if (err)
          return res.status(500).json({'error': err,});
        else
          res.status(201).json({message: 'Idea created!', idea: idea});
      })
    })
  })
})

// GET INFORMATION FOR A SPECIFIC IDEA
router.route('/ideas/self/:idea_id')
.get(function (req, res) {
  Idea.findById(req.params.idea_id)
  .lean()
  .populate('members', 'username image')
  .populate({
    path: 'feedback',
    model: 'Feedback',
    populate: {
      path: 'user',
      model: 'User',
      select: 'image name username'
    }
  })
  .exec(function (err, project) {
    if (err) {
      res.status(500).json({'error': err, 'success': false});
    } else {
      res.json(project);
    }
  })
})
// ADD UNIQUE VIEW TRACKING TO AN SPECIFIC IDEA
.post(function (req, res) {
  Idea.findByIdAndUpdate(req.params.idea_id, { $addToSet: {views: req.U_ID} })
  .exec(function(err) {
    if (err)
      res.status(500).json({'error': err, 'success': false});
    else
      res.json({"message": "Successfully added a new view to the idea", "success": true})
  })
})
.put(function (req, res) {
  //TODO: Update project info
  res.status(501).json({'message':'Not yet supported.'})
})
.delete(function (req, res) {
  //TODO: Delete project
  res.status(501).json({'message':'Not yet supported.'})
})

// GET ALL IDEAS
router.route('/ideas/all')
.get(function (req, res) {
      Idea.find()
      .exec(function (err, ideas) {
        if (err)
          res.status(500).json({'error': err, 'success': false});
        else
          res.status(200).json({ideas})
  })
})

// GET ALL IDEAS BY CATEGORY
router.route('/ideas/all/:category')
.get(function (req, res) {
  const name = req.params.category
  Category.findOne({ name })
  .exec(function (err, category) {
    if (err || !category)
      res.status(500).json({'error': err, 'success': false});
    else {
      Idea.find({'category': category._id})
      .exec(function (err, ideas) {
        if (err)
          res.status(500).json({'error': err, 'success': false});
        else
          res.status(200).json({ideas})
      })
    }
  })
})

// GET STATS FOR AN IDEA
//This function returns an array with the results only. This is the order: money, loves, likes, dislikes,
router.route('/ideas/:idea_id/stats')
.get(function (req, res) {
  Idea.findById(req.params.idea_id, 'members')
  .exec(function (err, idea) {
    if (err)
      return res.status(500).json({'error': err})
   if (idea.members.indexOf(req.U_ID) <= -1)
      return res.status(300).json({error: {message: "This is not your idea. Get the hell outta here >:| "}})
    else {
      /* Interests */
      const interestAggregator = [
        {
          $match: { "_id" : new mongoose.Types.ObjectId(req.params.idea_id)}
        },
        { $unwind: "$interest" },
        { $group: {
                  _id: "$interest.type",
                  count: { $sum: 1 }
          }
        }
      ]
      /* View Stats */
      const viewAggregator = [
        {
          $match: { "_id" : new mongoose.Types.ObjectId(req.params.idea_id)}
        },
        { $unwind: "$views" },
        { $group: {
                  _id: "Views",
                  count: { $sum: 1 }
          }
        }
      ]
      /* Feedback Stats */
      const feedbackAggregator = [
        {
          $match: { "_id" : new mongoose.Types.ObjectId(req.params.idea_id)}
        },
        { $unwind: "$feedback" },
        { $group: {
                  _id: "Feedback",
                  count: { $sum: 1 }
          }
        }
      ]
      /* Stars in Idea */
      const starsAggregator = [
        {
          $match: { "idea" : new mongoose.Types.ObjectId(req.params.idea_id)}
        },
        { $unwind: "$stars" },
        { $group: {
                  _id: "Starred Comments",
                  count: { $sum: 1 }
          }
        }
      ]

      const promises = [
        Idea.aggregate(interestAggregator).exec(),
        Idea.aggregate(viewAggregator).exec(),
        Idea.aggregate(feedbackAggregator).exec(),
        Feedback.aggregate(starsAggregator).exec()
      ]
       Promise.all(promises).then(function(results) {
         res.status(200).json(results);
       }).catch(function(err){
           res.status(500).json(err);
       });

    }
  })
})

module.exports = router;
