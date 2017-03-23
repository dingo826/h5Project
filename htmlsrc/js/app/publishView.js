/*
 * @Author: syding
 * @Date:   2015-06-12 10:58:53
 */

'use strict';
define(function (require, exports, module) {
	var doT = require('doT'),
		COM = require('com'),
		Comment = require('comment'),
		Dialog = require('dialog'),
		pageJson, Fun,
		loadingAction;

	pageJson = {
		init : function(){
			loadingAction = COM.loading();
			Fun = this.fun;			
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){
				var id = COM.getParameter('id');
				Fun.fnDetailAjax(id).then(function(res){
					if(res.status == 'SUCCESS'){	
						loadingAction.remove();
						var tpl = doT.template($('#viewTpl').html());
			 			$('.js-view').html(tpl(res.demand));

			 			Comment.evaluate();
					}
				});
				COM.listAjax({
					url: '/demand/getRecommendList',
					param: {						
						demandId: id
					},
					callback: function(res){
						var tpl = doT.template($('#viewListTpl').html());
			 			$('.js-wrapper').html(tpl(res.result));
					}
				});
            },
            fnDetailAjax: function(id){
            	return new Promise(function (resolve, reject) {
		            COM.ajax({
		                url: '/demand/detail?demandId=' + id,
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
})