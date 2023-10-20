import mongoose from "mongoose";

const messagesColletion = "messages" 

const messagesSchema = new mongoose.Schema({
    user: {type: String, max: 100, required:true},
    message: { type: String, max:100, required:true},
})

export const messageModel = mongoose.model(messagesColletion,messagesSchema)