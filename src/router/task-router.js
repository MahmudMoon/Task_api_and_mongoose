const {Router} = require('express');
const mongooseHelper = require('../db/mongoDbHelper');
const authentication = require('../middlewares/authentication');

const router = Router();

router.get('/me' ,authentication.auth ,async (req, res, next) =>{
    try{
        let result = await mongooseHelper.getAllTasks(req.user._id);
        res.status(200).json(result);
    }catch(error){
        res.status(500).send(error);
    }
});

router.get('/count' ,authentication.auth ,async (req, res, next)=>{
    try{
        let result = await mongooseHelper.getTaskCount()
        console.log('total tasks: ', result);
        res.status(200).json({
            message: 'total tasks: '+ result
        })
    }catch(error){
        console.log('failed to count tasks ', error.message);
        res.status(500).send(error);
    }
})

router.get('/:_id', authentication.auth , async (req, res, next)=>{
    let reqID = req.params._id;
    console.log(reqID);
    try{
        let result = await mongooseHelper.getFilteredTasks({_id: reqID})
        res.status(200).json(result);
    }catch(error){
        res.status(500).send('Failed to get _id: '+reqID);
    }
})

router.post('/', authentication.auth ,  async (req, res, next)=>{
    let task = req.body;
    try{
        task.owner = req.user._id;
        let result = await mongooseHelper.saveDocumentInMongoDb(task)
        console.log('saved new task ', result);
        res.status(201).json({
            message: 'new task created'
        })
    }catch(error){
        console.log('failed to save task ', error.message);
        res.status(400).send(error.message);
    }
})

router.patch('/:_id' ,authentication.auth ,async (req, res, next)=>{
    let id = req.params._id;
    let updateableData = req.body;

    let updatableProperies = ['title', 'completed'];
    let requestedKeys = Object.keys(req.body);
    let validKeys = requestedKeys.every((update)=>{
        return updatableProperies.includes(update);
    })

    if(!validKeys){
        return res.status(400).json({
            message: 'Invalid key for update'
        })
    }

    try{
        let result = await mongooseHelper.updateTask(id, updateableData, req.user._id)
        console.log(result);
        if(result){
            res.status(200).json({
                message: 'task updated'
            })
        }else{
            res.status(403).json({
                message: 'Failed to update'
            })
        }
    }catch(error){
        console.log('failed to update task ', error.message);
        res.status(403).send(error.message);
    }
})

router.delete('/:_id',authentication.auth  , async (req, res, next)=> {
    let id = req.params._id;
    try{
        let beforeCount = await mongooseHelper.getTaskCount()
        console.log('before delete '+ beforeCount);
        let deleteResult = await mongooseHelper.deleteTask(id, req.user._id);
        console.log('result => ',deleteResult)
        if(deleteResult){
            res.status(200).json({
            message: 'task deleted'
            })
        }else{
            res.status(403).json({
            message: 'user not authorized to delete'
            })
        }
        let afterDelete = await mongooseHelper.getTaskCount();
        console.log('after delete '+ afterDelete);
    }catch(error){
        console.log('failed to delete task ', error.message);
        res.status(403).send(error.message);
    }
})





module.exports = router;