import express from 'express' 
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import mongodb from 'mongodb'
import mongoose from './DB/mongo.js'
import users from './Routes/users.js'
import dress from './Routes/dress.js'


dotenv.config();
const port=process.env.PORT;
const app=express();

app.use(cors());
// translate Json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//get
app.get("/",(req,res)=>{
    res.send("hello");
});
app.get("/n",(req,res)=>{
    res.send("nechami");
});
app.get("/m",(req,res)=>{
    res.send("miri");
});
app.use("/users",users);
app.use("/dress",dress);


app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
});
