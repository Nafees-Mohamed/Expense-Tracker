const express=require('express');
const router=express.Router();
const expenses=require('../models/Expense');

router.get('/',async(req,res)=>{
     try{
            let filter={};
            if(req.query.category){
                filter.category=req.query.category;
            }
            if(req.query.type){
                filter.type=req.query.type;
            }

            const filteredexpense=await expenses.find({...filter,userId:req.userId});
            res.json(filteredexpense);
    }catch(error){
        res.status(500).json({ message: 'Error updating', error });
    }
 });
  

router.post('/',async (req,res)=>{
    const {amount,description,type,category}=req.body;
    if (!amount || !type || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const expense=new expenses({...req.body,userId:req.userId});
    await expense.save();
    res.json(expense);
});

router.put('/:id', async (req, res) => {
    try {
        const updated = await expenses.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },  
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating', error });
    }
});

router.delete('/:id',async(req,res)=>{
    try{
        const deleted=await expenses.findByIdAndDelete(req.params.id);
        if(!deleted){
            return res.status(404).json({message:"Transaction id not Found..."});
        }
        res.json({message:'Deleted'});
    }
    catch(error){
        res.status(500).json({message:'Error deleting',error});
    }
    
});

module.exports=router;