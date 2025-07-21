const express=require('express');
const router=express.Router();

const protect=require("../middleware/authMiddleware");
const {createJournal,getMyJournals,updateJournal,deleteJournal}=require('../controllers/journalController');

router.post('/',protect,createJournal);
router.get('/',protect,getMyJournals);
router.put('/:id',protect,updateJournal);
router.delete('/:id',protect,deleteJournal);

module.exports=router;