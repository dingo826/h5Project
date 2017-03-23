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
				Fun.fnDemandList();
            },
            fnCancleAjax: function(id){
            	return new Promise(function (resolve, reject) {
		            COM.ajax({
		                url: '/demand/cancle?demandId=' + id,
		                type: 'post',
		                isLoading: true,
		                suc: function (res) {
		                    resolve(res);  
		                }
		            })
		        });
            },
            fnDemandList: function(status){            	
            	COM.listAjax({
					url: '/demand/getDemandList',					
					param: {						
						userId: 1,
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
			$('body').on('click', '.js_publishCancle', function(){ 
		        var id = $(this).attr('data-id');				         
		        Dialog.confirm({
		        	title: '确定要取消该发布吗？',
		        	content: '',
		        	okCallback: function(){
		        		Fun.fnCancleAjax(id).then(function(data){
				        	var _url = window.location.href;
				        	if(data.status == 'SUCCESS'){					        		
				        		var _url = window.location.href;
				        		window.location.href = _url;
				        	}
				        });
		        	}
		        });
		    });

		    $('.weui-navbar__item').on('click', function(){
		    	loadingAction = COM.loading();
		    	$(this).addClass('weui-bar__item_on').siblings().removeClass('weui-bar__item_on');
		    	$('.js-wrapper').html('');
		    	var status = $(this).attr('data-status');
		    	Fun.fnDemandList(status);
		    });
		}
	};
	pageJson.init();
});