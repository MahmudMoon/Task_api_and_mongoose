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
    }
})   


const Task = new mongoose.model('Task', taskSchema);
module.exports = Task;
