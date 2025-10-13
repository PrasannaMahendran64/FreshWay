// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image:{type:String}
}, { timestamps: true,collection:"Category" });

const CategoryModel = mongoose.model('Category', CategorySchema);


module.exports=CategoryModel  