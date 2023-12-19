const mongoose = require('mongoose');

(async function initMongoose(){
    try{
       let connection = await mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
            useNewUrlParser: true,
            autoIndex: true
        })
        console.log('mongo db connected')
    }catch(error){
        console.log('mongo db connection failed ', error.message);
    }
})();




