import express from 'express'
import * as dress from '../Controller/dress.js'
import upload from '../MiddleWare/upload.js'

const router=express.Router();

router.get('/', dress.getAllDress);
router.get('/getById', dress.getById);
router.get('/getByColor', dress.getByColor);
router.get('/getBySize', dress.getBySize);
router.get('/getByCountSize',dress.getByCountSize);
router.get('/getByPrice',dress.getByPrice);
router.get('/getDressByCity',dress.getDressByCity);
router.get('/getByFeedback',dress.getByFeedback);
router.post('/',upload.single('image'), dress.addNewDress);
router.post('/addTalkBack',dress.addTalkBack);
router.post('/addFeedBack',dress.addFeedBack);
router.put('/',upload.single('image'),dress.updateDress);


export default router;