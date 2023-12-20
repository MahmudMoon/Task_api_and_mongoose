const mongoDbHelper = require('../db/mongoDbHelper');
const { Router } = require('express');
const jwt = require('../jwt/jwt');
const authentication = require('../middlewares/authentication');

const router = Router();

router.get('/login', async (req, res, next)=>{
    let authData = req.body
    try{
        let user = await mongoDbHelper.assistLogin(authData);
        console.log('login result ', user);
        if(user){
            let token = jwt.createJWTToken(user._id)
            console.log(token);
            let updatedUser = await mongoDbHelper.addTokenToDb(token, user._id);
            let varificationRes = await jwt.varifyJWTtoken(token)
            if(varificationRes){
                res.status(200).json({
                    updatedUser,
                    token
                }); 
            }else{
                res.status(200).send('invalid password'); 
            }
        }else{
            res.status(200).send('invalid password user null');      
        }
    }catch(error){
        console.log('failed to validate user ', error.message);
        res.status(500).send(error.message);
    }
    
})

router.post('/logout', authentication.auth, async (req, res, next)=>{
    try{
        console.log('b=> ',req.user.tokens.length);
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token != req.token;
        })
        console.log('a=> ',req.user.tokens.length);
        await req.user.save();
        res.status(200).send('logged out from current session');
    }catch(error){
        console.log('failed to logout user ', error.message);
        res.status(500).send(error.message);
    }
})


router.post('/logout-all', authentication.auth, async (req, res, next)=>{
    try{
        console.log('b=> ',req.user.tokens.length);
        req.user.tokens = [];
        console.log('a=> ',req.user.tokens.length);
        await req.user.save();
        res.status(200).send('logged out from all session');
    }catch(error){
        console.log('failed to logout user ', error.message);
        res.status(500).send(error.message);
    }
})


module.exports = router;
