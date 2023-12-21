const User = require('../models/User');
const Task = require('../models/Task');
const bcryptjs = require('bcryptjs');

async function saveNewUser(userData){
    try{
        let user = new User(userData);
        await user.save();
        console.log(user);
        return user;
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


async function getAllTasks(id){
    try{
        //let tasks = Task.find({owner: id});
        let tasks = await User.findById(id).populate('tasks').exec()
        return tasks.tasks;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getFilteredTasks(taskFilter){
    try{
        let filteredTasks = Task.findOne(taskFilter).populate('owner').exec();
        console.log(filteredTasks);
        return filteredTasks;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function updateTask(id, task, user_id){
    try{
        let oldTask = await Task.findOne({_id: id, owner: user_id});
        console.log('old task', oldTask);
        if(!oldTask) throw new Error('You are not authorized to update this task');
        
        for (const key in task) {
            oldTask[key] = task[key];
        }
        console.log('after update', oldTask);
        await oldTask.save();
        return true;
    }catch(error){
        console.log('error:> ' ,error);
        throw error;
    }
}

async function updateUser(id, user){
    try{
        let oldUserData = await User.findById(id);
        console.log('old data', oldUserData);
        
        for (const key in user) {
            oldUserData[key] = user[key];
        }
        console.log('after update', oldUserData);
        await oldUserData.save();
       // let result = await User.findByIdAndUpdate(id, user , {new: true, runValidators: true})
        return true;
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

async function deleteTask(id, user_id){
    try{
        let task = await Task.findOne({_id: id, owner: user_id})
        console.log('task> ', task);
        if(!task) throw new Error('You are not authorized to delete this task');
        let result = await Task.deleteOne({_id: task._id})
        console.log('del>',result);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function deleteUser(id){
    try{
        await Task.deleteMany({owner: id})
        let result = await User.findOneAndDelete({_id: id})
        console.log(result);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function assistLogin(authData){
    try{
        let email = authData.email
        let user = await User.findOne({email})
        console.log('login user: ', user);
        if(!user) throw new Error('No valid user found');

        console.log('raw: ', authData.password);
        console.log('hash: ', user.password);

        try{
            let isValidUser = bcryptjs.compareSync(authData.password, user.password);
            console.log('isValidUser ', isValidUser)
            if(isValidUser) return user;
            else return undefined;
        }catch(error){
            console.log(error);
            throw error;
        }
        
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function addTokenToDb(token, id){
    try{
        let user = await User.findById(id);
        user.tokens.push({token});
        await user.save();
        return user;
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
    updateTask,
    updateUser,
    getUserCount,
    getTaskCount,
    deleteTask,
    deleteUser,
    assistLogin,
    addTokenToDb
}