import express, { query } from 'express'
import dressModel from '../Model/dress.js'
import userModel from '../Model/users.js'
import mongoose from 'mongoose'
import * as usersControlers from './users.js'
import * as dressServices from '../Services/dress.js'
import math from 'math'
const ObjectId = mongoose.Types.ObjectId;

const router=express();

//פונקציה המחזירה את כל השמלות השמורות במערכת
export const getAllDress= async (req, res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try{
        const dress=await dressModel.find({}).sort({_id:1}).skip(index).limit(limit).exec();
        const totalDress=await dressModel.countDocuments();
        res.status(200).json({dress,totalPages:Math.ceil(totalDress/limit), currentPage:page});
    }
    catch(error){
        console.log(error);
        res.status(404).json({message: 'לא נמצאו שמלות'});
    }
}

//הוספת שמלה חדשה
export const addNewDress=async (req,res)=>{
    try{
        const dressData=dressServices.dataNewDress(req);//פונקציה המחזירה את פרטי השמלה החדשה
        await dressServices.createDress(dressData);//פונקציה היוצרת ושומרת שמלה חדשה
        res.status(200).json({message: 'השמלה נוספה למערכת'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'הוספת השמלה נכשלה'});
    }
}

//פונקציה לקבל שמלה לפי ID
export const getById=async (req,res)=>{
    try{
        const id=req.query.id;
        const dress=await dressModel.findOne({ _id: id });
        if(!dress){
            return res.status(404).json({message:'לא נמצאה שמלה'});  
        }
        return res.status(200).json(dress);
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});
    }
}

//פונקציה המסננת את השמלות לפי צבע מבוקש
export const getByColor=async (req, res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try{
        const color=req.query.color;
        const dresses=await dressModel.find({color}).sort({_id:1}).skip(index).limit(limit).exec();
        const totalDress=await dressModel.countDocuments({ color });        
        if(dresses.length==0){
            return res.status(404).json({message:'לא נמצאה שמלה בצבע זה'});  
        }
        return res.status(200).json({dresses,totalPages:Math.ceil(totalDress/limit), currentPage:page});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});
    }
}

//פונקציה המסננת את השמלות לפי דרוג
export const getByFeedback=async (req, res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try{
        const feedback=parseFloat(req.query.feedback);
        const dresses= await dressModel.find({feedback}).sort({_id:1}).skip(index).limit(limit).exec();
        const totalDress=await dressModel.countDocuments({feedback});
        if(dresses.length==0){
            return res.status(404).json({message:'לא נמצאו שמלות בדירוג זה '});
        }
        return res.status(200).json({dresses,totalPages:Math.ceil(totalDress/limit), currentPage:page});
    }
    catch (error){
        console.log(error);
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});
    }
}

//פונקציה המסננת את השמלות לפי מידה מבוקשת
export const getBySize=async (req, res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try{
        const size=req.query.sizes;
        const dresses=await dressModel.find({ size: { $in: [size] } }).sort({_id:1}).skip(index).limit(limit).exec();
        const totalDress=await dressModel.countDocuments({ size: { $in: [size] } });
        if(dresses.length==0){
            return res.status(404).json({message:'לא נמצאה שמלה במידה זו'});  
        }
        return res.status(200).json({dresses,totalPages:Math.ceil(totalDress/limit), currentPage:page});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});
    }
}

//פונקציה המסננת את השמלות לפי טווח מידות מבוקש
export const getByCountSize=async (req, res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try {
        const sizes = req.query.sizes; 

        if (!Array.isArray(sizes)) {
            return getBySize(req,res);
            
        }
        const requestedSizeCounts = sizes.reduce((acc, size) => {
            const numSize = Number(size);
            if (!isNaN(numSize)) {
                acc[numSize] = (acc[numSize] || 0) + 1;
            }
            return acc;
        }, {});
        const allDresses = await dressModel.find().sort({ _id: 1 }).exec();
        const matchingDresses = allDresses.filter(dress => {
            const dressSizeCounts = dress.size.reduce((acc, size) => {
                acc[size] = (acc[size] || 0) + 1;
                return acc;
            }, {});
            return Object.keys(requestedSizeCounts).every(size => {
                return dressSizeCounts[size] >= requestedSizeCounts[size];
            });
        });
        const paginatedDresses = matchingDresses.slice(index, index + limit);
        const totalDress = matchingDresses.length;
        if (paginatedDresses.length === 0) {
            return res.status(404).json({ message: 'לא נמצאה שמלה במידות אלו' });
        }
        return res.status(200).json({
            dresses: paginatedDresses,
            totalPages: Math.ceil(totalDress / limit),
            currentPage: page
        });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'החיפוש נכשל, נסו שנית' });
    }
}

