/*
 * @Author: sanqi
 * @Date:   2015-06-12 10:58:53
 * @Last Modified by:   zhizi
 * @Last Modified time: 2015-11-09 17:10:21
 */

'use strict';

define(function (require, exports, module) {
	var doT = require('doT'),
		COM = require('com'),
		formCheck = require('formCheck'),
		Dialog = require('dialog'),
		pageJson, Fun;

	pageJson = {
		init : function(){
			Fun = this.fun;
			this.events();
			Fun.initPageInfoFun();
		},
		fun : {
			initPageInfoFun : function(){
                formCheck.textareaCounter($('.js-counter'), 200);               
            },
            fnSaveAjax: function(param){
            	return new Promise(function (resolve, reject) {            	
		            COM.ajax({
		                url: '/demand/save',
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
			$('.js_publish').on('click', function(){ 
				var title = $('[name="title"]').val(),
					demandContent = $('[name="demandContent"]').val(),
					commissionNumber = $('[name="commissionNumber"]').val();

				if(title == "" || demandContent == ""){
					if(title == "" && demandContent == ""){
						$('.weui-cell_warn').html('题目与内容不能为空！');
						return false;
					}
					if(demandContent == ""){
						$('.weui-cell_warn').html('内容不能为空！');
						return false;
					}
					if(title == ""){
						$('.weui-cell_warn').html('题目不能为空！');
						return false;
					}					
				}		

				var param = {
	                	title: title,
	                	demandContent: demandContent,
	                	commissionNumber: commissionNumber || 0,
	                	userId: '1'
	                }
				Fun.fnSaveAjax(param).then(function(res){					
					if(res.status == 'SUCCESS'){
						Dialog.confirm({
					        	title: '发布成功',
					        	content: '您在寻找一位钢琴老师，愿意付出500佣金。',
					        	okTitle: '微信支付',
					        	okCallback: function(){
					        		window.location.href = "publishList.html"
					        	}
					        });
					}
				});
		        
		    });


		}
	};
	pageJson.init();
})