const mongoose= require("mongoose");

const problemSchema= mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    title:{type:String, required:true},
    topic:{
        type:String,
        required:true,
        enum:["Arrays", "Strings", "LinkedList", "Trees", "Graphs",
             "DP", "Recursion", "Sorting", "Hashing", "Other"],
             
    },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    status:     { type: String, enum: ["Todo", "Solving", "Done"], default: "Todo" },
    platform:   { type: String, enum: ["LeetCode", "GFG", "HackerRank", "Other"], default: "LeetCode" },
    link:       { type: String, default: "" },
    notes:      { type: String, default: "" },
},{timestamps:true});

module.exports=mongoose.model("Problem",problemSchema)