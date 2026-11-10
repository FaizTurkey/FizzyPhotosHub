import express from "express";
import cors from "cors"
import "dotenv/config";
import { connectDB } from "./config/db.js";
import dns from 'node:dns';
import authRouter from "./routes/authRoutes.js";
import mediaRouter from "./routes/mediaRoutes.js";
import albumRouter from "./routes/albumRoutes.js";

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
app.use(cors());
app.use(express.json({limit : "50mb"}));

// Connect Database
connectDB();

app.get("/" , (_req,res) => {
    res.send("Server Is Live");
})

app.use("/api/auth" , authRouter);
app.use("/api/media",mediaRouter);
app.use("/api/albums" , albumRouter);


app.use((error,_req,res , _next) => {
    console.log(error);
    res.status(500).json({message: error.message || "Internal Server Error1"});
    
});

const port = process.env.PORT || 3000;

app.listen(port , () => {
    console.log(`Server Is Listen On http://localhost:${port}`);
    
});


