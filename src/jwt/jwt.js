const jwt = require('jsonwebtoken');

const createJWTToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET_KEY , {expiresIn: '10 days'});
}

const varifyJWTtoken = async (token) => {
   return await jwt.verify(token, process.env.JWT_SECRET_KEY)
}

module.exports = {
    createJWTToken,
    varifyJWTtoken
}