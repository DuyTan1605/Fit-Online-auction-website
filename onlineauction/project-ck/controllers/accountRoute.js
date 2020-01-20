var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var multer = require('multer');
var fs = require('fs');
var restrict = require('../middle-wares/restrict');
var account = require('../models/account');
var product = require('../models/product');
var mkdirp = require('mkdirp');
var mv = require('mv');
var mime = require('mime');
var srcdir = './public/images/temp';
var destdir = './public/images/sp/';
var accountRoute = express.Router();
var name = ['main_thumbs', 'main', '1_thumbs', '1'];
var count = -1;
var bcrypt=require('bcryptjs');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        mkdirp(srcdir, function(err) {
            console.log('created temp folder');
        });
        cb(null, srcdir);
    },
    filename: function(req, file, cb) {
        count++;
        if (count > 3) {
            count = 0;
        }

        cb(null, name[count] + '.' + mime.extension(file.mimetype));
    }
})

var upload = multer({ storage: storage });
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dreamleage1999@gmail.com',
        pass: '0949844063'
    }
});
// accountRoute.get('/validate',function(req,res){
//     if(req.session.isLogged==false)
//            { res.redirect('/home');
// }   
//     else
//         res.render('account/validate');
// });
// accountRoute.post('/validate',function(req,res)
// {
//     console.log("is"+ res.locals.layoutModels.account.id);
//     if(req.body.validate=="123")
//     {
//         var entity={id:res.locals.layoutModels.account.id};
//         account.updateStatus(entity).then(function(account)
//         {
//             res.render('account/validate', {
//                 layoutModels: res.locals.layoutModels,
//                 showError: true,
//                 errorMsg: 'Xác nhận tài khoản thành công'
//             });
//         });
      
//     }
    
//     res.render('account/validate', {
//         layoutModels: res.locals.layoutModels,
//         showError: true,
//         errorMsg: 'Mã xác thực không đúng.'
//     });
   
    
// })
accountRoute.get("/rePass",function(req,res)
{
    res.render("account/rePass",
    {
        showError:req.session.showError,
        errorMsg:req.session.errorMsg
    });
})

accountRoute.post("/rePass",function(req,res)
{
   console.log(req.body.email);
   var mailOptions = {
    from: 'dreamleage1999@gmail.com', // sender address
    to: req.body.email, // list of receivers
    subject: "Thông báo reset mật khẩu", // Subject line
    text: "Tài khoản bạn đã được reset mậu khẩu là: 77779999", // plaintext body
};
     var bcrypt = require('bcryptjs');
      var salt=salt=bcrypt.genSaltSync(10);
    var newPW=bcrypt.hashSync("77779999",salt)+salt;
    
    newPW=newPW.replace(/&#x2F;/g,"/");
    var pw = {
        id: req.body.email,
        newPW: newPW
    };
   
    account.setNewPass(pw).then(function(result) {
       
        if (result>0) {
            
    
            res.render('account/rePass', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Thông tin mật khẩu reset đã gởi về email'
            });
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: " + response.message);
                }});
        } else {
            res.render('account/rePass', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Tài khoản email không tồn tại'
            });
        }

    });

    

})

