const mongoose=require('mongoose');

const expenseSchema= new mongoose.Schema({
    amount:Number,
    description:String,
    type:String,
    category:String,
    date: {
    type: Date,
    default: Date.now
    },
    userId: {type:mongoose.Schema.Types.ObjectId,ref:'User'}
});

module.exports=mongoose.model('Expense',expenseSchema);