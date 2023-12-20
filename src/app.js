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
