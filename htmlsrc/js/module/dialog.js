define(function(require,exports,module) {
	'use strict';
	var doT = require('doT');
	exports.alert = function(json){
		var dialog, dialogObj;
		dialog = ['<div class="dialog">',
					'<div class="dialog-cover"></div>',
					'<div class="dialog-main">',
						'<div class="dialog-content {{=it.cls}}">',
							'<div class="dialog-con">',
								'{{=it.htm}}',
							'</div>',
						'</div>',
					'</div>',
				'</div>'].join('');

		var dotHtml = doT.template(dialog);
		dialog = dotHtml(json);
		dialogObj = $(dialog).appendTo('body');
		$.each(json.events||[],function(i,v){
			dialogObj.on(i,v);
		})
		return dialogObj;
	}
    exports.dialog=function(json){
        var dialogObj=$(json.htm).appendTo('body');
        $.each(json.events||[],function(i,v){
            dialogObj.on(i,v);
        })
        return dialogObj;
    }
    
	exports.loading = function(text) {
		var loading = ['<div class="dialog dialog-loading">',
				'<div class="loading-main">',
					'<div class="loading-area">',
						'<div class="loading-cover-bg"></div>',
						'<div class="loading-content">',
							'<div class="loading-bg"></div>',
						  	'<p class="loading-info">正在加载中,请稍候.</p>',
						'</div>',
					'</div>',
				'</div>',
			'</div>'].join('');

		var loading = $('<div>').html(loading);
    	loading.appendTo('body');
    	//禁用其他事件
    	$('.dialog-loading').on('click touch', function(event) {
    		event.stopPropagation();

    	})
    	return loading;
	}
    exports.confirm = function(opts){
    	var options = {
        	title: '标题',
        	okTitle: '确定',
        	cancelTitle: '取消',
        	content: '',
        	okCallback: function(){},
        	cancleCallback: function(){}
        }
    	$.extend(options, opts);

        var dialog, dialogObj,
        	contentHtml = '<div class="js_dialog">'+
		            '<div class="weui-mask"></div>'+
		            '<div class="weui-dialog">'+
		                '<div class="weui-dialog__hd"><strong class="weui-dialog__title">'+ options.title +'</strong></div>'+
						'<div class="weui-dialog__bd">'+ options.content +'</div>'+
		                '<div class="weui-dialog__ft">'+
		                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default js-cancel">'+ options.cancelTitle + '</a>'+
		                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary js-confirm">'+ options.okTitle + '</a>'+
		                '</div>'+
		            '</div>',
		    noContentHtml = '<div class="js_dialog">'+
		            '<div class="weui-mask"></div>'+
		            '<div class="weui-dialog">'+
		                '<div class="weui-dialog__hd"><strong class="weui-dialog__title">'+ options.title +'</strong></div>'+
		                '<div class="weui-dialog__ft">'+
		                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default js-cancel">'+ options.cancelTitle + '</a>'+
		                    '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary js-confirm">'+ options.okTitle + '</a>'+
		                '</div>'+
		            '</div>';
        dialog =  (options.content == '') ? noContentHtml : contentHtml;        
        dialogObj = $(dialog).appendTo('body');

        dialogObj.on('click','.js-confirm',function(){
            options.okCallback&&options.okCallback();
            dialogObj.remove();
        });

        dialogObj.on('click', '.js-cancel',function(){        	
            options.cancel&&options.cancel();
            dialogObj.remove();
        });
        return dialogObj;
    }
    
});
