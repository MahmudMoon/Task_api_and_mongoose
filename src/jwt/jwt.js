const jwt = require('jsonwebtoken');

const createJWTToken = (id) =>{
    return jwt.sign({id}, '81464f1bc9ff31caeafc6425721d8920254a21e64ce49b9aa2ced7616f26fb68', {expiresIn: '10d'});
}

const varifyJWTtoken = async (token) => {
   return await jwt.verify(token, '81464f1bc9ff31caeafc6425721d8920254a21e64ce49b9aa2ced7616f26fb68')
}

module.exports = {
    createJWTToken,
    varifyJWTtoken
}