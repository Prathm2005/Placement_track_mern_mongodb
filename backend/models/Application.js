const mongoose= require("mongoose");
const applicationSchema= mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    company:     { type: String, required: true },
    role:        { type: String, required: true },
    status:{
        type:String,
        enum:["Wishlist", "Applied", "OA", "Interview", "Offer", "Rejected"],
        default:"Wishlist"
    },
    appliedDate: { type: Date, default: null },
    ctc:         { type: String, default: "" },  
    location:    { type: String, default: "" },
    notes:       { type: String, default: "" },
    nextStep:    { type: String, default: "" },
},{timestamps:true})

module.exports=mongoose.model("Applicarion",applicationSchema)