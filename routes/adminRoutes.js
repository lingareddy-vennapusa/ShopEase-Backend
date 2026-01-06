const express = require("express")
const isAdmin=require("../middleware/roleMiddleware")
const protect = require("../middleware/authMiddleware")


const router= express.Router()

router.get("/dashboard", protect,isAdmin, (req,res,next)=>{
    res.json({message:"welcome Admin "})
})

module.exports= router;