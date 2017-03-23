/*
 * @Author: syding
 * @Date:   2015-06-12 10:58:53
 */

'use strict';
define(function (require, exports, module) {
	var doT = require('doT'),
		formCheck = require('formCheck'),
		COM = require('com'),
		pageJson, Fun,
		demandId = COM.getParameter('demandId');

	pageJson = {
		init : function(){
			Fun = this.fun;			
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){
				Fun.fnListAjax(demandId).then(function(res){
					console.log(res.total)
					if(res.status == 'SUCCESS'){
						var tpl = doT.template($('#listTpl').html());						
			 			$('.js-view').html(tpl(res.result));
					}
					if(res.total == 0){
						var html = '<div class="weui-loadmore weui-loadmore_line">'+
							            '<span class="weui-loadmore__tips">详情评估暂无结束，请先评估全部详情</span>'+
							        '</div>'
						$('.js-view').html(html);
					}
				});
            },
            fnListAjax: function(id){
            	return new Promise(function (resolve, reject) {
		            COM.ajax({
		                url: '/demand/getCommissionList?page=0&size=10&demandId=' + demandId + '&userId=1',
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
})