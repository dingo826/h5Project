/*
 * @Author: syding
 * @Date:   2015-06-12 10:58:53
 */

'use strict';
define(function (require, exports, module) {
	var doT = require('doT'),
		COM = require('com'),
		formCheck = require('formCheck'),
		Dialog = require('dialog'),
		Comment = require('comment'),
		pageJson, Fun,
		loadingAction,
		id = COM.getParameter('id');

	pageJson = {
		init : function(){
			loadingAction = COM.loading();
			Fun = this.fun;			
			Fun.initPageInfoFun();
			this.events();
		},
		fun : {
			initPageInfoFun : function(){				
				Fun.fnDetailAjax(id).then(function(res){
					if(res.status == 'SUCCESS'){	
						loadingAction.remove();
						var tpl = doT.template($('#viewTpl').html());
			 			$('.js-view').html(tpl(res));
			 			formCheck.textareaCounter($('.js-counter'), 200);  
			 			if(res.recommend != null){
			 				Comment.comment(res.recommend.id);
			 			}
					}
				});
            },
            fnDetailAjax: function(id){
            	return new Promise(function (resolve, reject) {
		            COM.ajax({
		                url: '/recommend/demandDetail?demandId=' + id + '&userId=' + 2,
		                type: 'post',
		                suc: function (res) {
		                    resolve(res);  
		                }
		            })
		        });
            },
            fnSaveAjax: function(param){
            	return new Promise(function (resolve, reject) {            	
		            COM.ajax({
		                url: '/recommend/save',
		                type: 'post',
		                data: param,
		                isLoading: true,
		                suc: function (res) {
		                    resolve(res);  
		                }
		            })
		        });
            }
		},
		events: function(){			
			$('body').on('click', '.js_publish', function(){ 	
				var content = $('[name="content"]').val();

				if(content == ""){
					$('.weui-cell_warn').html('内容不能为空！');
					return false;
				}	
				var param = {
	                	demandId: id,
	                	recommendContent: content,
	                	userId: '2'
	                }
	             Dialog.confirm({
		        	title: '推荐内容是否确定发布？',
		        	okCallback: function(){
		        		Fun.fnSaveAjax(param).then(function(res){	
		        			var _url = window.location.href;		
							if(res.status == 'SUCCESS'){
								window.location.href = _url;
							}
						});
		        	}
		        });
		    });
			
		}
	};
	pageJson.init();
})