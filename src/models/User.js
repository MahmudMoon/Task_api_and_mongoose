const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const Task = require('./Task');

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

   //create a virtual property to set one to many relation between User <==> Task collections
   userSchema.virtual('tasks', {
        ref: 'Task',
        localField: '_id',
        foreignField: 'owner'
   })

   //filter out the properties that user should not see ,in response
   userSchema.methods.toJSON = function() {
        let user = this;
        let userObject = user.toObject();
        delete userObject.password;
        delete userObject.tokens;
        delete userObject.__v
        return userObject;
   }

   //execute this function before saving each user document
   userSchema.pre('save', async function(next){
    let user = this;
    if(user.isModified('password')){
        user.password = bcryptjs.hashSync(user.password, 8);
        console.log(user.password);
    }
    next();
   });

//    userSchema.pre('remove', async function(next){
//     console.log('task delete called');
//     let user = this;
//     try{
//         let res = await Task.deleteMany({owner: user._id});
//         console.log('task delete: ', res);
//     }catch(error){
//         console.log('task delete ', error);
//     }
//     next();
//    })


   const User = new mongoose.model('User', userSchema);
   module.exports = User;