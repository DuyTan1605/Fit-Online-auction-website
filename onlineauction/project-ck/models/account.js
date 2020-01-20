var Q = require('q');
var mustache = require('mustache');
var moment = require('moment');

var db = require('../app-helpers/dbHelper');

exports.setNewPass=function(pw)
{
    var deferred = Q.defer();
    pw.newPW=pw.newPW.replace(/&#x2F;/g,"/");
    var sql = mustache.render('UPDATE taikhoan SET matkhau="{{newPW}}" WHERE email="{{id}}"', pw);
    db.update(sql).then(function(rows) {
        
        if(rows>0)
        {
            
            deferred.resolve(rows);
        }
        else {
            deferred.resolve(0);
        }
    });
    
    return deferred.promise;
}
exports.downLevel=function(entity)
{
    var deferred = Q.defer();

    var sql = mustache.render(
        'update taikhoan set quyenhan=0 where id = {{id}}',
        entity
    );
        console.log(sql);
    db.update(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}
async function KT(idsp,idnguoimua)
{
    var sql='SELECT * FROM ketquadaugia WHERE idsp='+idsp+' AND idnguoimua='+idnguoimua;
   
    return  await db.load(sql).then(function(res)
    {
        
        return res.length;

    });
}
async function loadLevelById(id)
{
    var sql='SELECT * FROM taikhoan WHERE id='+id;
    return  await db.load(sql).then(function(res)
    {
        
        return res.quyenhan;

    });
}
module.exports.loadAddress=async function (id)
{
    var sql='SELECT * FROM taikhoan WHERE id='+id;
   var res=await db.load(sql);
   
       
        return res[0].diachi;

    
}
// async function upHandle(idsp,idnguoimua,idnguoiban)
// {
//     var sql1='INSERT INTO ketquadaugia(idsp,idnguoiban,idnguoimua) VALUES('+idsp+','+idnguoiban+','+idnguoimua+')';
//     console.log(sql1);
//     db.load(sql).then(function(res)
//     {
        
//         return res.length;

//     });
// }
exports.updateHistory=async function(entity)
{
    var result=[];
    var dem=0;
    for(var i=0;i<entity.length;i++)
    {
        var temp={};
        temp.idsp=entity[i].masp;
        temp.idnguoimua=entity[i].nguoigiugia;
        temp.idnguoiban=entity[i].manguoiban;
      result[dem]=await KT(temp.idsp,temp.idnguoimua);
      if(result[dem]==0)
      {
      var sql1=mustache.render('INSERT INTO ketquadaugia(idsp,idnguoiban,idnguoimua) VALUES({{idsp}},{{idnguoiban}},{{idnguoimua}}) ',temp);
      console.log(sql1);
       db.load(sql1);
      }
        dem++;
    
    }
   
    
}
exports.updateStatus = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('UPDATE taikhoan SET trangthai=1 WHERE id={{id}}', entity);
    db.update(sql).then(function(result) {
        if (result > 0) {
            var sql_2 = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', entity);
            db.load(sql_2).then(function(rows) {
                var account = {
                    id: rows[0].id,
                    //username: rows[0].f_Username,
                    name: rows[0].ten,
                    email: rows[0].email,
                    dob: rows[0].ngaysinh,
                    permission: rows[0].quyenhan,
                    gender: rows[0].gioitinh,
                    positivepoint: rows[0].diemcong,
                    negativepoint: rows[0].diemtru,
                    //address:rows[0].diachi
                }
                deferred.resolve(account);
            });
        } else {
            deferred.resolve(null);
        }
    });
    return deferred.promise;
}

exports.loadAccountbyId = function(id) {
    var deferred = Q.defer();
    var sql = 'select * from taikhoan where id = ' + id;
    
    db.load(sql).then(function(rows) {
        if (rows) {
           
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

module.exports.loadAccountbyEmail =async function(email) {
   let sql='SELECT * FROM taikhoan WHERE email="'+email+'"';
  
  
   const rs=await db.load(sql);
   console.log(rs[0]);
   if(rs.length>0)
   {

    return rs[0];
    }
    return null;
}

exports.insert = function(entity) {

    var deferred = Q.defer();
   entity.password=entity.password.replace(/&#x2F;/g,"/");
    var sql =
        mustache.render(
            'insert into taikhoan (matkhau, ten, email, ngaysinh, quyenhan, gioitinh,diachi) values ( "{{password}}", "{{name}}", "{{email}}", "{{dob}}", {{permission}}, {{gender}},"{{address}}")',
            entity
        );

    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });

    return deferred.promise;
}

exports.updateInfo = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('UPDATE taikhoan SET ten = "{{name}}", ngaysinh="{{dob}}", gioitinh={{gender}},diachi="{{address}}" WHERE id={{id}}', entity);
    db.update(sql).then(function(result) {
        if (result > 0) {
            var sql_2 = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', entity);
            db.load(sql_2).then(function(rows) {
                var account = {
                    id: rows[0].id,
                    
                    name: rows[0].ten,
                    email: rows[0].email,
                    dob: rows[0].ngaysinh,
                    permission: rows[0].quyenhan,
                    gender: rows[0].gioitinh,
                    positivepoint: rows[0].diemcong,
                    negativepoint: rows[0].diemtru,
                    address:rows[0].diachi
                }
                deferred.resolve(account);
            });
        } else {
            var sql_2 = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', entity);
            db.load(sql_2).then(function(rows) {
                var account = {
                    id: rows[0].id,
                    
                    name: rows[0].ten,
                    email: rows[0].email,
                    dob: rows[0].ngaysinh,
                    permission: rows[0].quyenhan,
                    gender: rows[0].gioitinh,
                    positivepoint: rows[0].diemcong,
                    negativepoint: rows[0].diemtru,
                    address:rows[0].diachi
                }
                deferred.resolve(account);
            });
        }
    });
    return deferred.promise;
}

exports.updatePassword = function(pw) {
    var deferred = Q.defer();
    var sql = mustache.render('SELECT * FROM taikhoan WHERE id={{id}}', pw);
    db.load(sql).then(function(rows) {
       var temp=rows[0].matkhau.replace(/&#x2F;/g,"/");
       console.log(temp);
        if (pw.oldPW == temp || pw.oldPW == rows[0].matkhau) {
            var sql2 = mustache.render('UPDATE taikhoan SET matkhau="{{newPW}}" WHERE id={{id}}', pw);
            db.update(sql2).then(function(result) {
                if (result > 0) {
                    deferred.resolve(1);
                } else {
                    deferred.resolve(0);
                }
            });
        } else {
            deferred.resolve(0);
        }
    });
    
    return deferred.promise;
}

exports.login = function(entity) {

    var deferred = Q.defer();
   entity.password1=entity.password.replace("/","&#x2F;");
   console.log(entity);
    var sql =
        mustache.render(
            'select * from taikhoan where email = "{{email}}" and (matkhau = "{{password}}" or matkhau="{{password1}}")',
            entity
        );

    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            console.log(rows[0].diemcong);
            var account = {
                id: rows[0].id,
                //username: rows[0].f_Username,
                name: rows[0].ten,
                email: rows[0].email,
                dob: rows[0].ngaysinh,
                permission: rows[0].quyenhan,
                gender: rows[0].gioitinh,
                positivepoint: rows[0].diemcong,
                negativepoint: rows[0].diemtru,
                status:rows[0].trangthai,
                //address:rows[0].diachi
            }
            deferred.resolve(account);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.loadAll = function() {

    var deferred = Q.defer();

    var sql = 'select * from daugia.taikhoan where quyenhan != 4';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.delete = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render(
        'delete from taikhoan where id = {{id}}',
        entity
    );

    db.delete(sql).then(function(affectedRows) {
        deferred.resolve(affectedRows);
    });

    return deferred.promise;
}

exports.reset = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render(
        'update taikhoan set matkhau="{{pass}}" where id={{id}}',
        entity
    );

    db.update(sql).then(function(changedRows) {
        deferred.resolve(changedRows);
    });

    return deferred.promise;
}

exports.loadApproval = function() {

    var deferred = Q.defer();

    var sql = 'select tk.email, tk.ten, xb.id, xb.tgbatdau, xb.idnguoixin from taikhoan tk, xinban xb where tk.id = xb.idnguoixin and xb.trangthai = 0 order by xb.tgbatdau asc ';
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });

    return deferred.promise;
}

exports.updateApproval = function(id) {
    var deferred = Q.defer();
    var temp = moment() + (1000 * 3600 * 24 * 7);
    var entity = {
        id: id,
        date: moment(temp).format('YYYY-MM-DD')
    };
    var sql1 = mustache.render(
        'update xinban set trangthai = 1, tghethan = "{{date}}" where id = {{id}}',
        entity
    );
    db.update(sql1).then(function(changedRows1) {
        var sql2 = 'select idnguoixin from xinban where id =' + id;
        db.load(sql2).then(function(rows) {
            var idnguoixin = rows[0].idnguoixin;
            var sql3 = 'update taikhoan set quyenhan = 1 where id =' + idnguoixin;
            db.update(sql3).then(function(changedRows2) {
                deferred.resolve(changedRows1);
            });
        });
    });
    return deferred.promise;
}

exports.getWatchingList = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    var sql = mustache.render('SELECT DISTINCT TB1.*,TK1.ten AS nguoigiugia FROM (SELECT SP.*,TK.ten,DM.tendanhmuc FROM `theodoi` as TG,`sanpham` as SP,`taikhoan` as TK,`danhmuc` AS DM WHERE TG.nguoitheodoi={{id}} AND sp.masp=TG.masp AND TK.id=SP.manguoiban AND DM.id=SP.danhmuc) AS TB1 left join `taikhoan` AS TK1 ON TK1.id=TB1.nguoigiugia', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
      
        console.log(rows);
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.isPermittedToSell = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    
    //var sql = mustache.render('select xb.idnguoixin from xinban xb, taikhoan tk where tk.id={{id}}  and xb.idnguoixin = tk.id and xb.trangthai = 1 and xb.tghethan >= now() and tk.quyenhan!=0', entity);
    var sql=mustache.render('select * from taikhoan where quyenhan=1 and id='+id);
    console.log(sql);
    db.load(sql).then(function(rows) {
        console.log(rows);
        if (rows.length > 0) {
            console.log('true');
            deferred.resolve(true);
        } else 
        deferred.resolve(false);
    });
    return deferred.promise;
}

exports.getEmailById = function(id) {
    var deferred = Q.defer();

    var sql = 'select email from taikhoan where id =' + id;

    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(rows[0]);
        } else {
            deferred.resolve(null);
        }
    });

    return deferred.promise;
}

