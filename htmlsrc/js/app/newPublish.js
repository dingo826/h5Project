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
		wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js'),
		pageJson, Fun,
		pickerJson = [];

	pageJson = {
		init : function(){
			Fun = this.fun;
			this.events();
			Fun.initPageInfoFun(),
			COM.initWxConfig(wx);
		},
		fun : {
			initPageInfoFun : function(){
                formCheck.textareaCounter($('.js-counter'), 200);   
               
				Fun.fnGetAllCategory().then(function(res){
					console.log(res.result)
					$.each(res.result, function(i, o){
						var picker = {
							label: o.categoryName,
			            	value: i,
			            	id: o.id
						}
						pickerJson.push(picker);
					});
				});            
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
            },
            fnGetAllCategory: function(){
            	return new Promise(function (resolve, reject) {          	
		            COM.ajax({
		                url: '/category/getAllCategory',
		                type: 'post',
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
					commissionNumber = $('[name="commissionNumber"]').val(),
					category = $('.js_category').attr('data-id'),
					expire = $('[name="expire"]').val() * 3600,
					demandAttachmentArray = [];

				$("#uploaderFiles li").each(function(){
                    demandAttachmentArray.push($(this).attr("data-src"));
                });		
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
	                	"title": title,
	                	"demandContent": demandContent,
	                	"commissionNumber": commissionNumber || 0,
	                	"category": category,
	                	"expire": expire,
	                	"demandAttachmentArray": demandAttachmentArray
	                }

				Fun.fnSaveAjax(param).then(function(res){					
					if(res.status == 'SUCCESS'){
						//window.location.href = "publishList.html"
						/*Dialog.confirm({
					        	title: '发布成功',
					        	content: '您在寻找一位钢琴老师，愿意付出500佣金。',
					        	okTitle: '微信支付',
					        	okCallback: function(){
					        		window.location.href = "publishList.html"
					        	}
					        });*/
					}
				});
		        
		    });
			
			
			$('.js_type').on('click', function () {
		        weui.picker(pickerJson, {
		            onChange: function (result) {
		                console.log(result);
		            },
		            onConfirm: function (result) {
		            	$('.js_category').html(pickerJson[result].label);
		            	$('.js_category').attr('data-id', pickerJson[result].id);
		            }
		        });
		    });

			/*$('body').on('click', '.js-end', function(){
				var tpl = doT.template($('#pickerTpl').html());
			 	$('body').append(tpl());
			}).on('click', '#weui-picker-confirm', function(){
				$('.weui-mask').addClass('weui-animate-fade-out');
				$('.weui-picker').addClass('weui-animate-slide-down');
				setTimeout(function(){
					$('.picker-wrap').remove();
				},1000);
				
			});	*/

			$('.js_imgupload').on('click', function(ev){ 
                    var images = {
                        localId: [],
                        serverId: []
                    };                     

                  	wx.chooseImage({
                       success: function (res) {
                           images.localId = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                           var i = 0, length = images.localId.length;
                           function upload() {
                               wx.uploadImage({
                                   localId: images.localId[i],
                                   success: function (res) {
                                       $(".text").remove();
                                       i++;
                                       alert('已上传：' + i + '/' + length);                                       
                                       if (i < length) {
                                           upload();
                                       }
                                       
                                       //图片上传到自己服务器上
                                       $.ajax({
                                       		type: "POST",
                                            url: "http://blackdragon.tunnel.qydev.com/demand/uploadImage?mediaId=" + res.serverId,
                                            dataType:"json",
                                            success: function(data){
                                           		
                                           		$("#uploaderFiles").prepend("<li class='weui-uploader__file' data-src='"+data.filePath+"' style='background-image:url("+data.filePath+")'></li>");
                                           		
                                                images.serverId = [];
                                            	$("#uploaderFiles li").each(function(){
                                              		images.serverId.push($(this).attr("data-src"));
                                                });
                                              
                                              	$("#uploaderFiles li").on("click",function(){
                                                 	var i = $(this).index("#uploaderFiles li");
                                                    wx.previewImage({
                                                    	current: images.serverId[i],
                                                    	urls: images.serverId
                                                    });
                                                });
                                           },
                                           error: function (res) {
                                               alert("图片提交到自己服务器报错");
                                           }
                                       });
                                   },
                                   fail: function (res) {
                                       alert(JSON.stringify(res));
                                   }
                               });
                           }
                           upload();
                       }
                   });
            });

		}
	};
	pageJson.init();
})

