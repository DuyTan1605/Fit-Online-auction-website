var express = require('express');
var product = require('../models/product');
var account = require('../models/account');
var Q = require('q');
var productRoute = express.Router();
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dreamleage1999@gmail.com',
        pass: '0949844063'
    }
});
productRoute.post('/byCat/:id', function(req, res) {
    if (req.session.isLogged === true) {
        product.checkLoved(req.session.account.id, req.query.idsp).then(function(data)
        {
            if(data==0)
            {
            product.insertTheoDoi(req.session.account.id, req.query.idsp)
            .then(function() {
                var rec_per_page = 6;
                 var curPage = req.query.page ? req.query.page : 1;
                var offset = (curPage - 1) * rec_per_page;
                console.log(curPage);
                product.loadPageByCat(req.params.id, rec_per_page, offset,req.session.account.id)
                .then(function(pro) {
                    if (pro) {
                        res.redirect('/product/byCat/'+req.params.id+'?page='+curPage);
                    } else {
                        res.redirect('/home');
                    }
                });
            });
        }
        else
        {
            res.redirect('/product/byCat/'+req.params.id+'?page='+curPage);
        }
        })
       
    } 
    else {
        res.redirect('/account/login');
    }
});
productRoute.get('/byCat/:id',function(req, res) {

    // product.loadAllByCat(req.params.id)
    //     .then(function(list) {
    //         res.render('product/byCat', {
    //             layoutModels: res.locals.layoutModels,
    //             products: list,
    //             isEmpty: list.length === 0,
    //             catId: req.params.id
    //         });
    //     });
if(!req.session.isLogged)
{
    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;
   
    product.loadPageByCat(req.params.id, rec_per_page, offset,0)
        .then(function(data) {

            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: i === +curPage
                });
            }
            for(var i=0;i<data.list.length;i++)
            {
               
                data.list[i].watching='Yêu thích';
            }
            console.log(data.list);
            res.render('product/byCat', {
                layoutModels: res.locals.layoutModels,
                products: data.list,
                isEmpty: data.total === 0,
                catId: req.params.id,

                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,
               
            });
        });
       
    }
    else
    {
        var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;
    req.query.page=curPage;
   
    product.loadPageByCat(req.params.id, rec_per_page, offset,req.session.account.id)
        .then(function(data) {

            var number_of_pages = data.total / rec_per_page;
            if (data.total % rec_per_page > 0) {
                number_of_pages++;
            }

            var pages = [];
            for (var i = 1; i <= number_of_pages; i++) {
                pages.push({
                    pageValue: i,
                    isActive: i === +curPage
                });
            }
            // for(var i=0;i<data.list.length;i++)
            // {
               
            //     data.list[i].watching='Yêu thích';
            // }
            
                  res.render('product/byCat', {
                layoutModels: res.locals.layoutModels,
                products: data.list,
                isEmpty: data.total === 0,
                catId: req.params.id,

                pages: pages,
                curPage: curPage,
                prevPage: curPage - 1,
                nextPage: curPage + 1,
                showPrevPage: curPage > 1,
                showNextPage: curPage < number_of_pages - 1,
               
            });
        });
    }
});

