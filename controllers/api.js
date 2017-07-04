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
const Pivot = require("../models/pivot.js")
const Category = require("../models/category.js")
const Feedback = require("../models/feedback.js")
const Guest = require("../models/guest.js")
const DeletedIdea = require("../models/deleted_idea.js")
const Notification = require("../models/notification.js")

// config files
const invite = require("../config/createinvitation.js")
const welcome = require("../config/mailing_welcome.js")
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
  User.findOne({ $or: [ { 'email': req.body.email.toLowerCase() }, { 'username': req.body.username.toLowerCase() } ]}, 'email username')
  .exec(function (err, user) { // if there are any errors, return the error
    if (err) {
      res.status(500).json({'error': err, 'success': "false", 'message': "Error finding that user or email."}); // return shit if a server error occurs
    } else {
      if (user) { //TODO: it would be better to validate all this with mongoose
        if (user.username == req.body.username && user.email == req.body.email)
          res.status(402).json({'message': "That email and username are already registered. Try with another ones."})
        else if (user.email == req.body.email)
          res.status(400).json({'message': "That email is already registered. Try with another one."})
        else if (user.username == req.body.username)
          res.status(401).json({'message': "That username is already registered. Try with another one."})
      } else {
        new User({
          email: req.body.email,
          name: req.body.name,
          lastname: req.body.lastname,
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password)
        })
        .save(function (err, user) { // Save the user
          if (err)
            res.status(500).json({'error': err, 'message': "Could not save user."});
          else { // Create a token and --- sign with the user information --- and secret password
            var token = jwt.sign({"_id": user._id}, jwtConfig.secret, { expiresIn: 216000 }) //Expires in 60 hours
            res.status(200).json({ '_id': user._id, 'username': user.username, 'name': user.name, 'email': user.email, 'token': token })
          }
        })
      }
    }
  })
})

