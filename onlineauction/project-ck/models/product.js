var Q = require('q');
var mustache = require('mustache');
var moment = require('moment');
var db = require('../app-helpers/dbHelper');

exports.loadHistoryRate=function(id,idnguoimua,i)
{
    var defered=Q.defer();
    
    var sql='SELECT * FROM lichsudaugia WHERE idsp='+id+' and idnguoimua='+idnguoimua;
    db.load(sql).then(function(res)
    {
     if(res.length>0)
     {
        res[0].stt=i;
        defered.resolve(res[0]);
     }
     else
     {
        defered.resolve({stt:i});
     }
    })
    return defered.promise;
}
exports.isExpireAndSent=function()
{
    var defered=Q.defer();
    var promises = [];
    var sql='SELECT KQ.*,TK1.email as emailbidder FROM(select SP.*,TK.email AS emailseller from sanpham as SP,taikhoan as TK where SP.tinhtrang=1 and SP.tgketthuc<now() and TK.id=SP.manguoiban) as KQ left join taikhoan as TK1 on TK1.id=KQ.nguoigiugia';
    promises.push(db.load(sql));
    var sql1='UPDATE sanpham sp set sp.tinhtrang=0 where sp.tgketthuc<now()';
    promises.push(db.update(sql1));
    var sql2='SELECT * FROM((SELECT sp.* FROM sanpham sp where sp.tgketthuc<now()) as RS left join ketquadaugia KQ on KQ.idsp=RS.masp)';
    promises.push(db.load(sql2));
    Q.all(promises).spread(function(row1,row2,row3)
    {
        //console.log(row3);
        for(var i=0;i<row3.length;i++)
        {   
           
            if(row3[i].nguoigiugia!=null && row3[i].idsp==null)
            {
               
              var sql4='insert into ketquadaugia(idsp,idnguoiban,idnguoimua) values('+row3[i].masp+','+row3[i].manguoiban+','+row3[i].nguoigiugia+')';
             db.insert(sql4);
                
               
            }
        }
        defered.resolve(row1);
    })
    return defered.promise;
}

