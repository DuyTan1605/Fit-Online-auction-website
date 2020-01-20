var express = require('express');
var product = require('../models/product');
var account = require('../models/account');

var searchRoute = express.Router();


searchRoute.get('/', function(req, res) {

   
    if(!req.session.isLogged)
    {
    var orderBy = 'masp asc';
    var orderString = "Chọn";
    switch (req.query.order) {
        case "0":
            orderBy = 'masp asc';
            orderString = "Mặc định";
            break;
        case "1":
            orderBy = 'tgketthuc desc';
            orderString = "Thời gian kết thúc giảm dần";
            break;
        case "2":
            orderBy = 'giahientai asc';
            orderString = "Giá hiện tại tăng dần";
            break;
       

    }

    console.log(orderBy);
   
    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;
    req.query.page=curPage;
    product.searchProduct(req.query.word, req.query.cat, orderBy, rec_per_page, offset,0).then(function(data) {
        console.log(data.rows.length,data.total);
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
        var arr_data=[];
        for(var i=0;i<data.rows.length;i++)
        {
            var temp={};
            temp=data.rows[i];
            temp.isRecent=0;
            
              if(product.isNew(data.rows[i].tgbatdau))
              {
                  temp.isRecent=1;
              }
              temp.word=req.query.word;
              temp.cat=req.query.cat;
          arr_data.push(temp);
        }
       for(var i=0;i<arr_data.length;i++)
       {
           arr_data[i].watching='Yêu thích';
       }
      
      
        res.render('search/result', {
            layoutModels: res.locals.layoutModels,
            word: req.query.word,
            isEmpty: data.rows.length === 0,
            total: data.total,
            rows: arr_data,
            orderString: orderString,

            pages: pages,
            curPage: curPage,
            prevPage: curPage - 1,
            nextPage: parseInt(curPage) + 1,
            showPrevPage: curPage > 1,
            showNextPage: curPage < number_of_pages - 1
        });
    });
}
else
{
    var orderBy = 'masp asc';
    var orderString = "Chọn";
    switch (req.query.order) {
        case "0":
            orderBy = 'masp asc';
            orderString = "Mặc định";
            break;
        case "1":
            orderBy = 'tgketthuc desc';
            orderString = "Thời gian kết thúc giảm dần";
            break;
        case "2":
            orderBy = 'giahientai asc';
            orderString = "Giá hiện tại tăng dần";
            break;
       

    }

    console.log(orderBy);
    var rec_per_page = 6;
    var curPage = req.query.page ? req.query.page : 1;
    var offset = (curPage - 1) * rec_per_page;
    req.query.page=curPage;
    product.searchProduct(req.query.word, req.query.cat, orderBy, rec_per_page, offset,req.session.account.id).then(function(data) {
       
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
        var arr_data=[];
        for(var i=0;i<data.rows.length;i++)
        {
            var temp={};
            temp=data.rows[i];
            temp.isRecent=0;
            
              if(product.isNew(data.rows[i].tgbatdau))
              {
                  temp.isRecent=1;
              }
           temp.word=req.query.word;
              temp.cat=req.query.cat;
          arr_data.push(temp);
        }
      console.log(arr_data);
        res.render('search/result', {
            layoutModels: res.locals.layoutModels,
            word: req.query.word,
            isEmpty: data.rows.length === 0,
            total: data.total,
            rows: arr_data,
            orderString: orderString,

            pages: pages,
            curPage: curPage,
            prevPage: curPage - 1,
            nextPage: parseInt(curPage) + 1,
            showPrevPage: curPage > 1,
            showNextPage: curPage < number_of_pages - 1
        });
    });
}
});

searchRoute.post('/', function(req, res) {
    if (req.session.isLogged === true) {
        var orderBy = 'masp asc';
    var orderString = "Chọn";
    switch (req.query.order) {
        case "0":
            orderBy = 'masp asc';
            orderString = "Mặc định";
            break;
        case "1":
            orderBy = 'tgketthuc desc';
            orderString = "Thời gian kết thúc giảm dần";
            break;
        case "2":
            orderBy = 'giahientai asc';
            orderString = "Giá hiện tại tăng dần";
            break;
       

    }
             var rec_per_page = 6;
                 var curPage = req.query.page ? req.query.page : 1;
                var offset = (curPage - 1) * rec_per_page;
                console.log(curPage);
        product.checkLoved(req.session.account.id, req.query.idsp).then(function(data)
        {
            if(data==0)
            {
            product.insertTheoDoi(req.session.account.id, req.query.idsp)
            .then(function() {
               
                product.searchProduct(req.query.word, req.query.cat, orderBy, rec_per_page, offset,req.session.account.id)
                .then(function(pro) {
                    if (pro) {
                        res.redirect('/search?word='+req.query.word+'&cat='+req.query.cat+'&page='+curPage);
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

module.exports = searchRoute;