// AUTHENTICATE TO GIVE NEW TOKEN (This should be done @login)
router.post('/authenticate', function(req, res) {
  if (!req.body || !(req.body.email || req.body.username)) return res.status(400).json({'message': "Authentication failed. No user specified." })
  let email = undefined
  let username = undefined

  if (req.body.email) email = req.body.email.toLowerCase()
  if (req.body.username) username = req.body.username.toLowerCase()

  User.findOne({ $or: [ { 'email': email }, { 'username': username } ] })
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
        res.status(200).json({ '_id': user._id, 'username': user.username, 'name': user.name, 'email': user.email, 'image':user.image, 'token': token }) // Return the information including token as JSON
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
***         MAILING SERVICES       ***
***                                ***
*************************************/
// WELCOME MAIL
router.post('/welcome', function(req, res) {
  //Get user information
  User.findById(req.U_ID)
  .exec((err, user) => { // if there are any errors, return the error
    if (err) return res.status(500).json({'error': err, 'success': "false", 'message': "Error finding that specified user"}); // return shit if a server error occurs
    welcome.sendMail(req, user, function(response){
        if (response.success) res.status(201).json({'message': 'Sent mail successfully'})
        else res.status(500).json({'message': 'Something went wrong with your welcome email'})
    })
  })
})

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

// GET RECOMMENDED CATEGORIES
router.route('/categories/recommended')
.get(function (req, res) {
  Idea.find({}) // find all ideas
  .populate('category', 'name')
  .exec(function(err, ideas) {
    let category = {}
    // get category of every idea
    ideas.forEach((idea) => {
      if (category[idea.category.name] === undefined) category[idea.category.name] = 0
      category[idea.category.name] = category[idea.category.name] + 1
    })

    let categories = Object.keys(category).sort(function(a,b){return category[b]-category[a]})

    return res.status(200).json(categories)
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
router.route('/users/self/avatar')
.put(upload, function(req,res){
  User.findById(req.U_ID)
  .exec(function(err, user) {
    if (err)
      return res.status(500).json({'error': err})
    user.image = '/static/uploads/'+ req.file.filename
    user.save(function(err){
      if (err)
        return res.status(500).json({'error': err})
      return res.status(200).json({message: "Avatar updated", path: "/static/uploads/" + req.file.filename})
    })
  })
})

// GET PROFILE INFORMATION
router.route('/users/:username') //just when the url has "id=" it will run, otherwise it will look for a username
.get(function (req, res) {
  const username = req.params.username
  User.findOne({ username }, '-password') //Return all excepting password
  .exec(function(err, user) {
    if (err)
      return res.status(500).json({'error': err})
    res.status(200).json({'user': user})
  })
})
// UPDATE PROFILE INFORMATION
.put(function (req, res) {
  const user = req.U_ID
  const name = req.body.name
  const lastname = req.body.lastname
  const profession = req.body.profession
  const birthdate = req.body.birthdate
  const gender = req.body.gender
  const location = req.body.location
  const bio = req.body.bio
  const image = req.body.image

  User.findOneAndUpdate({'_id': user}, { $set: { name, lastname, profession, birthdate, gender, location, bio, image} }, { new: true })
  .exec((error, user) => {
    if (error) {
      return res.status(500).json({ error })
    }
    res.status(200).json({ user })
  })
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
// GIVE FEEDBACK TO AN IDEA/PIVOT
 router.route('/ideas/:idea_id/:pivot/feedback')
.post(function (req, res) {
  const pivot = req.params.pivot
  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .populate('pivots')
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else if (pivot < 1 || pivot != parseInt(pivot)) res.status(400).json({'error': 'Malformed API request', 'success': false})
    else if (pivot > idea.pivots.length) res.status(404).json({'error': 'Pivot not found', 'success': false})
    else {
      //order pivots
      idea.pivots.sort((a, b) => {
        return parseFloat(a.number) - parseFloat(b.number)
      })

      //create comment
      let feedback = new Feedback({
        user: req.U_ID,
        comment: req.body.text,
        pivot: idea.pivots[pivot - 1].id
      })

      //save comment
      feedback.save(function(err, feedback) {
        if (err)  return res.status(500).json({'err':err})
        Pivot.findOneAndUpdate({'_id': idea.pivots[pivot - 1].id}, { $push: {'feedback': feedback._id } }, { multi: true })
        .exec(function(err, ideas) {
          if (err) return res.status(500).json({'error': err})
          feedback.populate({
              path: 'user',
              model: 'User',
              select: 'image name username'
          }, function(err, feedback){
            if (err) return res.status(500).json({'error': err,})
            else res.status(201).json({feedback})
          })
        })
      })
    }
  })
})

// STAR A FEEDBACK
router.route('/ideas/:idea_id/:feedback_id/star')
.post(function (req, res) {
  /* Starr a Feddback on an IDEA */
  Feedback.findById(req.params.feedback_id)
  .update({ $addToSet: { 'stars': req.U_ID } })
  .exec(function(err, result) {
    if (err) {
      res.status(500).json({'error': err})
    } else if (result.nModified == 0){ //If the comment wasn't modified, it was already starred
      Feedback.findById(req.params.feedback_id)
      .update({ $pull: { 'stars': req.U_ID } })
      .exec(function(err, feedback){
        if (err) return res.status(500).json({'error': err})
        return res.status(200).json(feedback)
      })
    }
    else {
      res.status(201).json(result)
    }
  })
})

router.route('/feedback/:feedback_id')
// DELETE FEEDBACK
.delete(function (req, res) {
  // find if feedback reference is valid
  Feedback.findById(req.params.feedback_id)
  .exec(function(err, feedback){
    if (err) return res.status(500).json({'error': err})
    if (!feedback) return res.status(404).json({'error': {'message': "Feedback not found"}})
    if (feedback.user != req.U_ID) return res.status(401).json({error:{message: "This is not your comment. GFY you hacker!"}})
    else {
      // delete document from collection
        Feedback.findById(req.params.feedback_id)
        .remove(function(err){
          if (err) return res.status(500).json({'error': err})

          Pivot.findById(feedback.pivot)
          .update({ $pull: { 'feedback': req.params.feedback_id } })
          .exec(function(err, feedback){
            if (err) return res.status(500).json({'error': err})
            return res.status(200).json({'message': "Feedback successfully deleted"})
          })
        })
    }
  })
})

/*************************************
***                                ***
***          IDEAS                 ***
***                                ***
*************************************/
// SHOW INTEREST ON AN IDEA BY PIVOT
router.route('/ideas/:idea_id/:pivot/interest')
.get(function (req, res) {
  const pivot = req.params.pivot
  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .populate('pivots')
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else {
          Pivot.findOne({'_id': idea.pivots[pivot - 1].id, 'interests._id': {$eq: req.U_ID} }, {'interests.type':1})
          .exec(function(err, results) {
            if (err) return res.status(500).json({'error': err})
            return res.status(200).json({'interest': results} )
      })
    }
  })
})

.post(function (req, res) {
  const pivot = req.params.pivot
  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .populate('pivots')
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else if (pivot < 1 || pivot != parseInt(pivot)) res.status(400).json({'error': 'Malformed API request', 'success': false})
    else if (pivot > idea.pivots.length) res.status(404).json({'error': 'Pivot not found', 'success': false})
    else {

      // order pivots
      idea.pivots.sort((a, b) => {
        return parseFloat(a.number) - parseFloat(b.number)
      })

      // look for same interest (already shown)
      Pivot.findOne({'_id': idea.pivots[pivot - 1].id, 'interests._id': {$eq: req.U_ID}, 'interests.type': {$eq: req.body.interest } })
      .exec(function(err, ideas) {
        if (err) return res.status(500).json({'error': err})
        // if there is no ideas with same interest, look for any interest shown
        if (!ideas) {
          Pivot.findOne({'_id': idea.pivots[pivot - 1].id, 'interests._id': {$eq: req.U_ID} })
          .exec(function(err, results) {
            if (err) return res.status(500).json({'error': err})
            // if there is no results, this means the user have never shown interest in this idea (new interest shown)
            if (!results) {
              Pivot.findOneAndUpdate({'_id': idea.pivots[pivot - 1].id }, { $addToSet: {'interests': {'_id': req.U_ID, 'type':req.body.interest, 'comment': req.body.comment} } }, { new: true })
              .exec(function(err, ideas) {
                if (err) return res.status(500).json({'error': err})
                return res.status(200).json({'message': "Success showing interest."})
              })
            }
            // this means the user want to change the type of interest
            else {
              Pivot.findOneAndUpdate({'_id': idea.pivots[pivot - 1].id }, { $pull: {'interests': {'_id': req.U_ID}} })
              .exec((err, ideas) => {
                if (err) return res.status(500).json({'error': err})

                Pivot.findOneAndUpdate({'_id': idea.pivots[pivot - 1].id }, { $addToSet: {'interests': {'_id': req.U_ID, 'type':req.body.interest, 'comment': req.body.comment} } }, { new: true })
                .exec(function(err, ideas) {
                  if (err) return res.status(500).json({'error': err})
                  return res.status(200).json({'message': "Success showing interest."})
                })
              })
            }
          })
        }
        // this means the interest is being deleted
        else{
          Pivot.findOneAndUpdate({'_id': idea.pivots[pivot - 1].id }, { $pull: {'interests': {'_id': req.U_ID}} })
          .exec((err, ideas) => {
            if (err) return res.status(500).json({'error': err})
            return res.status(200).json({'message': "Deleted interest."})
        })
      }
    })
  }})
})

router.route('/ideas/self/create')
// CREATE AN IDEA WITH IT'S FIRST PIVOT
.post(function (req, res) {
  let ideaname = req.body.name.split(' ').join('-').toLowerCase()
  const user = req.U_ID
  const ideaLimit = 8

  User.findById(user)
  .exec((error, user) =>{
    if (error)
      return res.status(500).json({error})

    if (user.ideas.length >= 8)
      return res.status(403).json({error: 'You have reached to your limit of ideas'})

      Idea.findOne({members: req.U_ID, ideaname: ideaname})
      .exec(function(err, ideaFound){
        if (err) return res.status(500).json({'err':err})
        if (ideaFound) return res.status(300).json({'err':{message: "Error, you already have an idea with this name."}})

        //create the first pivot
        let pivot = new Pivot({
          problem: req.body.problem,
          description: req.body.description,
          number: 1
        })

        pivot.save(function(error, pivot){
          if (error) return res.status(500).json({'error':error})

          //now create the idea
          let idea = new Idea({
            admin: req.U_ID,
            banner: req.body.banner,
            description: req.body.description,
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
          //add the first pivot to the idea
          idea.pivots.push(pivot._id)

          idea.save(function(err, idea) {
            if (err) return res.status(500).json({'err':err})
            User.update(
              { _id: {$in: idea.members} },
              { $push: {"ideas":  idea._id} },
              { multi: true }
            )
            .exec(function(err){
              if (err) return res.status(500).json({'error': err,})

              return res.status(201).json({message: 'Idea created!', idea_id: idea._id})
          })
        })
      })
    })
  })
})

// GET INFORMATION FOR A SPECIFIC IDEA/PIVOT
router.route('/ideas/:idea_id/:pivot')
.get(function (req, res) {
  const pivot = req.params.pivot
  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .populate('members', 'username image')
  .populate('admin', 'username image')
  .populate('category', 'name description')
  .populate('pivots', 'id number problem description feedback')
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else if (pivot < 1 || pivot != parseInt(pivot)) res.status(400).json({'error': 'Malformed API request', 'success': false})
    else if (pivot > idea.pivots.length) res.status(404).json({'error': 'Pivot not found', 'success': false})
    else {

      // order pivots
      idea.pivots.sort((a, b) => {
        return parseFloat(a.number) - parseFloat(b.number)
      })

      // Pivot specific information
      Pivot.findById(idea.pivots[pivot - 1].id)
      .lean()
      .populate({
        path: 'feedback',
        model: 'Feedback',
        populate: {
          path: 'user',
          model: 'User',
          select: 'image name username'
        }
      })
      .exec(function (err, pivot) {
        if (err) res.status(500).json({'error': err, 'success': false})
        else return res.status(200).json({idea, pivot})
      })
    }
  })
})
// ADD UNIQUE VIEW TRACKING TO AN SPECIFIC IDEA/PIVOT
.post(function (req, res) {
  const pivot = req.params.pivot
  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .populate('pivots')
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else if (pivot < 1 || pivot != parseInt(pivot)) res.status(400).json({'error': 'Malformed API request', 'success': false})
    else if (pivot > idea.pivots.length) res.status(404).json({'error': 'Pivot not found', 'success': false})
    else {

      // order pivots
      idea.pivots.sort((a, b) => {
        return parseFloat(a.number) - parseFloat(b.number)
      })

      //add view to pivot
      Pivot.findByIdAndUpdate(idea.pivots[pivot - 1].id, { $addToSet: {views: req.U_ID} })
      .exec(function(err) {
        if (err)
          res.status(500).json({'error': err, 'success': false});
        else
          res.json({"message": "Successfully added a new view to the idea", "success": true})
      })
    }
  })
})
// UPDATE AN IDEA/PIVOT
.put(function (req, res) {
  // Pivot Management
  const pivot = req.params.pivot
  const banner = req.body.banner
  const description = req.body.description
  const problem = req.body.problem
  const members = req.body.members
  const country = req.body.country
  const name = req.body.name
  // Update the idea
  Idea.findOneAndUpdate({'_id': req.params.idea_id}, { $set: { banner, country, description, members, name } }, { new: true })
  .populate('pivots')
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else if (pivot < 1 || pivot != parseInt(pivot)) res.status(400).json({'error': 'Malformed API request', 'success': false})
    else if (pivot > idea.pivots.length) res.status(404).json({'error': 'Pivot not found', 'success': false})
    else {
        // sort pivots
        idea.pivots.sort((a, b) => {
          return parseFloat(a.number) - parseFloat(b.number)
        })
        const myIdea = idea.pivots[pivot - 1].id
        //Update pivot specific information
        Pivot.findOneAndUpdate({'_id': myIdea}, { $set: { description, problem } }, { new: true })
        .exec((error, user) => {
          if (error) return res.status(500).json({ error })
          return res.status(200).json({ user })
        })
      }
    })
})
// DELETE IDEA AND ALL THE PIVOTS RELATED TO THE IDEA
.delete(function (req, res) {
  const user = req.U_ID
  Idea.findById(req.params.idea_id)
  .exec(function(err, idea){
    if (err) return res.status(500).json({'error': err})
    if (!idea) return res.status(404).json({'error': {'message': "Idea not found"}})
    if (idea.members.indexOf(req.U_ID) <= -1) return res.status(401).json({error:{message: "This is not your idea. GFY you hacker!"}})
    else {
      // DELETE ALL THE PIVOTS
      (idea.pivots).forEach((pivot) => {
        Pivot.findById(pivot)
        .remove(function(err){
          if (err) return res.status(500).json({'error': err})
        })
      })

      Idea.findById(req.params.idea_id)
      .remove((err) => {
        if (err) return res.status(500).json({'error': err})
        // Remove idea reference from user
        User.findOneAndUpdate({'_id': user}, { $pull: { 'ideas': idea.id} }, { new: true })
        .exec((error, user) => {
          if (error) return res.status(500).json({ error })

          // Save information of deleted idea
          let deletedIdea = new DeletedIdea({
            user: req.U_ID,
            description: idea.description,
            problem: idea.problem,
            name: idea.name,
            category: idea.category,
            interests: idea.interests,
            views: idea.views,
            comment: req.body.comment
          })

          deletedIdea.save(function(err, newIdea) {
            if (err) return res.status(500).json({'err':err})
            return res.status(200).json({'message': "Idea successfully deleted"})
          })
        })
      })
    }
  })
})

