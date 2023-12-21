const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true, 
        validate: {
            validator: function (value){
                return value.length>10;
            },
            message: 'Title should be at least 10 characters'
        }
    },
    completed: {
        type: Boolean,
        require: false,
        default: false
    },
    owner: {
        //type: mongoose.Schema.Types.ObjectId,
        type: String,
        require: true,
        ref: 'User',
    }
})   

taskSchema.methods.toJSON = function(){
    let task = this;
    let taskObj = task.toObject();
    delete taskObj.__v;
    delete taskObj.owner.tokens
    delete taskObj.owner.password
    delete taskObj.owner.__v
    return taskObj;
}


const Task = new mongoose.model('Task', taskSchema);
module.exports = Task;