exports.checkLoved=function(idsp,id)
{
    var deferred = Q.defer();

    var sql = 'SELECT * FROM theodoi where masp ='+idsp+' and nguoitheodoi='+id;

      
        console.log(sql);
    db.load(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows.length);
    });

    return deferred.promise;
}
exports.loadAllProductOnTrack=function(entity)
{
    var deferred = Q.defer();

    var sql = mustache.render(
        'SELECT * FROM theodoi where masp = {{id}}',
        entity
    );
        console.log(sql);
    db.load(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.loadAllProductBid=function(entity)
{
    var deferred = Q.defer();

    var sql = mustache.render(
        'SELECT * FROM sanpham where masp = {{id}} AND nguoigiugia is not null',
        entity
    );

    db.load(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}
exports.delete = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render(
        'delete from sanpham where masp = {{id}}',
        entity
    );

    db.delete(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.loadAllProduct=function()
{
    var deferred = Q.defer();

    var sql = 'select * from daugia.sanpham';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}
exports.uploadExpire=function()
{
   
    var sql='UPDATE sanpham SET tgketthuc=DATE_ADD(tgketthuc, INTERVAL 10 MINUTE)WHERE tgketthuc-now()<=300 and giahantudong=1 and tgketthuc-now()>=0';
    console.log(sql);
    db.load(sql).then(function(){});
    return 1;
}
async function getMaxId()
{
    var sql='SELECT MAX(id) FROM sanpham';
    return await db.load(sql).then(function(data)
    {
        return data;
    })
    
}

exports.relevantProduct=function(id)
{
    var deferred=Q.defer();
    var sql='(select SP.* from sanpham SP where SP.danhmuc=(SELECT SP1.danhmuc FROM sanpham SP1 WHERE masp='+id+'))';
    db.load(sql).then(function(row)
    {
        deferred.resolve(row);
    })
    return deferred.promise;
}
exports.recentProduct=function()
{
    var deferred=Q.defer();
    var sql=mustache.render('select * from sanpham where tgketthuc>now() order by tgbatdau desc limit 6');
    db.load(sql).then(function(row)
    {
        deferred.resolve(row);
    })
    return deferred.promise;
}
exports.newProduct = function(entity) {
    var deferred = Q.defer();
    console.log(entity.thongtin+"ISSSS");
    var sql = mustache.render('INSERT INTO sanpham (tensp, giahientai,solandaugia, giamuangay, tgbatdau, tgketthuc, tinhtrang, thongtin, manguoiban, danhmuc, mota,  buocgia,giakhoidiem,giahantudong )VALUES ("{{tensp}}", {{giakhoidiem}},0, {{giamuangay}}, "{{tgbatdau}}", "{{tgketthuc}}", 1, "{{thongtin}}", {{nguoiban}}, {{loaisp}}, "{{mota}}",  {{buocgia}},{{giakhoidiem}}, {{cogiahan}})', entity);

    db.insert(sql).then(function(rowid) {
        deferred.resolve(rowid);
    });
 
    return deferred.promise;
 }
 
exports.updateProduct = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('UPDATE sanpham set thongtin = "{{thongtin}}" where masp={{id}}', entity);

    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadPageByCat = function(id, limit, offset,idAcc) {

    var deferred = Q.defer();

    var promises = [];

    var view = {
        id: id,
        limit: limit,
        offset: offset
    };

    var sqlCount = mustache.render('select count(*) as total from sanpham where danhmuc = {{id}}', view);
    promises.push(db.load(sqlCount));

    var sql = mustache.render('SELECT RS.*,TK.ten as tennguoigiugia FROM ((select *from sanpham as SP,taikhoan as TK where danhmuc = {{id}} limit {{limit}} offset {{offset}}) as RS left join taikhoan as TK on TK.id=RS.nguoigiugia)', view);
    promises.push(db.load(sql));
    
    var sql1=mustache.render('select * from theodoi where nguoitheodoi='+idAcc);
    promises.push(db.load(sql1));

    Q.all(promises).spread(function(totalRow, rows,rows2) {

        for(var i=0;i<rows.length;i++)
        {
            rows[i].watching='Yêu thích';
             rows[i].isRecent=0;
            if(isNew1(rows[i].tgbatdau))
            {
                rows[i].isRecent=1;
            }
       for(var j=0;j<rows2.length;j++)
       {
            if(rows[i].masp==rows2[j].masp)
            {
                rows[i].watching='Đã thích';
            }
       }
    }
    console.log(rows);
    console.log(rows2);
        var data = {
            total: totalRow[0].total,
            list: rows
        }
        
        deferred.resolve(data);
    });

    return deferred.promise;
}

exports.loadAllByCat = function(id) {

    var deferred = Q.defer();

    var sql = 'select * from sanpham where danhmuc = ' + id;
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.loadDetail = function(id, isLoggedin, accId) {

    var deferred = Q.defer();

    var promises = [];

   
    var sql = 'select SP.*,TK.ten,TK.diemcong as diemcongnguoiban,TK.diemtru as diemtrunguoiban from sanpham SP, taikhoan TK where SP.manguoiban = TK.id and SP.masp = ' + id  ;
    
    if (!isLoggedin) {
        db.load(sql).then(function(rows) {
            if (rows) {
               if(rows[0].nguoigiugia!=null)
               {
                var temp={};
               rows[0].thongtin=rows[0].thongtin.replace(/&lt;/g,"<");
               rows[0].thongtin=rows[0].thongtin.replace(/&gt;/g,">");
               rows[0].thongtin=rows[0].thongtin.replace(/\r\n/g,"");
               rows[0].thongtin=rows[0].thongtin.replace(/&#x2F;/g,"/");
               rows[0].thongtin= rows[0].thongtin.replace(/&#39;/g,"'");
               rows[0].thongtin= rows[0].thongtin.replace(/&#x3D;/g,"=");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;ocirc;/g,"ô");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;agrave;/g,"à");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;oacute;/g,"ó");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;acirc;/g,"â");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;yacute;/g,"ý");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;aacute;/g,"á");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;ugrave;/g,"ù");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;uacute;/g,"ú");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;atilde;/g,"ể");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;ecirc;/g,"ê");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;igrave;/g,"ì");
               rows[0].thongtin= rows[0].thongtin.replace(/&amp;iacute;/g,"í");
              
              
                temp=rows[0];
                   var sql1='SELECT ten,diemcong,diemtru FROM TAIKHOAN WHERE id='+rows[0].nguoigiugia;
                   db.load(sql1).then(function(rows1)
                   {
                     
                       temp.tennguoigiugia=rows1[0].ten;
                       temp.diemcongnguoigiugia=rows1[0].diemcong;
                       temp.diemtrunguoigiugia=rows1[0].diemtru;
                       deferred.resolve(temp);
                   });
                  
                  
               }
               rows[0].thongtin=rows[0].thongtin.replace(/&lt;/g,"<");
               rows[0].thongtin=rows[0].thongtin.replace(/&gt;/g,">");
               rows[0].thongtin=rows[0].thongtin.replace(/\r\n/g,"");
               rows[0].thongtin=rows[0].thongtin.replace(/&#x2F;/g,"/");
               rows[0].thongtin= rows[0].thongtin.replace(/&#39;/g,"'");
               rows[0].thongtin= rows[0].thongtin.replace(/&#x3D;/g,"=");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;ocirc;/g,"ô");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;agrave;/g,"à");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;oacute;/g,"ó");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;acirc;/g,"â");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;yacute;/g,"ý");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;aacute;/g,"á");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;ugrave;/g,"ù");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;uacute;/g,"ú");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;atilde;/g,"ể");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;ecirc;/g,"ê");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;igrave;/g,"ì");
                rows[0].thongtin= rows[0].thongtin.replace(/&amp;iacute;/g,"í");
                deferred.resolve(rows[0]);
               
            } else {
                deferred.resolve(null);
            }
        });
    }
    else {
        

        var sqlWatching = 'select * from theodoi where nguoitheodoi = ' + accId + ' and masp = ' + id;
        console.log(sqlWatching);
        promises.push(db.load(sql));
        promises.push(db.load(sqlWatching));

        Q.all(promises).spread(function(product, wtchng) {
           
            var temp={};
            temp=product[0];
            var sql1='SELECT ten,diemcong,diemtru FROM TAIKHOAN WHERE id='+product[0].nguoigiugia;
                  db.load(sql1).then(function(rows1)
                   {
                    
                       temp.tennguoigiugia=rows1[0].ten;
                       temp.diemcongnguoigiugia=rows1[0].diemcong;
                       temp.diemtrunguoigiugia=rows1[0].diemtru;
                      
                   });
                  
                   product[0]=temp;
                   product[0].thongtin= product[0].thongtin.replace(/&lt;/g,"<");
                   product[0].thongtin= product[0].thongtin.replace(/&gt;/g,">");
                   product[0].thongtin= product[0].thongtin.replace(/\r\n/g,"");
                   product[0].thongtin= product[0].thongtin.replace(/&#x2F;/g,"/");
                   product[0].thongtin= product[0].thongtin.replace(/&#39;/g,"'");
                   product[0].thongtin= product[0].thongtin.replace(/&#x3D;/g,"=");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;ocirc;/g,"ô");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;agrave;/g,"à");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;oacute;/g,"ó");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;acirc;/g,"â");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;yacute;/g,"ý");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;aacute;/g,"á");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;ugrave;/g,"ù");
                   product[0].thongtin=product[0].thongtin.replace(/&amp;uacute;/g,"ú");
                   product[0].thongtin=product[0].thongtin.replace(/&amp;atilde;/g,"ể");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;ecirc;/g,"ê");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;igrave;/g,"ì");
                   product[0].thongtin= product[0].thongtin.replace(/&amp;iacute;/g,"í");
                   var theodoi = 'Yêu thích';
                   if (wtchng.length > 0)
                       theodoi = 'Đã thích';
                   var data = {
                       pro: product[0],
                       watching: theodoi
                   }
                  
                   deferred.resolve(data);
        });
    }
    
    return deferred.promise;
}

exports.loadProductbyId = function(id) {
    var deferred = Q.defer();
    var sql = 'select * from sanpham where masp = ' + id;
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}
exports.loadProductbyId1 = function(id) {
    var deferred = Q.defer();
    var sql = 'SELECT RS.*,TK.email from((select sp.* from sanpham sp where sp.masp='+id+') as RS left join taikhoan tk on RS.nguoigiugia=tk.id)';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadSellerByProductId = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    var sql = mustache.render('SELECT sp.masp, tk.* FROM sanpham sp, taikhoan tk WHERE sp.manguoiban=tk.id and sp.masp={{id}}', entity);
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadTopRaGia = function() {
    var deferred = Q.defer();
    var sql = 'select * from sanpham order by solandaugia desc limit 6';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadTopGiaCao = function() {
    var deferred = Q.defer();
    var sql = 'select * from sanpham where tgketthuc > now() order by giahientai desc limit 6';
   // var sql = 'select * from sanpham order by giahientai desc limit 6';
   
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadGanKetThuc = function() {
    var deferred = Q.defer();
    var sql = 'select * from sanpham where tgketthuc > now() order by tgketthuc asc limit 6';
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.insertTheoDoi = function(idnguoitheodoi, idsanpham) {
    var deferred = Q.defer();
    var sql = 'insert into theodoi values("' + idnguoitheodoi + '", "' + idsanpham + '")';
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.deleteTheoDoi=function(idnguoitheodoi,idsanpham)
{
    var deferred = Q.defer();
    var sql = 'delete theodoi where nguoitheodoi='+idnguoitheodoi+'masp='+idsanpham;
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}
exports.insertragia = function(idnguoiragia, idsanpham, entity) {
    var deferred = Q.defer();
    console.log(idnguoiragia,idsanpham,parseInt(entity.giaphaitra));
    var currentdate = new Date(); 
    var datetime = + currentdate.getFullYear() + "-"
                + (currentdate.getMonth() + 1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

    var sql = mustache.render('insert into ragia values(' + idnguoiragia + ', ' + idsanpham + ','+ parseInt(entity.giaphaitra)+',"'+datetime+ '")');
    
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.updateDatGiaHienTai = function(idsanpham, entity) {
    var deferred = Q.defer();
    console.log(entity);
    var sql = mustache.render('update sanpham set giahientai = {{giaphaitra}}, solandaugia = solandaugia + 1, nguoigiugia = {{nguoigiugia}} where masp = ' + idsanpham, entity);
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadBidLogById = function(id) {
    var deferred = Q.defer();
    var promises=[];
    var sql = 'select * from taikhoan TK, ragia RG where RG.masp = '+ id + ' and TK.id = RG.nguoiragia order by thoigiantra desc';
    promises.push(db.load(sql));
    var sql1='select * from lichsudaugia';
    promises.push(db.load(sql1));
    var sql2='select * from sanpham where masp='+id;
    promises.push(db.load(sql2));
    Q.all(promises).spread(function(rows,rows1,rows2)
    {
        console.log(rows);
        for(var i=0;i<rows.length;i++)
        {
            rows[i].nhanxet='TÀI KHOẢN NÀY CHƯA NHẬN XÉT';
            rows[i].manguoiban=rows2[0].manguoiban;
            for(var j=0;j<rows1.length;j++)
            {
                if(rows[i].id==rows1[j].idnguoimua && rows[i].masp==rows1[j].idsp)
                {
                    rows[i].nhanxet=rows1[j].danhgia;
                    rows[i].diem=rows1[j].diemdanhgia;
                }
            }
        }
       
        deferred.resolve(rows);
    })
    // db.load(sql).then(function(rows) {
    //     console.log(rows);
    //     if (rows) {
    //         deferred.resolve(rows);
    //     } else {
    //         deferred.resolve(null);
    //     }
    // });

    return deferred.promise;
}

exports.loadCamDauGia = function(tk, sp) {
    var deferred = Q.defer();
    var sql = 'select * from camdaugia where masp = '+ sp + ' and matk = ' + tk;
    db.load(sql).then(function(rows) {
        if (rows) {
            deferred.resolve(rows);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadHetHan = function(id) {
  
    var deferred = Q.defer();

    var currentdate = new Date(); 
    var datetime = + currentdate.getFullYear() + "-"
                + (currentdate.getMonth() + 1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

    // var sql = 'select * from sanpham where masp = '+ id + ' and tgketthuc < "' + datetime + '"';
    var sql = 'select * from sanpham where masp = '+ id + ' and tgketthuc < now()';
    console.log(sql);
    db.load(sql).then(function(rows) {
       
        if (rows.length > 0) {
            deferred.resolve(rows);
           
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

//hàm lấy danh sách sản phẩm dựa trên từ khóa, loại sản phẩm
exports.searchProduct = function(word, cat, orderBy, limit, offset,idAcc) {
    var deferred = Q.defer();
 
   
    var entity = {
        limit: limit,
        offset: offset,
        orderBy: orderBy,
        word: word, 
        cat: cat
    };



    var promises = [];
     
    var sql_1 = mustache.render('SELECT COUNT(*) as total from sanpham sp, danhmuc dm, taikhoan tk where sp.tensp LIKE CONCAT ("%","{{word}}" ,"%") and sp.danhmuc={{cat}} and dm.id = sp.danhmuc and sp.manguoiban = tk.id ORDER BY {{orderBy}}', entity);
    promises.push(db.load(sql_1));
 
    var sql_2 = mustache.render('SELECT sp.*, dm.tendanhmuc, tk.ten ,(select tk1.ten from taikhoan tk1 where tk1.id=sp.nguoigiugia) as ten1 from sanpham sp, danhmuc dm, taikhoan tk where sp.tensp LIKE CONCAT("%","{{word}}" ,"%") and sp.danhmuc={{cat}} and dm.id = sp.danhmuc and sp.manguoiban = tk.id ORDER BY {{orderBy}} LIMIT {{limit}} OFFSET {{offset}}', entity);
    promises.push(db.load(sql_2));
 
    var sql1=mustache.render('select * from theodoi where nguoitheodoi='+idAcc);
    promises.push(db.load(sql1));

    Q.all(promises).spread(function(totalRow, rows,rows2) {
        for(var i=0;i<rows.length;i++)
        {
            rows[i].watching='Yêu thích';
       for(var j=0;j<rows2.length;j++)
       {
            if(rows[i].masp==rows2[j].masp)
            {
                rows[i].watching='Đã thích';
            }
       }
    }

        var data = {
             total: totalRow[0].total,
             rows: rows
        }
        
        deferred.resolve(data);
    });
 
 
    return deferred.promise;
}

exports.insertCamDauGia = function(matk, masp) {
    var deferred = Q.defer();
    var sql = 'insert into camdaugia values('+matk+','+masp+')';
    db.insert(sql).then(function(row1)
    {
        var sql1='delete from ragia where nguoiragia='+matk+' and masp='+masp;
        db.delete(sql1).then(function(row2)
        {
            var sql3='select * from ragia where masp='+masp+' and giaduara=(select MAX(RG1.giaduara) from ragia RG1 where RG1.masp='+masp+')';
            db.load(sql3).then(function(row3)
            {
                console.log(row3.length);
               if(row3.length!=0)
               {
                var sql4 = 'update sanpham set giahientai = ' + row3[0].giaduara + ', nguoigiugia = ' + row3[0].nguoiragia + ' where masp = ' + row3[0].masp;
                db.load(sql4).then(function(changedRows) {
                    deferred.resolve(changedRows);
                });
               
               }
               else
               {
               console.log("voo");
                    var sql5 = 'update sanpham set giahientai =giakhoidiem,nguoigiugia =null where masp = ' + masp;
                    console.log(sql5);
                        db.load(sql5).then(function(changedRows)
                        {
                            deferred.resolve(changedRows);
                        });

                       
               
            }
                
            })
        })
        
    })
//     var promises = [];
//     var sql = 'insert into camdaugia values('+matk+','+masp+')';
//     promises.push(db.insert(sql));
//     var sql1='delete from ragia where nguoiragia='+matk+' and masp='+masp;
//     promises.push(db.delete(sql1));
//     var sql2='select * from ragia where masp='+masp+' and giaduara=(select MAX(RG1.giaduara) from ragia RG1 where RG1.masp='+masp+')';
//     promises.push(db.load(sql2));
//    Q.all(promises).spread(function(row,row1,row2) {
//     var data={
//         total:row1,
//       total1:row2,
//       total2:row2};
//      console.log(row2);
//        if(1)
//        {
//            product.updateNguoiGiuGia(row2.nguoiragia,row2.masp,row2.giaduara).then(function(res)
//            {
//                console.log("VO TH1111");
//                 data.res=res;
//                  deferred.resolve(data);
//            })
//        }
//        else
//        {
//            product.updateNguoiGiuGia1(masp).then(function(res)
//            {
//             console.log("VO TH222");
//             data.res=res;
//             deferred.resolve(data);
//            })
//        }
      
//    });
return deferred.promise;
   
}

exports.deleteragia = function(tk, sp) {
    var deferred = Q.defer();

    var sql = 'delete from ragia where nguoiragia = ' + tk + ' and sanpham = ' + sp;
    db.delete(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.updateNguoiGiuGia = function(tk, sp, gia) {
    var deferred = Q.defer();

    var sql = 'update sanpham set giahientai = ' + gia + ', nguoigiugia = ' + tk + ' where masp = ' + sp;
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}
exports.updateNguoiGiuGia1 = function(sp) {
    var deferred = Q.defer();

    var sql = 'update sanpham set giahientai =giakhoidiem,nguoigiugia =null where masp = ' + sp;
    db.update(sql);

    return deferred.promise;
}

exports.loadragia = function(sp) {
    var deferred = Q.defer();
    var sql = 'select * from ragia where sanpham = '+ sp + ' order by gia desc';
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.updateSanPhamMuaNgay = function(tk, sp) {
    var deferred = Q.defer();

    var sql = 'update sanpham set giahientai = giamuangay, nguoigiugia = ' + tk + ' where masp = ' + sp;
    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}
exports.isNew=function (date)
{
date=new Date(date);
var timeDiff = moment()-date.getTime();
console.log(timeDiff);
if (timeDiff <= 3600000) {
return true;
}
return false;

}
function isNew1 (date)
{
date=new Date(date);
var timeDiff = moment()-date.getTime();
console.log(timeDiff);
if (timeDiff <= 3600000) {
return true;
}
return false;

}
