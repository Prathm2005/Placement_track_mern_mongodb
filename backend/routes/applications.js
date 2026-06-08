const express= require("express");
const router = express.Router();
const Application= require("../models/Application.js");
const {protect}= require("../middleware/auth.js");

router.use(protect);
router.get("/",async(req,res)=>{
    try {
        const app=await Application.find({user:req.user._id}.sort({createdAt:-1}));
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    const { company, role, status, appliedDate, ctc, location, notes, nextStep } = req.body;
    try {
      const app = await Application.create({
        user: req.user._id,
        company, role, status, appliedDate, ctc, location, notes, nextStep,
      });
      res.status(201).json(app);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
   

  router.put("/:id", async (req, res) => {
    try {
      const app = await Application.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
      );
      if (!app) return res.status(404).json({ message: "Application not found" });
      res.json(app);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
   
  router.delete("/:id", async (req, res) => {
    try {
      const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
      if (!app) return res.status(404).json({ message: "Application not found" });
      res.json({ message: "Application deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

module.exports=router;
