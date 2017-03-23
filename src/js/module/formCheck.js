/*
 * @Author: syding
 * @Date:   2017-03-13 10:58:53
 * @Desc:  form表单页面层交互及校验
 */

'use strict';
define(function (require, exports, module) {
	exports.textareaCounter = function(obj, numbers){
		var $textarea = obj.find('textarea').eq(0),
			$span = obj.find('span');

		$textarea.on('keyup', function(){
			var _val = $(this).val(),
				_lens = _val.length;
			if(_lens > numbers ){
				//截取前面多少个字符
				//$(this).val(_val.substring(0,numbers));
				//_lens = $(this).val().length;
				$('.weui-textarea-counter').addClass('weui-cell_warn');
			}else{
				$('.weui-textarea-counter').removeClass('weui-cell_warn');
			}
			$span.html('').html(_lens);
		});
		
	};
	

});