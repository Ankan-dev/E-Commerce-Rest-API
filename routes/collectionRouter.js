const express=require('express')
const router=express.Router();
const {createCollection,getAllCollection, getCollectionById, updateCollection, deleteCollection}=require('../controllers/collectionController.js');
const authenticateAdmin=require('../middlewares/adminAuth.js');

router.post('/create-collection',authenticateAdmin,createCollection);
router.get('/get-all-collection',getAllCollection);
router.get('/get-collection-id/:id',getCollectionById);
router.post('/update-collection',authenticateAdmin,updateCollection);
router.delete('/delete-collection',authenticateAdmin,deleteCollection);

module.exports=router

