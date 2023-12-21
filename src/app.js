require('./db/mongoose');
const express = require('express');
const crypto = require('crypto');
const taskRouter = require('./router/task-router');
const userRouter = require('./router/user-router');
const authRouter = require('./router/auth-router');

const bcryptjs = require('bcryptjs');

const port = process.env.PORT || 3000;

const app = express();

//adding express middlewares
app.use(express.json());
app.use(express.urlencoded());

//adding router middlewares
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/auth', authRouter);


app.use((error, req, res, next)=>{
    if(error){
        res.status(error.status||500).send(error.message);
    }
})


app.listen(port, ()=>{
    console.log('server connected');
})


// const fs =  require('fs');

// (function generate(){
//     let randomBuffer = crypto.randomBytes(32);
//     let randomString = randomBuffer.toString('hex');
//     console.log(randomString);

//     fs.writeFileSync('random.txt', randomString);
//     return randomString
// })()




// const Task = require('./models/Task');

// //6583c48baedfc56ddf3bbd67
// // async function testRelation(){
// //     let task = await Task.findById({_id: '6583c48baedfc56ddf3bbd67'}).populate('owner').exec();
// //     //console.log(task);
// //    // let res = await task.populate('owner').exec();
// //     console.log(task.owner);
// // }

// const User = require('./models/User');
// async function testRelation(){
//     let user = await User.findById({_id: '6583c107741d1a0a532690bf'}).populate('tasks').exec();
//     //console.log(task);
//    // let res = await task.populate('owner').exec();
//     console.log(user.tasks);
// }

// testRelation();