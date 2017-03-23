/*
 * @Author: syding
 * @Date:   2015-06-12 10:58:53
 */

'use strict';
define(function (require, exports, module) {
	var doT = require('doT'),
		formCheck = require('formCheck'),
		Dialog = require('dialog'),
		COM = require('com'),
		Comment = require('comment'),
		pageJson, Fun, loadingAction,
		recommendId = COM.getParameter('recommendId'),
		demandId = COM.getParameter('demandId');

	pageJson = {
		init : function(){
			Fun = this.fun;
			loadingAction = COM.loading();
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){
				Fun.fnDetailAjax(recommendId, demandId).then(function(res){					
					if(res.status == 'SUCCESS'){
						loadingAction.remove();
						var tpl = doT.template($('#viewTpl').html());
			 			$('.js-view').html(tpl(res));
			 			Comment.evaluate();
					}
				});
				//评论列表及发表评论
				Comment.comment(recommendId);
            },
            fnDetailAjax: function(recommendId, demandId){
            	return new Promise(function (resolve, reject) {
		            COM.ajax({
		                url: '/recommend/detail?recommendId=' + recommendId + '&&demandId=' + demandId,
		                type: 'post',
		                isLoading: true,
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