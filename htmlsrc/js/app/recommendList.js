/*
 * @Author: syding
 * @Date:   2015-06-12 10:58:53
 */

'use strict';

define(function (require, exports, module) {
	var doT = require('doT'),
		COM = require('com'),
		Dialog = require('dialog'),
		pageJson, Fun,
		loadingAction;

	pageJson = {
		init : function(){
			Fun = this.fun;
			loadingAction = COM.loading();
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){
				Fun.fnList();
            },
            fnList: function(status){
            	COM.listAjax({
					url: '/recommend/getRecommendDemandList',
					param: {						
						userId: 2,
						status: status
					},
					callback: function(data){
						loadingAction.remove();
						var tpl = doT.template($('#listTpl').html());
			 			$('.js-wrapper').append(tpl(data.result));
					}
				});
            }
		},
		events: function(){
		    $('.weui-navbar__item').on('click', function(){
		    	loadingAction = COM.loading();
		    	$(this).addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on');
		    	$('.js-wrapper').html('');
		    	var status = $(this).attr('data-status');
		    	Fun.fnList(status);
		    });

		}
	};
	pageJson.init();
})