import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },


    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    text:{
        type:String,
        required:true
    },


    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null
    },


    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],


    repliesCount:{
        type:Number,
        default:0
    }


},{
    timestamps:true
});

export const Post = mongoose.model('social_post_comments', commentSchema);
