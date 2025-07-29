const express=require('express');
const router=express.Router();

const {getTodayPrompt} =require('../controllers/promptController');

router.get('/today',getTodayPrompt);
module.exports=router;