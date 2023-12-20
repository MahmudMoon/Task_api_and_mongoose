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
app.use('/login', authRouter);


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

function testCreate(){
   let hash = bcryptjs.hashSync('monn1234', 8);
   console.log('hash>> ', hash);
   return hash
}

function compareTest(hash){
    return bcryptjs.compareSync('monn1234', "$2a$08$ECREAYOOaRdZmcKGv4FkmexB.11vHcAUmF7lTf7PuyGNP8Q/T/5r6");
}


console.log(compareTest(testCreate()));

// console.log(compareTest(testCreate()));

// console.log(compareTest(testCreate()));

// console.log(compareTest(testCreate()));