const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 1000
           // useUnifiedTopology: true
//            useFindAndModify: false not supported by latest version of mongoose
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }

};

module.exports=connectDB; 