// PIVOT AN IDEA (CREATE PIVOT)
router.route('/ideas/this/:idea_id/pivot')
.post(function (req, res) {

  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else {

      // create the pivot
      let pivot = new Pivot({
        description: req.body.description,
        problem: req.body.problem,
        number: idea.pivots.length + 1
      })

      pivot.save(function(err, newIdea) {
        if (err) return res.status(500).json({'err':err})

        // add reference of pivot to the specified idea
        Idea.findOneAndUpdate({'_id': req.params.idea_id}, { $addToSet: {'pivots': newIdea }, $set: { description: req.body.description } }, { new: true })
        .exec(function(err){
          if (err) return res.status(500).json({'error': err})
          return res.status(201).json({message: 'Created Pivot!', pivot: newIdea})
        })
      })
    }
  })
})

// GET ALL IDEAS
router.route('/ideas/all')
.get(function (req, res) {
      Idea.find()
      .populate('admin', 'username image')
      .populate('category', 'name description')
      .exec(function (err, ideas) {
        if (err)
          res.status(500).json({'error': err, 'success': false});
        else
          res.status(200).json({ideas})
  })
})

// GET TRENDING IDEAS
router.route('/ideas/trending')
.get(function (req, res) {
      Idea.find()
      .populate('admin', 'username image')
      .populate('category', 'name description')
      .populate('pivots')
      .exec(function (err, ideas) {
        let trendingIdeas = []

        // get category of every idea
        ideas.forEach((idea) => {
          trendingIdeas.push({
            _id: idea.id,
            trending: idea.pivots[idea.pivots.length - 1].views.length + idea.pivots[idea.pivots.length - 1].feedback.length, //get only the last pivot information. Since we do care only about recent activity
            name: idea.name,
            description: idea.description,
            admin: idea.admin,
            banner: idea.banner,
            category: idea.category
          })
        })

        let categories = Object.keys(trendingIdeas).sort(function(a,b){return trendingIdeas[b]-trendingIdeas[a]})
        trendingIdeas.sort((a,b) => b.trending - a.trending)

        return res.status(200).json(trendingIdeas)
  })
})


