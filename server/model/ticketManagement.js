const mongoose = require('mongoose')
const ticketMessageSchema = require('./ticketMessage');
const Schema = mongoose.Schema


const ticketSchema = new Schema({
     employerEmail:{
        type:String,
        trim:true,
        required: true

     } ,

     employerName:{
        type:String,
        trim:true,
        required: true

     } ,

    employerID:{    
        type:String,
        trim:true
    },
    ticketID :{
        type:String,
        trim:true
    },
    Subject: {
        type: String,
        trim: true,
        required: true
    },
    Description: {
        type: String,
        trim: true,
        required: true
    },
    Category: {
        type: String,
        trim: true,
        required: true
    },
    Priority: {
        type: String,
        trim: true,
        required: true,
        enum: ['Low', 'Medium', 'High', 'Critical'] 
    },
    Attachments: {
        type: String,
       
        
    },
    ticketStatus:{
        type:String,
        default:"Open",
        
        enum: ["Open",'In Progress', 'Resolved', 'Closed'] 

    },
    messages: [ticketMessageSchema],

},{timestamps:true})

module.exports = mongoose.model("employerTickets",ticketSchema)