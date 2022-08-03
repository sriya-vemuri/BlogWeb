const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db')

//Load config
dotenv.config({path : './config/config.env'});

//passport config
require('./config/passport')(passport);

connectDB();

const app= express();

//Body Parser
app.use(express.urlencoded({extended:false}));
//app.use(express.json());

//method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  })
);

//Logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev')); 
}

//handlebar helpers
const {formatDate,stripTags,truncate,editIcon,select} = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs.engine({
    helpers: {formatDate,stripTags,truncate,editIcon,select},
    layoutsDir: 'views/layout',
    defaultLayout: 'main',
    extname: '.hbs'
  })
);
//app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
//app.set('views', 'views');


//Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl:process.env.MONGO_URI})
  }));

//   const store = new MongoStore({
//     uri: process.env.MONGO_URI 
// })


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global var
app.use(function(req,res,next){
   res.locals.user = req.user||null;
   next(); //vv imp
   
 });

//static folder
app.use(express.static(path.join(__dirname,'public')));



//routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/blogs',require('./routes/blogs'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));