productRoute.get('/detail/:id', function(req, res) {

    if (!req.session.isLogged) {
       
        product.loadDetail(req.params.id, false, null)
        .then(function(pro) {
           console.log(pro);
            if (pro) {
              
                var tt = 'Đã qua sử dụng';
                if (pro.tinhtrang!=1)
                    {tt = 'Chưa qua sử dụng';
                    }
                  
                product.relevantProduct(req.params.id).then(function(data)
                {
                console.log(pro);
                    res.render('product/detail', {
                        layoutModels: res.locals.layoutModels,
                        product: pro,
                        watching: 'Yêu thích',
                        trangthai: tt,
                        arr_relevant:data.slice(1,5),
                        first_relevant:data[0].masp,
                        length_relevant:data.length
                    });
                })
               
            } else {
                res.redirect('/home');
            }
        });
    }
    else {
        console.log(req.params.id,req.session.account.id);
        product.loadDetail(req.params.id, true, req.session.account.id)
        .then(function(pro) {
            if (pro) {
              
                var tt = 'Đã qua sử dụng';
                if (pro.pro.tinhtrang!=1)
                    tt = 'Chưa qua sử dụng';
                // res.render('product/detail', {
                //     layoutModels: res.locals.layoutModels,
                //     product: pro1.pro,
                //     watching: pro1.watching,
                //     trangthai: tt
                // });
                console.log(pro.pro);
              
                product.relevantProduct(req.params.id).then(function(data)
                {
                    
                    res.render('product/detail', {
                        layoutModels: res.locals.layoutModels,
                        product: pro.pro,
                        watching: pro.watching,
                        trangthai: tt,
                        arr_relevant:data.slice(1,5),
                        first_relevant:data[0].masp,
                        length_relevant:data.length
                    });
                });
            } 
            else {
                res.redirect('/home');
            }
        });
    }
});

productRoute.post('/detail/:id', function(req, res) {
   
    
    if(req.session.account!=undefined)
    {
        product.insertTheoDoi(req.session.account.id, req.params.id)
        .then(function() {
            product.loadDetail(req.params.id, req.session.isLogged, req.session.account.id)
            .then(function(pro) {
                if (pro) {
                    if (!req.session.isLogged) {
                        
                        res.render('product/detail', {
                            layoutModels: res.locals.layoutModels,
                            product: pro
                        });
                    }
                    else {
                        res.render('product/detail', {
                            layoutModels: res.locals.layoutModels,
                            product: pro.pro,
                            watching: pro.watching
                        });
                    }
                } else {
                    res.redirect('/home');
                }
            });
        });
    }
    else
    {
        res.redirect('/account/login');
    }
    
});

productRoute.get('/bid/:id', function(req, res) {
    
   
        if(req.session.account)
        {
        account.loadAccountbyId(req.session.account.id)
        .then(function(acc) {
            if (acc) {
            
               // console.log(acc,req.params.id);
                var cong = acc.diemcong;
                var tru = acc.diemtru;
                console.log(cong);
                console.log(tru);
                console.log(parseFloat(cong / (cong + tru)));
                // if ((cong !== 0 || tru !== 0) && (cong / (cong + tru)) <= 0.8) {
                    if(parseFloat(cong / (cong + tru))<0.8){
                        console.log("VO TH NAY3");
                    res.render('product/cannotbid', {
                        layoutModels: res.locals.layoutModels,
                        lydo:" Điểm cộng thấp hơn 80%.",
						idsp: req.params.id
                    });
                } 
                else {
                    product.loadCamDauGia(req.session.account.id, req.params.id)
                    .then(function(row) {
                      
                        if (row.length > 0) {
                            console.log("VO TH NAY2");
                            res.render('product/cannotbid', {
                                layoutModels: res.locals.layoutModels,
                                lydo: 'Bị cấm bởi người bán sản phẩm.',
								idsp: req.params.id
                            });
                        }
                        else {
                            console.log("khong bi cam");
                            product.loadHetHan(req.params.id)
                            .then(function(row) {
                        
                                if (row!=null) {
                                    console.log( "phien dau gia ket thuc");
                                    product.loadProductbyId(req.params.id)
                                    res.render('product/cannotbid', {
                                        layoutModels: res.locals.layoutModels,
                                        lydo: 'Phiên đấu giá đã kết thúc.',
										idsp: req.params.id
                                    });
                                } 
                                else {
                                    console.log( "phien dau gia chua ket thuc");
                                    product.loadProductbyId(req.params.id)
                                  .then(function(pro) {
                                   
                                        if (pro) {
                                           console.log(pro);
                                            res.render('product/bid', {
                                                layoutModels: res.locals.layoutModels,
                                                product: pro
                                            });
                                        } else {
                                            res.redirect('/home');
                                        }
                                    });
                                }
                            }); 
                        }
                    });
                }
            } else {
                res.redirect('/home');
            }                      
        });
    }
    else
    {
        res.redirect('/account/login');
    }
    
});

