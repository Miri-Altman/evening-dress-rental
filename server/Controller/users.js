import express from 'express'
import userModel from '../Model/users.js'
import dressModel from '../Model/dress.js'
import mongoose from 'mongoose'
import { testToken } from '../MiddleWare/token.js';
import * as userServices from '../Services/users.js'
import bodyParser from 'body-parser';
const {json} =bodyParser;
const ObjectId = mongoose.Types.ObjectId;

const router=express();

//פונקציה המחזירה את כל המשתמשים במערכת
export const getAllUser=async (req,res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 15;
    const index=(page-1)*limit;
    try{
        const users=await userModel.find({}).sort({_id:1}).skip(index).limit(limit).exec();
        const totalUsers=await dressModel.countDocuments();
        res.status(200).json({users,totalPages:Math.ceil(totalUsers/limit), currentPage:page});
    }
    catch(error){
        console.log(error);
        res.status(404).json({ message: 'לא נמצאו משתמשים' });
    }
}

//פונקציה המכניסה משתמש חדש
export const addNewUser=async (req,res)=> {
    try{
        const userData=userServices.dataNewUser(req);  //פונקציה המחזירה את פרטי המשתמש החדש
        const user=await userServices.createUser(userData);  //פונקציה היוצרת משתמש חדש
        await login(req, res);  //קריאה לפונקצית התחברות למערכת עם המשתמש החדש
    } 
    catch(error){
        const checkPassword=await getUserByPassword(req.body.password);
        if (checkPassword){
            return res.status(404).json({message: 'סיסמה זו קיימת במערכת, יש לבחור סיסמה אחרת'});
        }
        console.log(error);
        return res.status(500).json({message: 'ההרשמה נכשלה, נסו שנית'});
    }
}

//פונקציה המחזירה משתמש לפי סיסמה
export const getUserByPassword=async(password)=>{
    try{
        if(!password){
            return {message: 'לא הוקשה סיסמה'};
        }
        const user=await userModel.findOne({password:password})
            if(!user){
                return {message: 'לא נמצא משתמש התואם לסיסמה זו'};
            }
        return user;
    }
    catch(error){
        console.log(error);
        return {message: 'החיפוש נכשל, נסו שנית'};
    }
}

//פונקציה המחזירה משתמש לפי שם
export const getUsersByName=async(name)=>{
    try{
        if(!name){
            return {message: 'לא הוקש שם'};
        }
        const user=await userModel.find({name}).exec();
        if(user.length==0){
                return {message: 'לא נמצא משתמש התואם לשם זה'};
            }
        return user;
    }
    catch(error){
        console.log(error);
        return {message: 'החיפוש נכשל, נסו שנית'};
    }
}

// פונקציה המחזירה משתמש לפי ID
export const getUsersById = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ message: 'לא הוקש קוד' });
        }
        const user = await userModel.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: 'לא נמצא משתמש התואם לקוד זה' });
        }
        return res.json(user); // שולחת את המשתמש שנמצא בתשובה
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'החיפוש נכשל, נסו שנית' });
    }
};


//פונקציה לקבלת שמלות למשתמש מסויים
export const getDressForUser=async(req,res)=>{
    try{
        const id=req.query.id;
        const dresses=await dressModel.find({businessID:id}).exec();
        if(dresses.length==0){
            return res.status(404).json({message:'טרם הכנסת שמלות למערכת'});  
        }
        return res.status(200).json(dresses);
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});  
    }
}

//פונקציה לקבלת משתמשים לפי עיר מסויימת
export const getUserByCity=async(city)=>{
    try{
        const usersId=await userModel.find({city}).exec();
        if(usersId.length==0){
            return {message:'לא נמצאו משתמשים בעיר זו'};
        }
        return usersId;
    }
    catch(error){
        console.log(error);
        return {message:'החיפוש נכשל, נסו שנית'};
    }
}

//פונקציה לעדכון משתמש
export const updateUser=async(req,res)=>{
    try{
        const {name, password, email ,phone, address, city} = req.body;
        const user = {name, password, email ,phone, address, city};
        const updaterUser=await userModel.findByIdAndUpdate(req.body._id,user,{new:true});     
        if(!updaterUser){
            return res.status(404).send({ message: 'לא נמצא משתמש התואם לפרטים' });
        }
        const token=userServices.generateToken(req.body._id,user.name,user.password,user.email);
        return res.json({token:token,user:user});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'העידכון נכשל, נסו שנית'});
    }
}

//פונקצית התחברות למערכת
export const login=async(req,res)=>{
    try{
        const name=req.body.name;
        const password=req.body.password;
        const user=await getUsersByName(name);
        if(user.message){
           return res.status(404).json(user.message);
        }
        const currentUser=await getUserByPassword(password);
        if(currentUser.message||currentUser.name!=name){
            return res.status(401).json({message: 'שם משתמש או סיסמא שגויים, נסו שנית'});         
        }
        const token= userServices.generateToken(currentUser._id, name, password, currentUser.email);
        return res.status(200).json({token, user:currentUser, message:'התחברת בהצלחה למערכת'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'ההתחברות נכשלה'});
    }
}

export default router;