exports.isEmailExisted = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from taikhoan where email = "{{email}}"', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0) {
            deferred.resolve(true);
        } else {
            deferred.resolve(false);
        }
    });

    return deferred.promise;
}

exports.getRateDetail = function(id) {
    var deferred = Q.defer();
    var promises = [];
    var entity = {
        id: id
    };
    var sqlcount = mustache.render('select count(*) as total from ketquadaugia where idnguoiban = {{id}}', entity);
    //console.log(sqlcount);
    promises.push(db.load(sqlcount));

    var sql2 = mustache.render('select kq.*, tknguoimua.ten as tennguoimua, tknguoiban.ten as tennguoiban,sp.tensp as tensanpham from ketquadaugia kq, taikhoan tknguoimua, taikhoan tknguoiban,sanpham sp where ((kq.idnguoiban = {{id}} and kq.phanhoinguoimua is not null)or (kq.idnguoimua = {{id}} and kq.phanhoinguoiban is not null)) and tknguoimua.id = kq.idnguoimua and tknguoiban.id = kq.idnguoiban and sp.masp=kq.idsp', entity);
    //console.log(sql2);
    promises.push(db.load(sql2));

    Q.all(promises).spread(function(totalRow, rows) {
        var data = {
            total: totalRow[0].total,
            list: rows
        }
        deferred.resolve(data);
    });

    return deferred.promise;
}

