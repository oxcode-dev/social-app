import mongoose, { Schema } from "mongoose";


export interface IPostComment {
    post: string | mongoose.Schema.Types.ObjectId;
    text: string;
    user: string | mongoose.Schema.Types.ObjectId;
    parentComment: string | mongoose.Schema.Types.ObjectId | null;
    likes: string[] | mongoose.Schema.Types.ObjectId[];
    repliesCount: number;
}

const commentSchema = new Schema<IPostComment>({

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

export const Comment = mongoose.model('social_post_comments', commentSchema);
