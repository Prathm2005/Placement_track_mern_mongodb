const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const dotenv= require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
connectDB();
const app=express();

app.use(cors({
    origin: "http://localhost:5173",
    devlopment:"https://placement-track-mern-mongodb.onrender.com"
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth",require("./routes/auth.js"));
app.use("/api/problems",require("./routes/problems.js"));
app.use("/api/applications",require("./routes/applications.js"));

const PORT= process.env.PORT||5000;
app.listen(PORT,(req,res)=>{
    console.log(`Server is running at ${PORT}`);
    
})
