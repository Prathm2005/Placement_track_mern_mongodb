const express= require("express");
const router = express.Router();
const Problem= require("../models/Problem.js");
const {protect}= require("../middleware/auth.js");

router.use(protect);

router.get("/",async(req,res)=>{
    try {
        const problems=await Problem.find({user:req.user._id}).sort({createdAt:-1});
        res.json(problems)
    } catch (error) {
        res.status(500).json({message:error.message});
    }
});

router.post("/", async (req, res) => {
    const { title, topic, difficulty, status, platform, link, notes } = req.body;
    try {
      const problem = await Problem.create({
        user: req.user._id,
        title, topic, difficulty, status, platform, link, notes,
      });
      res.status(201).json(problem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
      const problem = await Problem.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id }, 
        req.body,
        { new: true } 
      );
      if (!problem) return res.status(404).json({ message: "Problem not found" });
      res.json(problem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
      const problem = await Problem.findOneAndDelete(
        { _id: req.params.id, user: req.user._id }, 
      );
      if (!problem) return res.status(404).json({ message: "Problem not found" });
      res.json({message:"Problem deleted"});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
module.exports=router;