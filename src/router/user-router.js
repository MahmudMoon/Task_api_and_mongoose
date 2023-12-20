const {Router} = require('express');
const mongooseHelper = require('../db/mongoDbHelper');

const router = Router();

router.get('/', async (req, res, next)=>{
    try{
        let result = await mongooseHelper.getAllUsers()
        res.status(200).json(result);
    }catch(error){
        res.status(500).send(error);
    }
});

router.get('/count', async (req, res, next)=>{
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

router.get('/:_id',async (req, res, next)=>{
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
            let result = await mongooseHelper.saveNewUser(user);
            console.log('saved new user ', result);
            res.status(201).json({
                message: 'new user created'
            })
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

router.patch('/:_id', async (req, res, next)=>{
    let id = req.params._id;
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


router.delete('/:_id', async (req, res, next)=>{
    let id = req.params._id;
    try{
        let beforeCount = await mongooseHelper.getUserCount()
        console.log('before delete '+ beforeCount);
        let deleteResult = await mongooseHelper.deleteUser(id);
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