//פונקציה המסננת את השמלות לפי טווח מחירים
export const getByPrice=async (req, res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try{
        const minPrice=parseFloat(req.query.minPrice);
        const maxPrice=parseFloat(req.query.maxPrice);
        const dresses= await dressModel.find({price: {$gte:minPrice, $lte: maxPrice}}).sort({_id:1}).skip(index).limit(limit).exec();
        const totalDress=await dressModel.countDocuments({price: {$gte:minPrice, $lte: maxPrice}});
        if(dresses.length==0){
            return res.status(404).json({message:'לא נמצאו שמלות בטווח מחירים זה '});
        }
        return res.status(200).json({dresses,totalPages:Math.ceil(totalDress/limit), currentPage:page});
    }
    catch (error){
        console.log(error);
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});
    }
}

//פונקציה המחזירה שמלות לפי עיר
export const getDressByCity=async (req,res)=>{
    const page=parseInt(req.query.page) || 1;
    const limit=parseInt(req.query.limit) || 9;
    const index=(page-1)*limit;
    try{
        const city=req.query.city;
        const userResult= await usersControlers.getUserByCity(city);
        if(userResult.message){
            return res.status(404).json({message:userResult.message});
        }
        const userId=userResult.map(user=> user._id);
        const dresses=await dressModel.find({businessID: {$in:userId}}).sort({_id:1}).skip(index).limit(limit).exec();
        const totalDress=await dressModel.countDocuments({businessID: {$in:userId}});
        if(dresses.length==0){
            return res.status(404).json({message:'לא נמצאו שמלות בעיר זו '});
        }
        return res.status(200).json({dresses,totalPages:Math.ceil(totalDress/limit), currentPage:page});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'החיפוש נכשל, נסו שנית'});     
    }

}

//פונקציה לעדכון שמלה
export const updateDress=async(req,res)=>{
    try{
        // const image=req.body.image.path;   
        const image=req.file.path;      
        const {color , size, price} = req.body;
        const dress= {color,image , size, price};
        const updateDress=await dressModel.findByIdAndUpdate(req.body._id,dress,{new:true});
        if(!updateDress){
            return res.status(404).json({ message: 'השמלה לעדכון לא נמצאה' });
        }
        return res.status(200).json({ message: 'השמלה עודכנה בהצלחה' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'העידכון נכשל, נסו שנית'}); 
    }
}

//פונקציה להוספת חוות דעת
export const addTalkBack=async (req, res)=>{
    try{
        const {dress,talkBack} =req.body;
        const dressId=dress._id;
        if(!talkBack){
            return res.status(404).json({ message: 'לא נשלחה תגובה להוספה' });
        }
        const dressToUpdate = await dressModel.findById(dressId);
        dressToUpdate.talkBack.push(talkBack);
        await dressToUpdate.save();
        return res.status(200).json({ message: 'התגובה נוספה בהצלחה' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'הוספת התגובה נכשלה, נסו שנית'});  
    }
}

//פונקציה להוספת feedBack לשמלה הנבחרת
export const addFeedBack=async(req,res)=>{
    try{
        const {dressId,feedback} =req.body;
        if(!feedback){
            return res.status(404).json({ message: 'השמלה לא דורגה' });
        }
        const dressToUpdate = await dressModel.findById(dressId);
        const lastFeedBack=dressToUpdate.feedback;
        if(lastFeedBack==0){
            dressToUpdate.feedback=feedback;
        }
        else{
            dressToUpdate.feedback=math.floor((lastFeedBack+feedback)/2);
        }
        await dressToUpdate.save();
        return res.status(200).json({ message: 'הדרוג עודכן בהצלחה' });
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:'הוספת הדירוג נכשלה, נסו שנית'});  
    }

}


export default router;