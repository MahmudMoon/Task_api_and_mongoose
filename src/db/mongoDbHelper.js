const User = require('../models/User');
const Task = require('../models/Task');

async function saveNewUser(userData){
    try{
        let user = new User(userData);
        await user.save();
        console.log('user saved');
        return true;
    }catch(error){
        console.log(error.message);
        throw error;
    }
}


async function saveDocumentInMongoDb(taskCreated){
    try{
        if(Object.keys(taskCreated).length==0) throw new Error('Bad request body');
        let task = new Task(taskCreated);
        await task.save()
        return true;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getAllUsers(){
    try{
        let users = await User.find({});
        console.log(users);
        return users;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getFilteredUsers(userFilter){
    try{
        let filteredUsers = User.find(userFilter)
        console.log(filteredUsers);
        return filteredUsers;
    }catch(error){
        console.log(error);
        throw error;
    }
}


async function getAllTasks(){
    try{
        let tasks = Task.find({});
        console.log(tasks);
        return tasks;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getFilteredTasks(taskFilter){
    try{
        let filteredTasks = Task.find(taskFilter)
        console.log(filteredTasks);
        return filteredTasks;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function changeCompleteStausOfTask(id, status){
    try{
        let result = await Task.findByIdAndUpdate(id, {completed: status})
        let updatedResult = await Task.findById(id).exec();
        console.log(updatedResult);
        return updatedResult.completed == status;
    }catch{
        console.log(error);
        throw error;
    }
}

async function changeAgeofUser(id, age){
    try{
        let result = await User.findByIdAndUpdate(id, {age: age})
        let updatedResult = await User.findById(id).exec();
        console.log(updatedResult);
        return updatedResult.age == age;
    }catch{
        console.log(error);
        throw error;
    }
}

async function getUserCount(){
    try{
        let count = await User.countDocuments()
        console.log(count);
        return count;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getTaskCount(){
    try{
        let count = await Task.countDocuments()
        console.log(count);
        return count;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function deleteTask(id){
    try{
        let result = await Task.findByIdAndDelete(id).exec()
        console.log(result);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}


module.exports = {
    saveDocumentInMongoDb,
    saveNewUser,
    getAllTasks,
    getAllUsers,
    getFilteredTasks,
    getFilteredUsers,
    changeCompleteStausOfTask,
    changeAgeofUser,
    getUserCount,
    getTaskCount,
    deleteTask
}