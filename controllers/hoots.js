const express = require("express")
const verifyToken = require("../middleware/verify-token.js");

const Hoot = require("../models/hoot.js")
const router = express.Router()

//add routes here.. 


//POST Route to create Hoots , create  
// we added vertifyToken so that only autheictaed users can access this route
router.post("/", verifyToken, async (req, res) => {


    // req.user is an object that contain info abt the logged user 

    try {
        // step 1: add the logged in user as the author
        req.body.author = req.user._id; // user id 

        // step 2: creating the hoot, using create()
        const hoot = await Hoot.create(req.body); // req.body contains the Hoot data

        // step 3: include full user info in the hoot document 
        hoot._doc.author = req.user
       
       // send the response 
        res.status(201).json(hoot)
    } catch (err){

        //handle errors
        res.status(500).json({ err: err.message})
    }


})

// GET , to view all the hoots , read 
router.get("/", verifyToken, async (req, res) => {
    // new route

    try {
        const hoots = await Hoot.find({})
        .populate("author")
        .sort({ createdAt: "desc"})
        res.status(200).json(hoots)
    } catch (err) {
        res.status(500).json({ err: err.message})
    }
})


// i stoped in index hoots, i should resume tmro starting working on show  hoot. 


// show a hoot , GET , read /hoot/:hoodID

router.get("/:hootId", verifyToken, async (req, res) => {
    try {
      const hoot = await Hoot.findById(req.params.hootId).populate([
        'author',
        'comments.author',
    ]);
      res.status(200).json(hoot);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  

 // update a hoot, PUT /hoots/:hootsId

 

// controllers/hoots.js

router.put("/:hootId", verifyToken, async (req, res) => {
    try {
      // Find the hoot:
      const hoot = await Hoot.findById(req.params.hootId);
  
      // Check permissions:
      if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      // Update hoot:
      const updatedHoot = await Hoot.findByIdAndUpdate(
        req.params.hootId,
        req.body,
        { new: true }
      );
  
      // Append req.user to the author property:
      updatedHoot._doc.author = req.user;
  
      // Issue JSON response:
      res.status(200).json(updatedHoot);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });



router.delete("/:hootId", verifyToken, async (req, res) => {
    try {
      const hoot = await Hoot.findById(req.params.hootId);
  
      if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
      res.status(200).json(deletedHoot);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

 // controllers/hoots.js

router.post("/:hootId/comments", verifyToken, async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hoot = await Hoot.findById(req.params.hootId);
      hoot.comments.push(req.body);
      await hoot.save();
  
      // Find the newly created comment:
      const newComment = hoot.comments[hoot.comments.length - 1];
  
      newComment._doc.author = req.user;
  
      // Respond with the newComment:
      res.status(201).json(newComment);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });
  
  
  
  
  
module.exports = router