accountRoute.get('/login', function(req, res) {
    if (req.session.isLogged === true) {
        res.redirect('/home');
    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});


accountRoute.get('/watching', restrict, function(req, res) {
    account.getWatchingList(res.locals.layoutModels.account.id).then(function(rows) {
        console.log(rows);
        res.render('account/watchingList', {
            layoutModels: res.locals.layoutModels,
            isEmpty: rows.length > 0 ? false : true,
            rows: rows
        });
    });
});
accountRoute.post('/watching?x=',function(req,res)
{
   console.log("aaaaa");
})
//2
accountRoute.post('/login', async function(req, res) {

   
  
    const temp=await account.loadAccountbyEmail(req.body.email);
   
      var bcrypt = require('bcryptjs');
      var salt
      if(temp!=null)
      {
         salt = temp.matkhau.substring(temp.matkhau.length-29);
         if(salt.search(";")!=-1)
         {
             salt=temp.matkhau.substring(temp.matkhau.length-34);
         }
      }
      else
      {
        salt=bcrypt.genSaltSync(10);
      }
    salt=salt.replace(/&#x2F;/g,"/");
     console.log(salt,salt.length);
       //const salt=realPass.substring(0,29);
       // console.log(bcrypt.genSaltSync(10));
       // salt="2F;Ahxc9kTnns6FwP&#x2F;sXqGMO";
         var ePWD = bcrypt.hashSync(req.body.password,salt)+salt;
     ePWD=ePWD.replace(/&#x2F;/g,"/");
     var entity = {
        email: req.body.email,
        password: ePWD,
    };
  
    var remember = req.body.remember ? true : false;

    account.login(entity)
        .then(function(account) {
            console.log(account);
            if (account === null) {
                res.render('account/login', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Thông tin đăng nhập không đúng.'
                });
            } else {
                account.dob = moment(account.dob, 'YYYY-MM-DDTHH:mm').format('DD-MM-YYYY');
                req.session.isLogged = true;
                req.session.account = account;
                //req.session.cart = [];

                if (remember === true) {
                    var hour = 1000 * 60 * 60 * 24;
                    req.session.cookie.expires = new Date(Date.now() + hour);
                    req.session.cookie.maxAge = hour;
                }
            //    if(account.status!=0)
            //    {
                var url = '/home';
                //console.log(req.query.retUrl);
                if (req.query.retUrl) {
                    url = req.query.retUrl;
                }
                res.redirect(url);
            // }

            //     else
            //     {
            //         var url='/account/validate';
            //         res.redirect(url);
            //     }
            }
        });
    //console.log(ePWD);
   // console.log(bcrypt.compareSync(req.body.password,'$2a$10$sE7l8QlOqm7bdh7o1YLd2u.zOYBoOPrsXja3.HO.2A9JoeO.dNLx2'));
    
   // console.log("pass is"+ePWD);
   
});

accountRoute.post('/logout', restrict, function(req, res) {
    req.session.isLogged = false;
    req.session.account = null;
    req.session.cart = null;
    req.session.cookie.expires = new Date(Date.now() - 1000);
    res.redirect(req.headers.referer);
});

accountRoute.get('/register', function(req, res) {
    res.render('account/register', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

// accountRoute.post('/register', function(req, res) {

//     var ePWD = crypto.createHash('md5').update(req.body.rawPWD).digest('hex');
//     var nDOB = moment(req.body.dob, 'DD-MM-YYYY').format('YYYY-MM-DDTHH:mm');
//     var ngender = req.body.radioGender;
//     var entity = {
//         //username: req.body.username,
//         password: ePWD,
//         name: req.body.name,
//         email: req.body.email,
//         dob: nDOB,
//         permission: 0,
//         gender: ngender
//     };
//     account.isEmailExisted(entity)
//         .then(function(result) {
//             console.log(result);
//             if (result) {
//                 res.render('account/register', {
//                     layoutModels: res.locals.layoutModels,
//                     showError: true,
//                     errorMsg: 'Đăng ký thất bại. Email đã tồn tại.'
//                 });
//             } else {
//                 account.insert(entity)
//                     .then(function(insertId) {
//                         res.render('account/register', {
//                             layoutModels: res.locals.layoutModels,
//                             showError: true,
//                             errorMsg: 'Đăng ký thành công.'
//                         });
//                     });
//             }
//         });

// });
accountRoute.post('/register', function(req, res) {

    var bcrypt = require('bcryptjs');
    var salt = bcrypt.genSaltSync(10);
    
    console.log(req.body.rawPWD+" is pass");
    console.log(salt+"is salt");
   // var hash = bcrypt.hashSync("B4c0/\/", salt);
   
    var ePWD = bcrypt.hashSync(req.body.rawPWD,salt)+salt;
    while(ePWD.search(';')!=-1)
    {
        salt = bcrypt.genSaltSync(10);
        ePWD = bcrypt.hashSync(req.body.rawPWD,salt)+salt;
    }
    console.log(ePWD+" is new pass");
    var nDOB = moment(req.body.dob, 'DD-MM-YYYY').format('YYYY-MM-DDTHH:mm');
    var ngender = req.body.radioGender;
    var address=req.body.address;
    var entity = {
        //username: req.body.username,
        password: ePWD,
        name: req.body.name,
        email: req.body.email,
        dob: nDOB,
        permission: 0,
        gender: ngender,
        address:address
    };
    account.isEmailExisted(entity)
        .then(function(result) {
            console.log(result);
            if (result) {
                res.render('account/register', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đăng ký thất bại. Email đã tồn tại.'
                });
            } else {
                account.insert(entity)
                    .then(function(insertId) {
                        res.render('account/register', {
                            layoutModels: res.locals.layoutModels,
                            showError: true,
                            errorMsg: 'Đăng ký tài khoản thành công'
                        });
                    });
            }
        });

});

//Thay đổi thông tin người dùng
accountRoute.post('/profile', function(req, res) {
   
    var dateOB = moment(req.body.dob, 'DD-MM-YYYY').format('YYYY-MM-DD');
    console.log(dateOB);
    var entity = {
        id: req.body.id,
        name: req.body.name,
        gender: req.body.gender,
        dob: dateOB,
       address:req.body.address
    };
   
   
    account.updateInfo(entity).then(function(account) {
        res.locals.layoutModels.account = account;
        req.session.account = account;
        console.log(account);
        res.render('account/profile', {
            layoutModels: res.locals.layoutModels,
            showError: true,
            errorMsg: 'Cập nhật thông tin thành công'
        });
    });
});

accountRoute.get('/profile', restrict, async function(req, res) {
   
    var temp=await account.loadAddress(res.locals.layoutModels.account.id);
     res.locals.layoutModels.account.address=temp;
    
    res.render('account/profile', {
        
        layoutModels: res.locals.layoutModels
    });
});

accountRoute.get('/changePassword', restrict, function(req, res) {
    res.render('account/changePassword', {
        layoutModels: res.locals.layoutModels
    });
});

accountRoute.post('/changePassword', restrict, async function(req, res) {
    // var crytoOldPW = crypto.createHash('md5').update(req.body.oldPW).digest('hex');
    // var crytoNewPW = crypto.createHash('md5').update(req.body.newPW).digest('hex');
    // var crytoRenewPW = crypto.createHash('md5').update(req.body.renewPW).digest('hex');
    
    const temp=await account.loadAccountbyEmail(res.locals.layoutModels.account.email);
    console.log(temp);
    
      var bcrypt = require('bcryptjs');
      var salt
      if(temp!=null)
      {
         salt = temp.matkhau.substring(temp.matkhau.length-29);
         if(salt.search(";")!=-1)
         {
            salt = temp.matkhau.substring(temp.matkhau.length-34);
         }
      }
      else
      {
        salt=bcrypt.genSaltSync(10);
      }
     salt=salt.replace(/&#x2F;/g,"/");
    console.log(req.body.oldPW,req.body.newPW,res.locals.layoutModels.account.id);
    var oldPW=bcrypt.hashSync(req.body.oldPW,salt)+salt;
    var newPW=bcrypt.hashSync(req.body.newPW,salt)+salt;
    oldPW=oldPW.replace(/&#x2F;/g,"/");
    newPW=newPW.replace(/&#x2F;/g,"/");
    var pw = {
        id: res.locals.layoutModels.account.id,
        oldPW:oldPW ,
        newPW: newPW
    };
    console.log(pw);
    account.updatePassword(pw).then(function(result) {
        if (result == 1) {
            res.render('account/changePassword', {
                layoutModels: res.locals.layoutModels,
                successMsg: true,
                errorMsg: 'Mật khẩu đã được thay đổi thành công.'
            });
        } else {
            res.render('account/changePassword', {
                layoutModels: res.locals.layoutModels,
                failMsg: true,
                errorMsg: 'Mật khẩu cũ không khớp. Vui lòng nhập lại'
            });
        }

    });
});



accountRoute.get('/newAuction', restrict, function(req, res) {
    account.isPermittedToSell(res.locals.layoutModels.account.id).then(function(result) {
       
        res.render('account/newAuction', {
            isPermitted: result,
            isSucceeded: false,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.post('/newAuction', upload.array('hinhanh', 12), function(req, res) {
    console.log(req.body.giamuangay);
    var entity = {
        tensp: req.body.ten,
        loaisp: req.body.loaisp,
        tgbatdau: moment(req.body.tgbatdau, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        tgketthuc: moment(req.body.tgketthuc, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'),
        giakhoidiem: req.body.giakhoidiem,
        buocgia: req.body.buocgia,
        giamuangay: req.body.giamuangay == "" ? 'null' : req.body.giamuangay,
        nguoiban: res.locals.layoutModels.account.id,
        mota: req.body.motangangon,
        thongtin: String(req.body.motachitiet),
        cogiahan: req.body.tudonggiahan
    };
    console.log(String(entity));
    console.log(entity.thongtin.slice(0,50));
    product.newProduct(entity).then(function(rowid) {
        
        
        mv(srcdir, './public/images/sp/' + rowid, { mkdirp: true }, function(err) {
            console.log('move successfully');
        });
        res.render('account/newAuction', {
            isPermitted: true,
            isSucceeded: true,
            layoutModels: res.locals.layoutModels
        });
    });


});

accountRoute.get('/editAuction/:id', restrict, function(req, res) {
    console.log(req.params.id);
    product.loadProductbyId(req.params.id).then(function(row) {
        
        if (row.manguoiban != res.locals.layoutModels.account.id) {
            res.render('account/editAuction', {
                layoutModels: res.locals.layoutModels,
                isPermitted: false, 
                isSucceeded: false
            });
        } else {
            console.log(row.thongtin);
            res.render('account/editAuction', {
                layoutModels: res.locals.layoutModels,
                isPermitted: true, 
                isSucceeded: false,
                row: row
            });
        }
    });
});

accountRoute.post('/editAuction/:id', restrict, function(req, res) {
    console.log(req.params.id);
    console.log(req.body.tudonggiahan);
    var now = moment().format('D/M/YYYY - HH:mm');
    var entity = {
        thongtin: "<p> <i class='fas fa-pencil-alt btn-lg'></i> Chỉnh sửa lần cuối " + now + ":</p><hr>" + req.body.motachitiet,
        id: req.body.masp
    };
    console.log(entity.thongtin);
    product.updateProduct(entity).then(function(rowid){
      
        res.render('account/editAuction', {
                layoutModels: res.locals.layoutModels,
                isPermitted: true, 
                isSucceeded: true,
                masp:entity.id
        });
    });

});

accountRoute.get('/', restrict, function(req, res) {

    res.render('account/profile', {
        layoutModels: res.locals.layoutModels
    });
});

accountRoute.get('/ratedetail', restrict, function(req, res) {
    console.log(res.locals.layoutModels.account);
    account.getRateDetail(res.locals.layoutModels.account.id).then(function(data) {
        //console.log(data)
        var nrate = 0;
        
            nrate = res.locals.layoutModels.account.positivepoint / (res.locals.layoutModels.account.positivepoint + res.locals.layoutModels.account.negativepoint) * 100;
            nrate = nrate.toFixed(2);
        
        console.log(data.list);
        console.log(nrate);
        res.render('account/ratedetail', {
            list: data.list,
            isEmpty: data.list.length === 0,
            rate: nrate,
            layoutModels: res.locals.layoutModels
        });
    });
});



accountRoute.get('/ratedetail1', restrict, function(req, res) {
    console.log(res.locals.layoutModels.account);
    account.getRateDetail1(res.locals.layoutModels.account.id).then(function(data) {
       
            nrate = res.locals.layoutModels.account.positivepoint / (res.locals.layoutModels.account.positivepoint + res.locals.layoutModels.account.negativepoint) * 100;
            nrate = nrate.toFixed(2);
        
    
        res.render('account/ratedetail1', {
            list: data,
            isEmpty: data.length === 0,
            rate: nrate,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/bidingList', restrict, function(req, res) {
    account.getBidingList(res.locals.layoutModels.account.id).then(function(rows) {
       
      for(var i=0;i<rows.length;i++)
      {
          rows[i].ofMe=0;
          if(rows[i].nguoigiugia==res.locals.layoutModels.account.name)
          {
              rows[i].ofMe=1;
          }
      }
      console.log(rows,res.locals.layoutModels.account.id);
        res.render('account/bidingList', {
            rows: rows,
            isEmpty: rows.length >0 ? false : true,
            layoutModels: res.locals.layoutModels,

        });
    });
});

accountRoute.get('/wonList', restrict, function(req, res) {

    
    account.getWonList(res.locals.layoutModels.account.id).then(function(rows) {
       
        account.updateHistory(rows);
        
            res.render('account/wonList', {
                rows: rows,
                isEmpty: rows.length === 0,
                layoutModels: res.locals.layoutModels
            });
         
       
    });
});

accountRoute.get('/sellingList', restrict, function(req, res) {
    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
   var offset = (curPage - 1) * rec_per_page;
    account.getSellingList(res.locals.layoutModels.account.id,rec_per_page,offset).then(function(rows) {
        console.log(rows.total);
        var number_of_pages = rows.total / rec_per_page;
            if (rows.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: i === +curPage
                });
            }
        res.render('account/sellingList', {
            rows: rows.rows,
            isEmpty: rows.total === 0,
            layoutModels: res.locals.layoutModels,

                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,
        });
    });
});

accountRoute.get('/soldList', restrict, function(req, res) {
    account.getSoldList(res.locals.layoutModels.account.id).then(function(rows) {
        console.log(rows[0]);
        res.render('account/soldList', {
            rows: rows,
            isEmpty: rows.length === 0,
            layoutModels: res.locals.layoutModels
        });
    });
});

accountRoute.get('/newPermit', restrict, function(req, res) {
    console.log(res.locals.layoutModels.account);
    res.render('account/newPermit', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

accountRoute.post('/newPermit', restrict, function(req, res) {

    account.insertNewPer(res.locals.layoutModels.account.id).then(function(insertId) {
        console.log(insertId);
        res.redirect('/home');
    });

});

accountRoute.get('/rateSeller', restrict, function(req, res) {
    console.log(req.query.id);
    res.render('account/rateSeller', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});
accountRoute.get('/rateSeller1', restrict, function(req, res) {
    console.log(req.query.id);
    res.render('account/rateSeller1', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});
accountRoute.post('/rateSeller1', restrict, function(req, res) {
    console.log(req.query.idPro);
    console.log(req.body.nx);
    console.log(req.body.diem);
    console.log(req.query.idAcc);
    console.log(res.locals.layoutModels)
    var entity = {
        nx: req.body.nx,
        diem: req.body.diem,
        idPro: req.query.idPro,
        idSeller: req.query.idB,
        idBuyer: res.locals.layoutModels.account.id
    };
    account.daDanhGiaNguoiBan1(entity).then(function(result) {
        if (result) {
            res.render('account/rateSeller1', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Bạn đã đánh giá người bán sản phẩm này rồi!'
            });
        } else {
            account.insertDanhGiaNguoiBan1(entity).then(function(changedRows) {
                res.render('account/rateSeller1', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đánh giá thành công!'
                });
            });
        }
    });
});

accountRoute.post('/rateSeller', restrict, function(req, res) {
    console.log(req.query.idPro);
    console.log(req.body.nx);
    console.log(req.body.diem);
    console.log(req.query.idAcc);
    console.log(res.locals.layoutModels)
    var entity = {
        nx: req.body.nx,
        diem: req.body.diem,
        idPro: req.query.idPro,
        idSeller: req.query.idB,
        idBuyer: res.locals.layoutModels.account.id
    };
    account.daDanhGiaNguoiBan(entity).then(function(result) {
        if (result) {
            res.render('account/rateSeller', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Bạn đã đánh giá người bán sản phẩm này rồi!'
            });
        } else {
            account.updateDanhGiaNguoiBan(entity).then(function(changedRows) {
                res.render('account/rateSeller', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đánh giá thành công!'
                });
            });
        }
    });
});

accountRoute.get('/rateBuyer', restrict, function(req, res) {

    res.render('account/rateBuyer', {
        layoutModels: res.locals.layoutModels,
        showError: false,
        errorMsg: ''
    });
});

accountRoute.post('/rateBuyer', restrict, function(req, res) {

    var entity = {
        nx: req.body.nx,
        diem: req.body.diem,
        idPro: req.query.idPro,
        idSeller: res.locals.layoutModels.account.id,
        idBuyer: req.query.idM
    };
    console.log(entity);
    account.daDanhGiaNguoiMua(entity).then(function(result) {
        if (result) {
            res.render('account/rateBuyer', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Bạn đã đánh giá người mua sản phẩm này rồi!'
            });
        } else {
            account.updateDanhGiaNguoiMua(entity).then(function(changedRows) {
                res.render('account/rateSeller', {
                    layoutModels: res.locals.layoutModels,
                    showError: true,
                    errorMsg: 'Đánh giá thành công!'
                });
            });
        }
    });
});

accountRoute.get('/rateProduct', restrict, function(req, res) {
    console.log(req.query.idPro,req.query.idAcc);
    
    
            res.render('account/rateProduct', {
                layoutModels: res.locals.layoutModels,
              idsp:req.query.idAcc,
              showError:false,
              errorMsg:''
            })
});

accountRoute.post('/rateProduct',restrict,function(req,res)
{
    var entity = {
        nx: req.body.nx,
        diem: req.body.diem,
        
    };
  account.checkRateProduct(req.query.idPro,req.query.idAcc).then(function(row1)
  {
      console.log(row1.length);
      if(row1.length==0)
      {
          account.updateRateProduct(req.query.idPro,req.query.idAcc,entity.nx,entity.diem).then(function(row2){});
          res.render('account/rateProduct',
          {
            layoutModels:res.locals.layoutModels,
            showError:true,
            errorMsg:'Đánh giá sản phẩm thành công'

          });
      }
      else
      {
        res.render('account/rateProduct',
          {
            layoutModels:res.locals.layoutModels,
            showError:true,
            errorMsg:'Bạn đã đánh giá sản phẩm này rồi'

          });
      }
  })
})
module.exports = accountRoute;
