const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        validate: { 
        validator: function(value){
            return value.length > 0
        },
        message: 'enter valid user name'
    }},
    email: {
        type: String,
        require: true,
        unique: true,
        validate: {
            validator: function(value){
                return validator.isEmail(value);
            },
            message: 'Enter valid email'
        }
    },
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
    }},

    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
   })

   userSchema.pre('save', async function(next){
    let user = this;
    if(user.isModified('password')){
        user.password = bcryptjs.hashSync(user.password, 8);
        console.log(user.password);
    }
    next();
   });


   const User = new mongoose.model('User', userSchema);
   module.exports = User;