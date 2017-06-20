const mongoose = require('mongoose');

//Idea Schema
var ideaSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the user administrator */
    ref: 'User',
    required: true
  },
  banner: String,
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId, /* Object ID for the category */
    ref: 'Category',
    required:true
  },
  ideaname:String, /* Codename for the project to reference it */
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  name: {
    type: String,
    required: true
  },
  country: String,
  pivots: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pivot'
  }]
});

module.exports = mongoose.model('Idea', ideaSchema);
