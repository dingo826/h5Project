/*
 * @Author: syding
 * @Date:   2015-06-12 10:58:53
 */

'use strict';

define(function (require, exports, module) {
	var doT = require('doT'),
		COM = require('com'),
		Dialog = require('dialog'),
		localDB = new (require('localDB')),
		pageJson, Fun,
		loadingAction,
		openId = COM.getParameter('openId'),
		personInfo;

	pageJson = {
		init : function(){
			Fun = this.fun;			
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){
				personInfo = localDB.get('personInfo');
				
				/*if(personInfo == null){
					Fun.fnLoginAjax(openId).then(function(res){
						if(res.user){
	                    	personInfo = res.user;
	                    	localDB.set('personInfo', personInfo);
	                    	window.location.href = '../views/my.html';
	                    }else{
	                    	window.location.href = '../views/reg.html?openId=' + openId;
	                    }
					});
				}else{
					window.location.href = '../viewsmy.html';
				}*/
            },
            fnLoginAjax: function(id){
            	return new Promise(function (resolve, reject) {
		            COM.ajax({
		                url: '/user/login?openId=' + id,
		                type: 'post',
		                suc: function (res) {
		                    resolve(res); 
		                }
		            })
		        });
            }
		},
		events: function(){}
	};
	pageJson.init();
});