exports.getRateDetail1 = function(id) {
    var deferred = Q.defer();
    var sql='select DG.*,SP.tensp as tensanpham,TK.ten as tennguoimua from danhgianguoiban DG,sanpham SP,taikhoan TK where DG.idnguoiban='+id+' and SP.masp=DG.idsp and DG.idnguoimua=TK.id';
    db.load(sql).then(function(rows)
    {
        deferred.resolve(rows);
    })

    return deferred.promise;
}

exports.getBidingList = function(id) {
    var deferred = Q.defer();
    var entity = {
        id: id
    };
    var sql = mustache.render('SELECT TB1.*,TK1.ten AS nguoigiugia FROM (SELECT SP.*,TK.ten,DM.tendanhmuc FROM `ragia` as RG,`sanpham` as SP,`taikhoan` as TK,`danhmuc` AS DM WHERE RG.nguoiragia={{id}} AND sp.masp=RG.masp AND TK.id=SP.manguoiban AND DM.id=SP.danhmuc) AS TB1 left join `taikhoan` AS TK1 ON TK1.id=TB1.nguoigiugia', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
      
        
        deferred.resolve(rows);
    });
    return deferred.promise;
}


exports.getWonList = function(id) {
    var deferred = Q.defer();

    var entity = {
        id: id
    };

    
    // var sql = mustache.render('select sp.*, tk.id, tk.ten as tennguoiban from sanpham sp, ketquadaugia kq, taikhoan tk where kq.idnguoimua = {{id}} and kq.idsp = sp.masp and tk.id = sp.manguoiban ', entity);
    var sql=mustache.render('SELECT SP.*,TK.*,TK1.ten AS tennguoiban,DM.tendanhmuc FROM `ragia` AS RG,`sanpham` AS SP,`taikhoan` AS TK,`taikhoan` AS TK1,`danhmuc` AS DM WHERE SP.masp=RG.masp AND SP.tgketthuc<now() AND TK.id=RG.nguoiragia AND RG.giaduara=SP.giahientai AND TK1.id=SP.manguoiban AND DM.id=SP.danhmuc AND TK.id={{id}}',entity);

    db.load(sql).then(function(rows) {
        
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.getSellingList = function(id,limit,offset) {
    var deferred = Q.defer();

    var entity = {
        id: id,
        limit:limit,
        offset:offset
    };

    var sql = mustache.render('select tb1.*, tk.ten as tennguoigiugia from taikhoan tk right Join (select sp.*, dm.tendanhmuc, tk1.ten as tennguoiban from sanpham sp, danhmuc dm, taikhoan tk1 where  sp.tgketthuc > now()  and dm.id = sp.danhmuc and tk1.id = sp.manguoiban and sp.manguoiban = {{id}}) tb1 on tb1.nguoigiugia = tk.id limit {{limit}} offset {{offset}}', entity);
    
    db.load(sql).then(function(rows) {

        var sql1=mustache.render('select tb1.*, tk.ten as tennguoigiugia from taikhoan tk right Join (select sp.*, dm.tendanhmuc, tk1.ten as tennguoiban from sanpham sp, danhmuc dm, taikhoan tk1 where  sp.tgketthuc > now()  and dm.id = sp.danhmuc and tk1.id = sp.manguoiban and sp.manguoiban = {{id}}) tb1 on tb1.nguoigiugia = tk.id', entity);
        db.load(sql1).then(function(rows1)
        {
            var data={rows:rows,
                total:rows1.length
            };
            deferred.resolve(data);
        })
       
    });
    return deferred.promise;
}

exports.getSoldList = function(id) {
    var deferred = Q.defer();

    var entity = {
        id: id
    };

    var sql = mustache.render('select sp.*, tk.id, tk.ten,DM.tendanhmuc from sanpham sp,taikhoan tk,danhmuc DM where DM.id=SP.danhmuc and sp.tgketthuc<now() and TK.id=SP.nguoigiugia and SP.manguoiban={{id}}', entity);
    db.load(sql).then(function(rows) {
        deferred.resolve(rows);
    });
    return deferred.promise;
}

exports.insertNewPer = function(id) {
    var deferred = Q.defer();
    var date = moment().format('YYYY-MM-DD HH:mm');
    var entity = {
        id: id,
        date: date
    };
    console.log(entity);
    //var sql = mustache.render('insert into xinban(idnguoixin, tgbatdau) values( {{id}},"{{date}}" )', entity);
    var sql='insert into xinban(idnguoixin,tgbatdau) values ('+entity.id+',"'+entity.date+'")';
    console.log(sql);
    db.insert(sql).then(function(insertId) {
        deferred.resolve(insertId);
    });
    return deferred.promise;
}

exports.daDanhGiaNguoiBan = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from ketquadaugia where idsp = {{idPro}} and phanhoinguoimua is not null and idnguoimua={{idBuyer}}', entity);
   
    db.load(sql).then(function(rows) {
        if (rows.length > 0)
        {
            deferred.resolve(true);
        }
        else
        {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
}

exports.daDanhGiaNguoiBan1=function(entity)
{
    var deferred = Q.defer();
  
    var sql = mustache.render('select * from danhgianguoiban where idsp = {{idPro}} and phanhoinguoimua is not null and idnguoimua={{idBuyer}}', entity);
    db.load(sql).then(function(rows)
    {
        if(rows.length>0)
        {
            deferred.resolve(true);
        }
        else
        {
            deferred.resolve(false);
        }
    });
    return deferred.promise;
}

exports.insertDanhGiaNguoiBan1=function(entity)
{
    var deferred = Q.defer();
  var promises=[];
    var sql = mustache.render('insert into danhgianguoiban values({{idPro}},{{idSeller}},"{{nx}}",{{idBuyer}},{{diem}})', entity);
    promises.push(db.load(sql));
    var sql2 = mustache.render('update taikhoan set diemcong = diemcong + {{diem}} where id = {{idSeller}}', entity);
    promises.push(db.update(sql2));
   Q.all(promises).spread(function(rows1,rows2)
   {
       deferred.resolve(rows1);
   })
    return deferred.promise;
}
exports.daDanhGiaNguoiMua = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('select * from ketquadaugia where idsp = {{idPro}} and phanhoinguoiban is null', entity);
    console.log(sql);
    db.load(sql).then(function(rows) {
        if (rows.length > 0)
        {
            deferred.resolve(false);
        }
        else
        {
            deferred.resolve(true);
        }
    });
    return deferred.promise;
}

exports.updateDanhGiaNguoiBan = function(entity) {
    var deferred = Q.defer();
    console.log(entity);
    var sql = mustache.render('update ketquadaugia set phanhoinguoimua = "{{nx}}", ngmuacongdiem={{diem}} where idsp = {{idPro}}', entity);
    
    db.update(sql).then(function(changedRows) {
        if(entity.diem > 0)
        {
            var sql1 = mustache.render('update taikhoan set diemcong = diemcong + 1 where id = {{idSeller}}', entity);
            console.log(sql1);
           
        }
        else
        {
            var sql1 = mustache.render('update taikhoan set diemtru = diemtru + 1 where id = {{idSeller}}', entity);
            console.log(sql1);
        }
        
        db.update(sql1).then(function(changedRows1){
            deferred.resolve(changedRows1);
        });
    });
    return deferred.promise;
}

exports.updateDanhGiaNguoiMua = function(entity) {
    var deferred = Q.defer();

    var sql = mustache.render('update ketquadaugia set phanhoinguoiban = "{{nx}}", ngbancongdiem={{diem}} where idsp = {{idPro}}', entity);
    console.log(sql);
    db.update(sql).then(function(changedRows) {
         if(entity.diem > 0)
        {
            var sql1 = mustache.render('update taikhoan set diemcong = diemcong + 1 where id = {{idBuyer}}', entity)
        }
        else
        {
            var sql1 = mustache.render('update taikhoan set diemtru = diemtru + 1 where id = {{idBuyer}}', entity)
        }
        console.log(sql1);
        db.update(sql1).then(function(changedRows1){
            deferred.resolve(changedRows1);
        });
    });
    return deferred.promise;
}
exports.checkRateProduct=function(idsp,id)
{
    var deferred=Q.defer();
    var sql='SELECT * FROM lichsudaugia WHERE idnguoimua='+id+' and idsp='+idsp;
    db.load(sql).then(function(res)
    {
        deferred.resolve(res);
    })
    return deferred.promise;
}
exports.updateRateProduct=function(idsp,id,nhanxet,diem)
{
    var deferred=Q.defer();
    var sql='INSERT INTO lichsudaugia VALUES('+id+','+idsp+',"'+nhanxet+'",'+diem+')';
    console.log(sql);
    db.load(sql).then(function(res)
    {
        deferred.resolve(res);
    })
    return deferred.promise;
}

