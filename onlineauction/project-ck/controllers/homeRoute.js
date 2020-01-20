var express = require('express');
var product = require('../models/product');
var Q = require('q');

var homeRoute = express.Router();

homeRoute.get('/', function(req, res) {

	
	Q.all([
		product.loadTopRaGia(), product.loadTopGiaCao(), product.loadGanKetThuc(),product.recentProduct()
	]).then(function(rows) {
		//console.log(rows[0][0]);
		var topRaGia1 = [];
		var topRaGia2 = [];
		var topGiaCao1 = [];
		var topGiaCao2 = [];
		var ganKetThuc1 = [];
		var ganKetThuc2 = [];
		var moiDangGanDay1=[];
		var moiDangGanDay2=[];
		for (var i = 0; i < 3; i++) {
			topRaGia1.push(rows[0][i]);
			topGiaCao1.push(rows[1][i]);
			ganKetThuc1.push(rows[2][i]);
			moiDangGanDay1.push(rows[3][i]);
		}

		for (var i = 3; i < 6; i++) {
			topRaGia2.push(rows[0][i]);
			topGiaCao2.push(rows[1][i]);
			ganKetThuc2.push(rows[2][i]);
			moiDangGanDay2.push(rows[3][i]);
		}
		
	
		
		res.render('home/index', {
        	layoutModels: res.locals.layoutModels,
        	topRaGia1: topRaGia1,
        	topGiaCao1: topGiaCao1,
        	ganKetThuc1: ganKetThuc1,
        	topRaGia2: topRaGia2,
        	topGiaCao2: topGiaCao2,
			ganKetThuc2: ganKetThuc2,
			moiDangGanDay1:moiDangGanDay1,
			moiDangGanDay2:moiDangGanDay2
    	});
	});
	
    
});

module.exports = homeRoute;