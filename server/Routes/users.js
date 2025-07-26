import express,{application} from "express"
import * as users from '../Controller/users.js'

const router=express.Router();

router.get('/',users.getAllUser);
router.get('/getByPassword', users.getUserByPassword);
router.get('/getByName', users.getUsersByName);
router.get('/getUsersById', users.getUsersById);
router.get('/getDressForUser',users.getDressForUser);
router.get('/getUserByCity',users.getUserByCity);
router.put('/',users.updateUser);
router.post('/login',users.login);
router.post('/',users.addNewUser);

export default router;