// GET ALL IDEAS BY CATEGORY
router.route('/ideas/all/category/:category')
.get(function (req, res) {
  const name = req.params.category
  Category.findOne({ name })
  .exec(function (err, category) {
    if (err || !category)
      res.status(500).json({'error': err, 'success': false});
    else {
      Idea.find({'category': category._id})
      .populate('admin', 'username image')
      .populate('category', 'name description')
      .exec(function (err, ideas) {
        if (err)
          res.status(500).json({'error': err, 'success': false});
        else
          res.status(200).json({ideas})
      })
    }
  })
})

//GET STATS FOR AN IDEA/PIVOT
//This function returns an array with the results only. This is the order: money, loves, likes, dislikes,
router.route('/ideas/:idea_id/:pivot/stats')
.get(function (req, res) {
  // Pivot Management
  const pivot = req.params.pivot
  // get the idea specified by the id
  Idea.findById(req.params.idea_id)
  .exec((error, idea) => {
    if (error) res.status(500).json({'error': error, 'success': false})
    else if (!idea) res.status(404).json({'error': 'Idea not found', 'success': false})
    else if (pivot < 1 || pivot != parseInt(pivot)) res.status(400).json({'error': 'Malformed API request', 'success': false})
    else if (pivot > idea.pivots.length) res.status(404).json({'error': 'Pivot not found', 'success': false})
    else if (idea.members.indexOf(req.U_ID) <= -1) return res.status(300).json({error: {message: "This is not your idea. Get the hell outta here. "}})
    else {

        // sort pivots
        idea.pivots.sort((a, b) => {
          return parseFloat(a.number) - parseFloat(b.number)
        })

        //get statitstics based on pivot reference
        const myIdea = idea.pivots[pivot - 1].id
          /* Interests */
          const interestAggregator = [
            {
              $match: { "_id" : new mongoose.Types.ObjectId(myIdea)}
            },
            { $unwind: "$interests" },
            { $group: {
                      _id: "$interests.type",
                      count: { $sum: 1 }
              }
            }
          ]
          /* View Stats */
          const viewAggregator = [
            {
              $match: { "_id" : new mongoose.Types.ObjectId(myIdea)}
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
              $match: { "_id" : new mongoose.Types.ObjectId(myIdea)}
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
              $match: { "idea" : new mongoose.Types.ObjectId(myIdea)}
            },
            { $unwind: "$stars" },
            { $group: {
                      _id: "Starred Comments",
                      count: { $sum: 1 }
              }
            }
          ]

          const promises = [
            Pivot.aggregate(interestAggregator).exec(),
            Pivot.aggregate(viewAggregator).exec(),
            Pivot.aggregate(feedbackAggregator).exec(),
            Feedback.aggregate(starsAggregator).exec()
          ]
           Promise.all(promises).then(function(results) {
             res.status(200).json(results);
           }).catch(function(err){
               res.status(500).json(err);
           })

        }
  })
})