productRoute.post('/bid/:id', function(req, res) {
    
    if(req.session.account!=undefined)
    {
    var entity = {
        giaphaitra: req.body.giaphaitra,
        nguoigiugia: req.session.account.id
    };
    product.loadProductbyId1(req.params.id).then(function(res)
    {
       if(res.email.length>0)
       {
        var mailToBidder1 = {
            from: 'dreamleage1999@gmail.com', // notice from web
            to: res.email, // receivers last
            subject: "Thông báo sản phẩm đấu giá đã bị trả giá cao hơn", // Subject mail
            text: "Sản phẩm " + res.tensp + " do bạn giữ giá đã bị trả giá cao hơn nên hiện bạn đã mất quyền sở hữu ", // content
        };
       
        smtpTransport.sendMail(mailToBidder1, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
       }
    })
    product.insertragia(req.session.account.id, req.params.id, entity)
        .then(function() {
            product.uploadExpire();
            product.loadProductbyId(req.params.id).then(function(row) {
                console.log("email xn");
                //Gửi email xác nhận cho người mua đã trả giá thành công
                var mailToBidder = {
                    from: 'dreamleage1999@gmail.com', // notice from web
                    to: res.locals.layoutModels.account.email, // receivers 
                    subject: "Thông báo trả giá thành công", // Subject mail
                    text: "Bạn đã trả giá thành công cho sản phẩm " + row.tensp + " với giá là " + req.body.giaphaitra + " VND", // content
                };
                console.log("list email mua is"+mailToBidder.to);
                smtpTransport.sendMail(mailToBidder, function(error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                });

                //Gửi email thông báo có người trả giá cho người bán
                product.loadSellerByProductId(req.params.id).then(function(rowSeller) {
                    var mailToSeller = {
                        from: 'dreamleage1999@gmail.com', // web mail
                        to: rowSeller.email, // seller
                        subject: "Thông báo sản phẩm đã được trả giá", // Subject line
                        text: "Tài khoản " + res.locals.layoutModels.account.name + " vừa trả giá " + req.body.giaphaitra + " vnd cho sản phẩm " + row.tensp + " của bạn."
                    };
                    console.log(mailToSeller.to);
                    smtpTransport.sendMail(mailToSeller, function(error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }
                    });
                });


                smtpTransport.close();
            });
           
            product.updateDatGiaHienTai(req.params.id, entity)
                .then(function() {
                    res.redirect('/product/detail/' + req.params.id);
                });
        });
       
    }
    else
    {
        res.redirect('/account/login');
    }
});

productRoute.get('/bidlog/:id', function(req, res) {
   
    //console.log(res.locals.layoutModels.account.permission);
    if(req.session.isLogged)
    {
        if(res.locals.layoutModels.account.permission == 0)
        {
    product.loadBidLogById(req.params.id)
    .then(function(rows) {
        
      for(var i=0;i<rows.length;i++)
      {
          rows[i].stt=i;
          
      }
      console.log(rows[0].manguoiban== res.locals.layoutModels.account.id);
        res.render('product/bidlog', {
            layoutModels: res.locals.layoutModels,
            ragia: rows,
            empty: rows.length === 0,
            idsp: req.params.id,
           manguoiban1:rows[0].manguoiban== res.locals.layoutModels.account.id
        });  
        
    });
    }
    else
    {
        product.loadBidLogById(req.params.id)
    .then(function(rows) {
       // console.log(res.locals.layoutModels);
       
      // console.log(rows[0].manguoiban== res.locals.layoutModels.account.id);

      console.log(rows,req.params.id);
        res.render('product/bidlog', {
            layoutModels: res.locals.layoutModels,
            ragia: rows,
            empty: rows.length === 0,
            idsp: req.params.id,
            manguoiban1:rows[0].manguoiban== res.locals.layoutModels.account.id
        });   
    });
    }
    }
    else
    {
       res.redirect('/account/login'); 
    }

});

