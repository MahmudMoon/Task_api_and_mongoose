const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        validate: { 
        validator: function(value){
            return value.length > 10
        },
        message: 'enter valid user name'
    }},
    password: {
        type: String,
        require: true,
        validate: {
            validator: function(value){
                return value!='password' && value.length >= 8
            },
            message: 'Enter a valid password'
        }
    },
    age: {type: Number,
        validate:{
        validator: function(value){
            return value>=18;
        },
        message: 'user age should be greater that 18'
    }}
   })

   const User = new mongoose.model('User', userSchema);
   module.exports = User;