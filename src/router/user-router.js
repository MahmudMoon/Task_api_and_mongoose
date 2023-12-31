const {Router} = require('express');
const mongooseHelper = require('../db/mongoDbHelper');
const jwt = require('../jwt/jwt');
const authentication = require('../middlewares/authentication');

const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/User');

const router = Router();

router.get('/', authentication.auth , async (req, res, next)=>{
    try{
        let result = await mongooseHelper.getAllUsers()
        res.status(200).json(result);
    }catch(error){
        res.status(500).send(error);
    }
});

router.get('/me', authentication.auth, async (req, res, next)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        res.status(500).send(error);
    }
})

router.get('/count', authentication.auth , async (req, res, next)=>{
    try{
        let result = await mongooseHelper.getUserCount();
        console.log('total user: ', result);
        res.status(200).json({
            message: 'total user: '+ result
        })
    }catch(error){
        console.log('failed to count users ', error.message);
        res.status(500).send(error);
    }
})

router.get('/:_id', authentication.auth, async (req, res, next)=>{
    let reqID = req.params._id;
    console.log(reqID);
    try{
        let result = await mongooseHelper.getFilteredUsers({_id: reqID})
        res.status(200).json(result);
    }catch(error){
        res.status(500).send('Failed to get _id: '+reqID);
    }
})

router.post('/', async (req, res, next)=>{
    let user = req.body;
    console.log(user);
    if(Object.keys(user).length>0){
        try{
            let returnedUser = await mongooseHelper.saveNewUser(user);
            console.log('saved new user ', returnedUser);
            let token = jwt.createJWTToken(returnedUser._id);
            returnedUser.tokens.push({token});
            await returnedUser.save();
            res.status(201).json({
                user: returnedUser,
                token
            });
        }catch(error){
            console.log('failed to save user ', error.message);
            res.status(400).send(error);
        }
    }else{
        res.status(400).json({
            message: 'provide user information'
        })
    }
});


const upload = multer({
    limits: {
        fileSize :  1024 * 1024,
    },
    fileFilter: (req, file, cb)=>{
        if(!file.originalname.endsWith('.jpg') && !file.originalname.endsWith('.jpeg') && !file.originalname.endsWith('.png')){
            return cb(new Error('please upload a jpg/jpeg/png file', undefined));
        }
        cb(undefined, true);
    }
})

router.post('/me/avatar', authentication.auth,
 upload.single('avatar') , async (req, res, next)=>{
    let buffer = await new sharp(req.file.buffer)
                .resize({width: 250, height: 250})
                .png()
                .toBuffer();

    req.user.avatar = buffer;
    req.user.save();
    res.status(200).send('image uploaded')
})

router.delete('/me/avatar', authentication.auth, async (req, res, next)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send('avater cleared');
    }catch(error){
        console.log('failed to delete user avater', error.message);
        res.status(500).send(error.message);
    }
   
})

router.get('/:_id/avatar', authentication.auth , async (req, res, next)=>{
    try{
        let user = await User.findById(req.params._id);
        if(!user || !user.avatar){
            throw new Error('No profile avatar found')
        }
        res.set('Content-Type','image/png');
        res.status(200).send(user.avatar);

    }catch(error){
        console.log(error);
        res.status(error.status||404).send(error.message);
    }
})



router.patch('/me', authentication.auth, async (req, res, next)=>{
    let id = req.user._id;
    let updatableData = req.body;
    console.log(id, updatableData);
    let updatableProperies = ['name', 'password' ,'age'];
    let requestedKeys = Object.keys(updatableData);
    let isValidKey = requestedKeys.every((update)=>{
        return updatableProperies.includes(update);
    })
    if(!isValidKey){
        return res.status(400).json({
            message: 'Invalid key found in request body'
        })
    }
    try{
        let result = await mongooseHelper.updateUser(id, updatableData)
        if(result){
            res.status(200).json({
                message: 'user updated'
            })
        }else{
            res.status(500).json({
                message: 'Failed to update user'
            })
        }
    }catch(error){
        console.log('failed to update user ', error.message);
        res.status(500).send(error.message);
    }
})


router.delete('/me', authentication.auth, async (req, res, next)=>{
    try{
        let beforeCount = await mongooseHelper.getUserCount()
        console.log('before delete '+ beforeCount);
        let deleteResult = await mongooseHelper.deleteUser(req.user._id);
        console.log('result => ',deleteResult)
        if(deleteResult){
            res.status(200).json({
            message: 'User deleted'
            })
        }else{
            res.status(500).json({
            message: 'Failed to delete user'
            })
        }
        let afterDelete = await mongooseHelper.getUserCount();
        console.log('after delete '+ afterDelete);
    }catch(error){
        console.log('failed to delete user ', error.message);
        res.status(500).send(error.message);
    }
})

module.exports = router;