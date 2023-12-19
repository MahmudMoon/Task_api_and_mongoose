const {Router} = require('express');
const mongooseHelper = require('../db/mongoDbHelper');

const router = Router();

router.get('/',(req, res, next)=>{
    mongooseHelper.getAllUsers()
    .then(result=>{
        res.status(200).json(result);
    }).catch(error=>{
        res.status(500).send(error);
    })
});

router.get('/:_id', (req, res, next)=>{
    let reqID = req.params._id;
    console.log(reqID);
    mongooseHelper.getFilteredUsers({_id: reqID})
    .then(result => {
        res.status(200).json(result);
    }).catch(error =>{
        res.status(500).send('Failed to get _id: '+reqID);
    })
})

router.post('/', (req, res, next)=>{
    let user = req.body;
    console.log(user);
    if(Object.keys(user).length>0){
        mongooseHelper.saveNewUser(user)
        .then(result=>{
            console.log('saved new user ', result);
            res.status(201).json({
                message: 'new user created'
            })
        }).catch(error=>{   
            console.log('failed to save user ', error.message);
            res.status(400).send(error);
        })
    }else{
        res.status(400).json({
            message: 'provide user information'
        })
    }
});

module.exports = router;