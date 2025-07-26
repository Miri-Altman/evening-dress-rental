import mongoose from 'mongoose'

const dressSchema = new mongoose.Schema({
    color:{type:String,required:true},
    image:{type:String,required:true,unique:true},
    size:{type:[Number], required:true},
    price:{type:Number, required:true},
    feedback: Number,
    businessID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    talkBack:[String]
});

const dress=mongoose.model('dress', dressSchema);

export default dress;