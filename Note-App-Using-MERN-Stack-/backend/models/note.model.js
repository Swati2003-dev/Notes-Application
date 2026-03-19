import mongoose from "mongoose";
 
const noteSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    category:{ //*
        type:String, //*
        default:"General" //*
    }, //*
    reminderAt:{ //*
        type:Date, //*
        default:null //*
    }, //*
    collaborators: { //*
        type: [String], //*
        default: [] //*
    }, //*
    tags:{
        type:[String],
        default:[]
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    userId:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Note=mongoose.model("Note",noteSchema)

export default Note;