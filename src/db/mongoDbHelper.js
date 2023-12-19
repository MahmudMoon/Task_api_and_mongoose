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


module.exports = {
    saveDocumentInMongoDb,
    saveNewUser,
    getAllTasks,
    getAllUsers,
    getFilteredTasks,
    getFilteredUsers
}