/*
 * @Author: sanqi
 * @Date:   2015-06-12 10:58:53
 * @Last Modified by:   zhizi
 * @Last Modified time: 2015-11-09 17:10:21
 */

'use strict';

define(function (require, exports, module) {
	var doT = require('doT'),
		formCheck = require('formCheck'),
		pageJson;

	pageJson = {
		init : function(){
			var FUN = this.fun;
			this.events();
			FUN.initPageInfoFun();
		},
		fun : {
			initPageInfoFun : function(){
                formCheck.textareaCounter($('.js-counter'), 200)
            }
		},
		events: function(){
			$('.js_publish').on('click', function(){ 
		        var tpl = doT.template($('#publishTpl').html());
		        $('body').append(tpl());
		        $('.js_cancle').on('click', function(){		            
		            $('.js_dialog').hide('slow');
		        });
		    });
		}
	};
	pageJson.init();
})