/*************************************
***                                ***
***          NOTIFICATIONS         ***
***                                ***
*************************************/
// CREATE NEW NOTIFICATION
router.route('/notifications/')
.post(function (req, res) {
  // check if the sender exists
  User.findById(req.U_ID)
  .exec(function(err, user) {
    if (err) return res.status(500).json({'error': err})

    // create the notification
    let notification = new Notification({
      type: req.body.type,
      sender: req.U_ID,
      idea: req.body.idea,
      pivot: req.body.pivot
    })

    notification.save(function(err, notification) {
      if (err) return res.status(500).json({'err':err})
      // notify to all members of the idea
      User.update(
        { _id: {$in: req.body.members} },
        { $push: {"notifications":  notification._id} },
        { multi: true }
      )
      .exec(function(err){
        if (err) return res.status(500).json({'error': err,})
        return res.status(201).json({notification})
      })
    })
  })
})
.get(function (req, res) {
  User.find({'_id':req.U_ID},{'notifications':1, '_id':0})
  .populate({
  path: 'notifications',
  model: 'Notification',
  populate: {
    path: 'sender',
    model: 'User',
    select: 'image name'
  }
})
.populate({
path: 'notifications',
model: 'Notification',
populate: {
  path: 'idea',
  model: 'Idea',
  select: '_id name'
}
})
  .exec(function(err, user) {
    if (err)
      return res.status(500).json({'error': err})
    var newNotification = false;
    user.forEach(function(user){
      var i=0;
      while(!newNotification && i<user.notifications.length){
        if(!user.notifications[i].seen){
          newNotification = true;
        }
        i++;
      }
    })
    return res.status(201).json({'notifications': user[0].notifications, 'new notification': newNotification})
})
})
.put(function (req, res) {
  const seen = true;
  Notification.findOneAndUpdate({'_id': req.body.id}, { $set: {seen}})
  .exec(function(err) {
    if (err)
      return res.status(500).json({'error': err})
    return res.status(201).json({'Message':'Success'})
})
})


router.route('/socket/:id')
.get(function(req, res) {
  if (req.U_ID && req.params.id == GLOBAL.users.lastConnected) {
    // you could loop through here instead for more accuracy but at the cost of speed
    GLOBAL.users[req.U_ID] = GLOBAL.users.lastConnected // here the userId pairs with the socketId
    console.log(GLOBAL.users)
  }
  delete GLOBAL.users.lastConnected // get rid of this temporary spot
  return res.status(200).json({message: 'Socket information setted'})
})


module.exports = router
