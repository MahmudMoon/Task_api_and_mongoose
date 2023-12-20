const jwt = require('../jwt/jwt');
const User = require('../models/User');

module.exports = {
    auth: async (req, res, next)=>{
        try{
            console.log('.... Middle ware start ....')
            let token = req.header('Authorization').replace('Bearer ', '');
            let data = await jwt.varifyJWTtoken(token)
            console.log(data);
            let user = await User.find({_id: data.id, 'tokens.token': token})
            console.log(user[0]);
            if(!user[0]){
                throw new Error('No valid user found');
            }
            console.log('.... Middle ware end ....')
            req.token = token;
            req.user = user[0];
            next();
        }catch(error){
            console.log('auth middle ware error ', error);
            res.status(500).send('error authorizations');
        }
    }
}