productRoute.post('/bidlog/:id', function(req, res) {
    
    
    if(req.session.isLogged==true)
    {
        console.log("VO TH NAYyyyy");
        console.log(req.body.accId,req.params.id,res.locals.layoutModels.account.email);
        product.insertCamDauGia(req.body.accId,req.params.id)
        .then(function(rows)
        {
            account.loadAccountbyId(req.body.accId).then(function(data)
            {
                product.loadProductbyId(req.params.id).then(function(data1)
                {
                    var mailToBidder = {
                        from: 'dreamleage1999@gmail.com', // notice from web
                        to: data.email, // receivers 
                        subject: "Thông báo cấm đấu giá", // Subject mail
                        text: "Bạn đã bị cấm đấu sản phẩm " + data1.tensp + " bởi tài khoản đăng sản phẩm là "+ res.locals.layoutModels.account.email, // content
                    };
                    console.log(mailToBidder);
                    smtpTransport.sendMail(mailToBidder, function(error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + response.message);
                        }
                    });
                })
               
            })
        })
        res.redirect('/product/detail/'+req.params.id);
        
}
else
{
    
   
  res.redirect('/account/login');
}
});


productRoute.post('/buynow/:id', function(req, res) {
    if (req.session.isLogged === true) {
       
        account.loadAccountbyId(req.session.account.id)
        .then(function(acc) {
            if (acc) {
                var cong = acc.diemcong;
                var tru = acc.diemtru;
                console.log(cong);
                console.log(tru);
                console.log(cong / (cong + tru) <= 0.8);
                if ((cong !== 0 || tru !== 0) && (cong / (cong + tru) <= 0.8)) {
                    res.render('product/cannotbid', {
                        layoutModels: res.locals.layoutModels,
                        lydo:" Điểm cộng thấp hơn 80%."
                    });
                } else {
                    product.loadCamDauGia(req.session.account.id, req.params.id)
                    .then(function(row) {
                        if (row.length > 0) {
                            res.render('product/cannotbid', {
                                layoutModels: res.locals.layoutModels,
                                lydo: 'Bị cấm bởi người bán sản phẩm.'
                            });
                        }
                        else {
                            product.loadHetHan(req.params.id)
                            .then(function(row) {
                                if (row.length > 0) {
                                    res.render('product/cannotbid', {
                                        layoutModels: res.locals.layoutModels,
                                        lydo: 'Phiên đấu giá đã kết thúc.'
                                    });
                                } else {
                                    product.updateSanPhamMuaNgay(req.session.account.id, req.params.id)
                                    .then(function() {
                                        product.loadProductbyId(req.params.id)
                                        .then(function(pro) {
                                            if (pro) {
                                                
                                                var entity = {
                                                    giaphaitra: pro.giamuangay,
                                                    nguoigiugia: req.session.account.id
                                                };

                                                product.insertragia(req.session.account.id, req.params.id, entity)
                                                .then(function() {

                                                    product.updateDatGiaHienTai(req.params.id, entity)
                                                    .then(function() {
                                                        res.redirect('/product/detail/' + req.params.id);
                                                    });
                                                });

                                            } else {
                                                res.redirect('/home');
                                            }
                                        });
                                    });
                                }
                            }); 
                        }
                    });
                }
            } else {
                res.redirect('/home');
            }                      
        });
    } else {
        res.render('account/login', {
            layoutModels: res.locals.layoutModels,
            showError: false,
            errorMsg: ''
        });
    }
});

module.exports = productRoute;
