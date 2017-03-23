define(function(require,exports,module) {
	'use strict';
	/*
		基于发布的一些动作
		comment方法：渲染评论列表，发布评论及点击发表的一些js交互。
		evaluate方法：评估处理
	*/
	var doT = require('doT'),
		Dialog = require('dialog'),
		COM = require('com');
	exports.comment = function(id){
		COM.listAjax({
			url: '/comment/getCommentList',
			param: {
				page: 0,
				size: 4,
				recommendId: id
			},
			listType: 2,
			callback: function(data, page, totalPage){
				var tpl = doT.template($('#commentViewTpl').html());
				if(page == undefined){					
					var tpl = doT.template($('#commentViewTpl').html());
		 			$('.js_commentwrap').append(tpl(data));
				}else{
					var tpl = doT.template($('#commentViewSingleTpl').html());
					$('.js-wrapper').append(tpl(data.result));
				}
			}
		});

		_events(id);

		function _events(id){
    		$('body').on('blur', '.js_inputcontent', function(){
    			$('.input-content').removeClass('hover');
    		}).on('focus', '.js_inputcontent', function(){
    			$(this).parents('.input-content').addClass('active hover');
    			$('.input-content-btn').show();
    		}).on('keyup', '.js_inputcontent', function(){
    			var $this = $(this),
    				iVal = $this.html(),
    				iLens = iVal.length;
    			if(iLens > 0){
    				$('.input-content-label').hide();
    			}else if( iLens == 0 ){
    				$('.input-content-label').show();
    			}
    		}).on('click', '.js_inputcontent_cancle', function(){
    			$('.input-content').removeClass('active hover');
    			$('.input-content-btn').hide();
    			$('.js_inputcontent').html('');
    			$('.input-content-label').show();
    		}).on('click', '.js_label', function(){
    			$('.js_inputcontent').focus();
    		});

    		$('body').on('click', '.js_commentSubmit', function(){	
    			
    			var commentContent = $('[name="commentContent"]').html();
    			if(commentContent == ""){
    				$('.weui-cell_warn').html('内容不能为空！');
    				return false;
    			}	
    			var param = {
                    	recommendId: id,
                    	commentContent: commentContent,
                    	userId: '1'
                    }
    			_fnCommentSaveAjax(param).then(function(res){					
    				if(res.status == 'SUCCESS'){
    					var newDate = (new Date()).format('Y-M-d');
    					COM.hint('评论成功！');
    					$('.js_inputcontent').html('');
    					$('.js_label').show();
    					var html = '<div class="weui-media-box weui-media-box_appmsg">'+
    						            '<div class="weui-media-box__hd">'+
    						                '<img class="weui-media-box__thumb" src="../images/user.jpg">'+
    						            '</div>'+
    						            '<div class="weui-media-box__bd">'+
    						                '<h4 class="weui-media-box__title">如摄<em>'+ newDate +'</em></h4>'+
    						                '<p class="weui-media-box__desc">'+commentContent+'</p>'+
    						            '</div>'+
    						        '</div>';

    					$('.js-wrapper').prepend($(html));
    					var _lens = $('.js_commentLens').html();
    					$('.js_commentLens').html(parseInt(_lens) + 1);
    				}
    			});
    	    });
    	};

		function _fnCommentSaveAjax(param){
	    	return new Promise(function (resolve, reject) {            	
	            COM.ajax({
	                url: '/comment/save',
	                type: 'post',
	                data: param,
	                suc: function (res) {
	                    resolve(res);  
	                }
	            })
	        });
	    };
	}

	exports.evaluate = function(recommendId){
		$('body').on('click', '.js-pg a', function(){
			var _tag = $(this).attr('data-tag'),
				_tagName = $(this).attr('data-tagName'),
				_id = $(this).attr('data-id'),
				$title = $('[data-title='+_id+']'),
				$parents = $(this).parents('.js-pg');
				
			Dialog.confirm({
	        	title: '详情评估',
	        	content: '您确定结束这个发布内容，并给予评估'+_tagName+'。',
	        	okCallback: function(){
	        		var html;
	        		html = '<span class="status'+_tag+'">' + _tagName + '</span>';		        		
	        		_fnEvaluateAjax(_id, _tag).then(function(res){
	        			if(res.status == 'SUCCESS'){
	        				$parents.remove();
	        				$title.before(html);
	        			}
	        		});
	        	}
	        });
		});

		function _fnEvaluateAjax(recommendId, status){
        	return new Promise(function (resolve, reject) {            	
	            COM.ajax({
	                url: '/recommend/evaluate?id='+recommendId+'&status='+status,
	                type: 'post',
	                isLoading: true,
	                suc: function (res) {
	                    resolve(res);  
	                }
	            })
	        });
        }
	}
});