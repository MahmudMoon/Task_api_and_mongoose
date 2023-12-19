const {Router} = require('express');
const mongooseHelper = require('../db/mongoDbHelper');

const router = Router();

router.get('/',(req, res, next)=>{
    mongooseHelper.getAllTasks()
    .then(result=>{
        res.status(200).json(result);
    }).catch(error=>{
        res.status(500).send(error);
    })
});

router.get('/:_id', (req, res, next)=>{
    let reqID = req.params._id;
    console.log(reqID);
    mongooseHelper.getFilteredTasks({_id: reqID})
    .then(result => {
        res.status(200).json(result);
    }).catch(error =>{
        res.status(500).send('Failed to get _id: '+reqID);
    })

})

router.post('/', (req, res, next)=>{
    let task = req.body;
    mongooseHelper.saveDocumentInMongoDb(task)
    .then(result=>{
        console.log('saved new task ', result);
        res.status(201).json({
            message: 'new task created'
        })
    }).catch(error=>{   
        console.log('failed to save task ', error.message);
        res.status(400).send(error.message);
    })
})





module.exports = router;