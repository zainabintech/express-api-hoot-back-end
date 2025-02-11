// step 1, import mongooseDB library
const { default: mongoose } = require("mongoose");


//step 5, create comment schema for the hoots
const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  );


//step 2, create schmea 
const hootSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema] //step 6, commentSchmea created above here, embeded on the hoot schmea 
    },
    { timestamps: true }
  );



  // Step 3, create a collection 
  const Hoot = mongoose.model('Hoot', hootSchema)
  
//step 4, export so that i can be accessed 
  module.exports = Hoot