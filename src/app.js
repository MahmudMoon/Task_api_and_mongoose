require('./db/mongoose');
const express = require('express');
const taskRouter = require('./router/task-router');
const userRouter = require('./router/user-router');

const port = process.env.PORT || 3000;

const app = express();

//adding express middlewares
app.use(express.json());
app.use(express.urlencoded());

//adding router middlewares
app.use('/user', userRouter);
app.use('/task', taskRouter);


app.listen(port, ()=>{
    console.log('server connected');
})
