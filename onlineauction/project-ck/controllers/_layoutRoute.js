var Q = require('q');
var category = require('../models/category');
var cart = require('../models/cart');
var product=require('../models/product');
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dreamleage1999@gmail.com',
        pass: '0949844063'
    }
});
module.exports = function(req, res, next) {
  
    console.log("req session is "+ req.session.isLogged);
    if (req.session.isLogged == undefined) {
        req.session.isLogged = false;
    }
    
       product.isExpireAndSent().then(function(res)
       {
           console.log(res.length);
        for(var i=0;i<res.length;i++)
        {
            var mailOptions = {
                from: 'dreamleage1999@gmail.com', // sender address
                to: res[i].emailseller, // list of receivers
                subject: "Thông báo hết hạn sản phẩm", // Subject line
                text: res[i].nguoigiugia==null?"Sản phẩm"+res[i].tensp+"chưa được đấu giá":"Sản phẩm "+ res[i].tensp+" được trả giá "+res[i].giahientai+" VND bởi tài khoản " + res[i].emailbidder, // plaintext body
            };
            console.log(mailOptions);

            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }

                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
            });
            if(res[i].nguoigiugia!=null)
            {
                mailOptions={
                    from: 'dreamleage1999@gmail.com', // sender address
                    to: res[i].emailbidder, // list of receivers
                    subject: "Thông báo đấu giá thành công", // Subject line
                    text: "Bạn đã thắng đấu giá sản phẩm "+ res[i].tensp+" với giá cuối cùng là "+ res[i].giahientai+" VND", // plaintext body
                }
                console.log(mailOptions);
                smtpTransport.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
    
                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });
                

            }

        }

       })
//sửa lại .then dc
       
    Q.all([category.loadAllDad(),category.loadAll()])
    .spread(function(catListDad,catList) {
       
        var catListDadFinal=[];
        for(var i=0;i<catListDad.length;i++)
        {
         var temp={};
         temp.id=catListDad[i].id;
         temp.tendanhmuc=catListDad[i].tendanhmuc;
         var danhmucon=[];
             for(var j=0;j<catList.length;j++)
             {
                 var temp2={};
                 if(catListDad[i].id==catList[j].id_danhmuccha)
                 {
                    temp2.id=catList[j].id;
                    temp2.tendanhmuc=catList[j].tendanhmuc;
                    danhmucon.push(temp2);
                 }
             }
             temp.listdanhmuccon=danhmucon;
             catListDadFinal.push(temp);
        }

        res.locals.layoutModels = {
            categories: catList,
            isLogged: req.session.isLogged,
            account: req.session.account,
            catListDadFinal:catListDadFinal,
       };
        console.log(res.locals.layoutModels.account);
        next();
    });
};