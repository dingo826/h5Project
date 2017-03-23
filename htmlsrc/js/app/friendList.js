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
			loadingAction = COM.loading();
			Fun = this.fun;			
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){
				Fun.fnTagList();
            },
            fnTagList: function(status){            	
            	COM.listAjax({
					url: '/friend/getFriendList',	
					param: {						
						userId: 1
					},
					callback: function(data){						
						loadingAction.remove();
						var tpl = doT.template($('#listTpl').html());
			 			$('.js_wrapper').append(tpl(data.result));
					}
				});
            }
		},
		events: function(){}
	};
	pageJson.init();
});