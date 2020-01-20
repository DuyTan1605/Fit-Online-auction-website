var path = require('path');
// var http = require('http');

var express = require('express');
var session = require('express-session');
// var fileStore = require('session-file-store')(session);
var MySQLStore = require('express-mysql-session')(session);

var exphbs = require('express-handlebars');
var exphbs_sections = require('express-handlebars-sections');

var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var morgan = require('morgan');
//var mustache = require('mustache');
var moment = require('moment');
var wnumb = require('wnumb');
var dateFormat = require('dateformat');
var layoutRoute = require('./controllers/_layoutRoute');
var homeRoute = require('./controllers/homeRoute');
var productRoute = require('./controllers/productRoute');
var accountRoute = require('./controllers/accountRoute');
var cartRoute = require('./controllers/cartRoute');
var managerRoute = require('./controllers/managerRoute');
var searchRoute = require('./controllers/searchRoute');
var app = express();

//
// logger

app.use(morgan('tiny'));

//
// view engine

app.engine('hbs', exphbs({
    extname: 'hbs',
    // defaultLayout: 'main',
    // layoutsDir: 'views/layouts/',
    // partialsDir: 'views/partials/',
    helpers: {
        section: exphbs_sections(),
        getName:function(name)
        {
            if(name!=null)
            return name.split(" ")[name.split(" ").length-1];
            return " ";
        },
        isShort:function(name)
        {
            if(name.length<=33)
                return '<div style="height:15.5px"></div>'
           
        }
        ,
        now: function() {
            return moment().format('D/M/YYYY - HH:mm');
        },
        checkExpire:function(date)
        {
           if(timeRemain(date)!="")
           return true;
           return false;
        }
        ,
        formatDay:function(n)
        {
            return dateFormat(n, "dddd, mmmm dS, yyyy");
        },
        formatNumber: function(n) {
            var nf = wnumb({
                thousand: ','
            });
            return nf.to(n);
        },
        timeRemain: function(date) {
            date=new Date(date);
           
            var timeDiff = -moment()+date.getTime();
            
            var string = "";
            if (timeDiff > 86400000) {
                string += Math.floor(timeDiff / 86400000);
                string += " ngày ";
                timeDiff = timeDiff % 86400000;
            }
            if (timeDiff > 3600000) {
                string += Math.floor(timeDiff / 3600000);
                string += " giờ ";
                timeDiff = timeDiff % 3600000;
            }
            if (timeDiff > 60000) {
                string += Math.floor(timeDiff / 60000);
                string += " phút";
            }
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
           // return string.substring(0, 14);
           return string==""?"Đã kết thúc":string;
        },
        timeRemain1: function(date) {
            date=new Date(date);
           
            var timeDiff = -moment()+date.getTime();
            
            var string = "";
            if (timeDiff > 86400000) {
                if(Math.floor(timeDiff/86400000)>=1)
                {
                    return Math.floor(timeDiff / 86400000)+" ngày nữa";
                }
                string += Math.floor(timeDiff / 86400000);
                string += " ngày ";
                timeDiff = timeDiff % 86400000;
            }
            if (timeDiff > 3600000) {
                if(Math.floor(timeDiff/3600000) && Math.floor(timeDiff/86400000)==0)
                {
                    return Math.floor(timeDiff / 3600000)+" giờ nữa";
                }
                string += Math.floor(timeDiff / 3600000);
                string += " giờ ";
                timeDiff = timeDiff % 3600000;
            }
            if (timeDiff > 60000) {
                if(Math.floor(timeDiff/60000) && Math.floor(timeDiff/3600000)==0 && Math.floor(timeDiff/86400000)==0 )
                {
                    return Math.floor(timeDiff / 60000) +" phút nữa";
                }
                string += Math.floor(timeDiff / 60000);
                string += " phút";
            }
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
           // return string.substring(0, 14);
           return string==""?"Đã kết thúc":string;
        }
        ,
        sub: function(i1, i2) {
            var i = +i1 - +i2;
            return i;
        },
        add: function(i1, i2) {
            var i = +i1 + +i2;
            return i;
        },
        shortDateTime: function(datetime) {
            var full = datetime.toString();
            var dt = full.substring(0, 24);
            return dt;
        },
        isEqual: function(val1, val2, options) {
            if (val1 === val2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        isNotEqual: function(val1, val2, options) {
            if (val1 !== val2) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
        ,
        isNewProduct: function(date) {
            date=new Date(date);
           var timeDiff = moment()-date.getTime();
           console.log(timeDiff);
           if (timeDiff <= 3600000) {
           return "NEW !!"
        }
        return "";
        },
        isNewProduct1: function(date) {
            date=new Date(date);
           var timeDiff = moment()-date.getTime();
           console.log(timeDiff);
           if (timeDiff <= 3600000) {
          return true;
        }
       return null;
        }
        ,
        hideRealUserName: function(name) {
            if (name != null) {
                var nameStr = name.toString();
                var hidden = "***" + nameStr.substring(nameStr.length - 3, nameStr.length);
                return hidden;
            }
        }
    }
}));
app.set('view engine', 'hbs');

//
// static files & favicon

app.use(express.static(
    path.resolve(__dirname, 'public')
));

app.use(favicon(path.join(__dirname, 'public', 'logo_favicon.ico')));

//
// body-parser

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

//
// session

app.use(session({
    
    secret:'6LeF_8cUAAAAABrm_6vGbhunuFnARkZ0lLw83pDc',
    resave: false,
    saveUninitialized: true,
    // store: new fileStore()
    store: new MySQLStore({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '123',
        database: 'daugia',
        createDatabaseTable: true,
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    }),
}));

//
// controllers

app.use(layoutRoute);
app.use('/home', homeRoute);
app.use('/search', searchRoute);
app.use('/product', productRoute);
app.use('/account', accountRoute);
app.use('/cart', cartRoute);
app.use('/manager', managerRoute);

app.get('/', function(req, res) {
    res.redirect('/home');
});
app.listen(process.env.PORT || 3000);





