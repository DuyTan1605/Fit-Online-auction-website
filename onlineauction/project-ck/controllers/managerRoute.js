var express = require('express');
var category = require('../models/category');
var product = require('../models/product');
var account = require('../models/account.js');
var crypto = require('crypto');
var restrict = require('../middle-wares/restrict');
var moment = require('moment');
var nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dreamleage1999@gmail.com',
        pass: '0949844063'
    }
});

var r = express.Router();

r.get('/category', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
      
        for(var i=0;i<res.locals.layoutModels.categories.length;i++)
        {
           
            
            for(var j=0;j<res.locals.layoutModels.catListDadFinal.length;j++)
            {
                if(res.locals.layoutModels.categories[i].id_danhmuccha==res.locals.layoutModels.catListDadFinal[j].id)
                {
                    res.locals.layoutModels.categories[i].tendanhmuccha=res.locals.layoutModels.catListDadFinal[j].tendanhmuc;
                }
                
            }
           
        }
        console.log(res.locals.layoutModels.catListDadFinal);
        res.render('manager/category/index', {
            layoutModels: res.locals.layoutModels,
            error: req.session.error
        });
        delete req.session.error;
    }

});
// r.get('/product', restrict, function(req, res) {
//     if (req.session.account.permission !== 2) {
//         res.redirect('/403');
//     } else {
      
        
//         res.render('manager/product/index', { 
//             layoutModels: res.locals.layoutModels,
//             error: req.session.error
//         });
//         delete req.session.error;
//     }

// });

r.get('/category/add', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        res.render('manager/category/add', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

r.post('/category/add', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var entity = {
            catName: req.body.catName,
            catDadId:req.body.catDadName
        };
        category.insert(entity).then(function(data) {
            res.render('manager/category/add', {
                layoutModels: res.locals.layoutModels,
                showError: true,
                errorMsg: 'Thêm danh mục thành công'
            });
        }).catch(function(err) {
            console.log(err);
            res.end('insert fail');
        });
    }
});

r.get('/category/edit', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var id = req.query.id;
        category.loadDetail(id).then(function(cat) {
            res.render('manager/category/edit', {
                layoutModels: res.locals.layoutModels,
                showError: false,
                errorMsg: '',
                category: cat
            });
        });
    }
});

r.post('/category/edit', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var entity = {
            catId: req.body.catId,
            catName: req.body.catName,
            catDadId:req.body.catDadName,
           
        }
        console.log(entity);
        category.update(entity).then(function(changedRows) {
            res.redirect('/manager/category');
        })
    }
});

r.post('/category/delete', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var entity = {
            id: req.body.catId
        };

        product.loadAllByCat(req.body.catId).then(function(rows) {
            if (rows.length > 0) {
                req.session.error = 'Không thể xóa danh mục có sản phẩm đang đấu giá';
                res.redirect('/manager/category');
            } else {
                category.delete(entity).then(function(affectedRows) {
                    res.redirect('/manager/category');
                });
            }
        });

    }
});

r.get('/account', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        
        account.loadAll().then(function(rows) {
            res.render('manager/account/index', {
                layoutModels: res.locals.layoutModels,
                accounts: rows,
                showError:req.session.showError,
                errorMsg:req.session.errorMsg
            });
        });
        delete req.session.showError;
        delete req.session.errorMsg;
    }
    

});
r.get('/product', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        product.loadAllProduct().then(function(rows) {
            res.render('manager/product/index', {
                layoutModels: res.locals.layoutModels,
                products: rows,
                error:req.session.error
            });
        });
    }

});

r.post('/product/delete', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var entity = {
            id: req.body.proId
        };
       
        console.log(req.body.proId);
        product.loadAllProductBid(entity).then(function(rows) {
            if (rows.length > 0) {
                req.session.error = 'Không thể xóa sản phẩm đang đấu giá';
                res.redirect('/manager/product');
            } else {
               

                product.loadAllProductOnTrack(entity).then(function(data)
                {
                    if(data.length>0)
                    {
                        req.session.error = 'Không thể xóa sản phẩm đang theo dõi';
                        res.redirect('/manager/product');
                    }
                    else{
                    product.delete(entity).then(function(affectedRows) {
                        req.session.error = 'Xóa sản phẩm thành công';
                        res.redirect('/manager/product');
                    });
                }
                });
               
            }
        });

        // product.delete(entity).then(function(affectedRows) {
        //     res.redirect('/manager/product');
        // });
    }
});

r.post('/account/delete', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var entity = {
            id: req.body.accId
        };
        console.log(entity);
        account.delete(entity).then(function(affectedRows) {
            res.redirect('/manager/account');
        });
    }
});

r.post('/account/down', restrict, async function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var entity = {
            id: req.body.accId
        };
        console.log(entity.id);
        account.loadAccountbyId(entity.id).then(function(data)
        {
            if(data.quyenhan==1)
            {
                
                account.downLevel(entity).then(function(data1)
                {
                  
                        req.session.showError=true;
                        req.session.errorMsg='Hạ cấp thành công';
                        res.redirect('/manager/account');
                        
                   
                   
                })
            }
            else
            {
                
                req.session.showError=false;
                req.session.errorMsg='Chỉ có thể hạ cấp seller thành bidder';
                res.redirect('/manager/account');
               
            }
        });
           
            
           
        
    }
});

r.post('/account/reset', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var bcrypt = require('bcryptjs');
    var salt = bcrypt.genSaltSync(10);
    
   
  
   
    var ePWD = bcrypt.hashSync("77779999",salt)+salt;
    while(ePWD.search(';')!=-1)
    {
        salt = bcrypt.genSaltSync(10);
        ePWD = bcrypt.hashSync(req.body.rawPWD,salt)+salt;
    }
    ePWD=ePWD.replace(/&#x2F;/g,"/");
        var entity = {
            id: req.body.accId,
            pass: ePWD
        };
        
        account.reset(entity).then(function(affectedRows) {
            account.getEmailById(req.body.accId).then(function(row) {
                console.log(row);
                var mailOptions = {
                    from: 'dreamleage1999@gmail.com', // sender address
                    to: row.email, // list of receivers
                    subject: "Thông báo reset mật khẩu", // Subject line
                    text: "Tài khoản bạn đã được reset mậu khẩu là: 77779999", // plaintext body
                };
                console.log(mailOptions.to);

                smtpTransport.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    //smtpTransport.close(); // shut down the connection pool, no more messages
                });
                res.redirect('/manager/account');
            });

        });
    }
});

r.get('/account/approval', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        account.loadApproval().then(function(rows) {
            for (i = 0; i < rows.length; i++) {
                rows[i].tgbatdau = moment(rows[i].tgbatdau).format('YYYY-MM-DD HH:mm:ss')
            }
            res.render('manager/account/approval', {
                layoutModels: res.locals.layoutModels,  
                listAppro: rows
            });
        });
    }

});

r.post('/account/approval', restrict, function(req, res) {
    if (req.session.account.permission !== 2) {
        res.redirect('/403');
    } else {
        var id = req.body.id;
        console.log(id);
        for (i = 0; i < id.length; i++) {
            account.updateApproval(id[i]);
        }
        res.redirect('/manager/account/approval');
    }
});

module.exports = r;
