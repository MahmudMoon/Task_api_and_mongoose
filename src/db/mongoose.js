const mongoose = require('mongoose');

(async function initMongoose(){
    try{
       let connection = await mongoose.connect(process.env.MONGO_DB_URL, {
            useNewUrlParser: true,
            autoIndex: true
        })
        console.log('mongo db connected at url ', process.env.MONGO_DB_URL);
    }catch(error){
        console.log('mongo db connection failed ', error.message);
    }
})();




