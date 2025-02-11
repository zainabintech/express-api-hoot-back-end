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


// i stoped in index hoots, i should resume tmro starting working on update hoot. 


module.exports = router