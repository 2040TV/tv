//UIJS
var MyTheme = {
	'Browser': {
		url: document.URL,
		domain: document.domain,
		title: document.title,
		language: (navigator.browserLanguage || navigator.language).toLowerCase(),
		canvas: function() {
			return !!document.createElement("canvas").getContext
		}(),
		useragent: function() {
			var a = navigator.userAgent;
			return {
				mobile: !! a.match(/AppleWebKit.*Mobile.*/),
				ios: !! a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
				android: -1 < a.indexOf("Android") || -1 < a.indexOf("Linux"),
				iPhone: -1 < a.indexOf("iPhone") || -1 < a.indexOf("Mac"),
				iPad: -1 < a.indexOf("iPad"),
				trident: -1 < a.indexOf("Trident"),
				presto: -1 < a.indexOf("Presto"),
				webKit: -1 < a.indexOf("AppleWebKit"),
				gecko: -1 < a.indexOf("Gecko") && -1 == a.indexOf("KHTML"),
				weixin: -1 < a.indexOf("MicroMessenger")
			}
		}()
	},
	'Cookie': {
		'Set':function(name,value,days){
	        var expires;
	        if (days) {
	            expires = days;
	        } else{
	            expires = "";
	        }
	        $.cookie(name,value,{expires:expires,path:'/'});
		},
		'Get':function(name){
			var styles = $.cookie(name);
		    return styles;
		},
		'Del':function(name,tips){
			if(window.confirm(tips)){
	            $.cookie(name,null,{expires:-1,path: '/'});
	            location.reload();
	       	}else{
	            return false;
	        }
		}
	},
	'Ajax':function(url,type,dataType,data,sfun,efun,cfun){
        type=type||'get';
        dataType=dataType||'json';
        data=data||'';
        efun=efun||'';
        cfun=cfun||'';

        $.ajax({
            url:url,
            type:type,
            dataType:dataType,
            data:data,
            timeout: 5000,
            beforeSend:function(XHR){
            },
            error:function(XHR,textStatus,errorThrown){
                if(efun) efun(XHR,textStatus,errorThrown);
            },
            success:function(data){
                sfun(data);
            },
            complete:function(XHR, TS){
                if(cfun) cfun(XHR, TS);
            }
        })
    },
	'Mobile': {	
		'Nav': {
			'Init': function() {
				if($(".nav-slide").length){
					$(".nav-slide").each(function(){
						var $that = $(this);
	                	MyTheme.Mobile.Nav.Set($that,$that.attr('data-align'));
	                });
				}
			},
			'Set': function(id,align) {
				$index = id.find('.active').index()*1;
				if($index > 3){
					$index = $index-3;
				}else{
					$index = 0;
				}
				id.flickity({
				  	cellAlign: align,
					freeScroll: true,
					contain: true,
					prevNextButtons: false,				
					pageDots: false,
					percentPosition: true,
					initialIndex: $index
				});	
			}	
		},
		'Mshare': function() {
			$(".open-share").click(function() {
				MyTheme.Browser.useragent.weixin ? $("body").append('<div class="mobile-share share-weixin"></div>') : $("body").append('<div class="mobile-share share-other"></div>');
				$(".mobile-share").click(function() {
					$(".mobile-share").remove();
					$("body").removeClass("modal-open");
				});
			});
		}
	},
	'Images': {
		'Lazyload': function() {
			$(".lazyload").lazyload({
				effect: "fadeIn",
				threshold: 200,
				failure_limit : 10,
				skip_invisible : false
			});
		},
		'Qrcode': {
			'Init': function() {
				if($("#qrcode").length){
					var $that = $("#qrcode");
	                MyTheme.Images.Qrcode.Set($that.attr('data-link'),$that.attr('data-dark'),$that.attr('data-light'));
	                $that.attr("class","img-responsive");
				}
			},
			'Set':  function(url,dark,light) {
				url=0||location.href;
				var qrcode = new QRCode('qrcode', {
				  	text: url,
				  	width: 120,
				  	height: 120,
				  	colorDark : dark,
				  	colorLight : light,
				  	correctLevel : QRCode.CorrectLevel.H
				});
			}	
		},
		'Flickity': {
			'Init': function() {
				if($(".flickity").length){
					$(".flickity").each(function(){
						var $that = $(this);
	                	MyTheme.Images.Flickity.Set($that,$that.attr('data-align'),$that.attr('data-dots'),$that.attr('data-next'),$that.attr('data-play'));
						$(this).click(function() {
							$(".lazyload").lazyload();
						});
	                });
				}
			},
			'Set': function(id,align,dots,next,play) {
				dots=dots||false;
				next=next||false;
				play=play||false;
				id.flickity({
				  	cellAlign: align,
				  	wrapAround: true,
				  	contain: true,
				  	pageDots: dots,
					autoPlay: play,
				  	percentPosition: true,
				  	prevNextButtons: next
				});	
			}	
		}
	},
	'Link': {
		'Copy': {
			'Init': function() {
				$(".myui-copy-link").each(function(){
					var links = $(this).attr("data-url");
					MyTheme.Link.Copy.Set(this,links);
				});
				$(".myui-copy-html").each(function(){
					var html = $(this).parent().find(".content").html();
					MyTheme.Link.Copy.Set(this,html);
				});
			},
			'Set': function(id,content) {
				var clipboard = new Clipboard(id, {
					text: function() {									
						return content;
					}
				});
				clipboard.on('success', function(e) {
					layer.msg('复制成功');
				});
				clipboard.on("error",function(e){
				    layer.msg('复制失败，请手动复制');
				});
			}
			
		},
		'Short': function(){
			$(".myui-short").each(function(){
				var codyId = this;
				var shortId = $(this);
				var shortUrl = shortId.val() || shortId.attr("data-url");
				var linkText = shortId.attr("data-text");
				if(myui.short==1){
					$.ajax({
						type : 'GET',
						url : myui.shortapi+encodeURIComponent(shortUrl),
						dataType : 'jsonp',
						success : function(r) {
							url_short = r.data.urls[0].url_short;
							if(shortId.val()){
								shortId.val(linkText+url_short);
							}else if(shortId.attr("data-url")){
								shortId.attr("data-url",url_short);
								MyTheme.Link.Copy.Set(codyId,linkText+url_short);
							}
						}
					});
				}else{
					if(shortId.val()){
						shortId.val(linkText+shortUrl);
					}else if(shortId.attr("data-url")){
						shortId.attr("data-url",shortUrl);
						MyTheme.Link.Copy.Set(codyId,linkText+shortUrl);
					}	
				}
			});
		}
	},
	'Layer': {
		'Img': function(title,src,text) {
			layer.open({
	   			type: 1,
		    	title: title,
		  		skin: 'layui-layer-rim',
		  		content: '<div class="col-pd"><p><img src="'+src+'" width="240" /></p><p class="text-center">'+text+'</p></div>'
		    });
		},
		'Html': function(title,html) {
			layer.open({
	   			type: 1,
		    	title: title,
		  		skin: 'layui-layer-rim',
		  		content: '<div class="col-pd">'+html+'</div>'
		    });
		},
		'Div': function(id) {
			layer.open({
				type: 1,
				title:false,
				skin: 'layui-layer-rim',
				content: $(id)
			});
		},
		'Popbody': function(name,html,day,wide,high) {
			var pop_is = MyTheme.Cookie.Get(name);
			var html = $(html).html();
			if(!pop_is){
				layer.open({
					type: 1,
					title: false,
					//skin: 'layui-layer-rim',
					content: html,
					area: [wide+'px', high+'px'],
					cancel: function(){
						MyTheme.Cookie.Set(name,1,day);
					}
				});
			}
		}
	},
	'Other': {
		'Headroom': function() {
			if($("#header-top").length){
				var header = document.querySelector("#header-top");
	            var headroom = new Headroom(header, {
					tolerance: 5,
					offset: 205,
					classes: {
						initial: "top-fixed",
						pinned: "top-fixed-up",
						unpinned: "top-fixed-down"
					}
				});
				headroom.init();
			}
			
		},
		'Popup': function(id) {
			$(id).addClass("popup-visible");
			$("body").append('<div class="mask"></div>').addClass("hidden");
			$(".close-popup").click(function() {
				$(id).removeClass("popup-visible");
				$(".mask").remove();
				$("body").removeClass("hidden");
			});
			$(".mask").click(function() {
				$(id).removeClass("popup-visible");
				$(this).remove();
				$("body").removeClass("hidden");
			});
		},
		'Bootstrap': function() {
			$('a[data-toggle="tab"]').on("shown.bs.tab", function(a) {
				var b = $(a.target).text();
				$(a.relatedTarget).text();
				$("span.active-tab").html(b);
				$(".lazyload").lazyload();
			});
		},
		'Skin': function() {
			var skinnum = 0,act;
		    var lengths = $("link[name='skin']").length;
		    $('.btnskin').click(function() {
		        skinnum+=1;
		        if(skinnum==lengths){skinnum=0;}
		        var skin = $("link[name='skin']").eq(skinnum).attr("href");
		        layer.msg("正在切换皮肤，请稍后...",{anim:5,time: 2000},function(){
		        	$("link[name='default']").attr({href:skin});
		        });
		        MyTheme.Cookie.Set('skinColor',skin,365);
		    });
		    var color = MyTheme.Cookie.Get('skinColor');
		    if(color){
		        $("link[name='default']").attr({href:color});
		    }  
		},
		'Sort': function() {
			$(".sort-button").each(function(){
				$(this).on("click",function(e){
					e.preventDefault();
					$(this).parent().parent().parent().find(".sort-list").each(function(){
					    var playlist=$(this).find("li");
					    for(let i=0,j=playlist.length-1;i<j;){
					        var l=playlist.eq(i).clone(true);
					        var r=playlist.eq(j).replaceWith(l);
					        playlist.eq(i).replaceWith(r);
					        ++i;
					        --j;
					    }
					});
				});
			});
		},
		'Search': function() {		    	
			$(".search-select p,.search-select li").click(function() {
	    		var action =$(this).attr("data-action");
	    		$("#search").attr("action",action);
	    		$(".search-select .text").text($(this).html());
		    });			
			$(".search_submit").click(function() {
	    		var value=$(".search_wd").val();
                if (!value) {
                    var wd=$(".search_wd").attr("placeholder");
                    $(".search_wd").val(wd);
                }
	    	});
	    	$(".open-search").click(function(){
				var seacrhBox=$(".search-box");
				seacrhBox.addClass("active").siblings().hide();
				seacrhBox.find(".form-control").focus();
				seacrhBox.find(".head-dropdown").toggle();
				$(".search-close").click(function(){
					seacrhBox.removeClass("active").siblings().show();
					seacrhBox.find(".dropdown-box").hide();
				});
			});	
		},
		'Collapse': function() {
			$(".text-collapse").each(function(){
				$(this).find(".details").on("click",function(){
					$(this).parent().find(".sketch").addClass("hide");
					$(this).parent().find(".data").css("display","");
					$(this).remove();
				});
			});
			$(".dropdown-hover").click(function(){
				$(this).find(".dropdown-box").toggle();
			});
		},
		'Scrolltop': function() {
			var a = $(window);
			$scrollTopLink = $("a.backtop");
			a.scroll(function() {
				500 < $(this).scrollTop() ? $scrollTopLink.css("display", "") : $scrollTopLink.css("display", "none");
			});
			$scrollTopLink.on("click", function() {
				$("html, body").animate({
					scrollTop: 0
				}, 400);
				return true;
			});
		},
		'Slidedown': function() {
			var display = $('.slideDown-box');
			
			$(".slideDown-btn").click(function() {
				
		  		if(display.css('display') == 'block'){
		  			display.slideUp("slow");
		  			$(this).html('展开  <i class="fa fa-angle-down"></i>');
				}else{
					display.slideDown("slow"); 
					$(this).html('收起   <i class="fa fa-angle-up"></i>');
				}
			});
		},
		'History': {
			'Init':function(){
				if($(".vod_history").length){
	                var $that = $(".vod_history");
	                MyTheme.Other.History.Set($that.attr('data-name'),$that.attr('data-link'),$that.attr('data-pic'),$that.attr('data-part'),$that.attr('data-limit'));
	            }
			},
			'Set':function(name,link,pic,part,limit){
				if(!link){ link = document.URL;}
				var history = MyTheme.Cookie.Get("history");
			    var len=0;
			    var canadd=true;
			    if(history){
			        history = eval("("+history+")"); 
			        len=history.length;
			        $(history).each(function(){
			            if(name==this.name){
			                canadd=false;
			                var json="[";
			                $(history).each(function(i){
			                    var temp_name,temp_img,temp_url,temp_part;
			                    if(this.name==name){
			                        temp_name=name;temp_img=pic;temp_url=link;temp_part=part;
			                    }else{
			                        temp_name=this.name;temp_img=this.pic;temp_url=this.link;temp_part=this.part;
			                    }
			                    json+="{\"name\":\""+temp_name+"\",\"pic\":\""+temp_img+"\",\"link\":\""+temp_url+"\",\"part\":\""+temp_part+"\"}";
			                    if(i!=len-1)
			                    json+=",";
			                })
			                json+="]";
			                MyTheme.Cookie.Set('history',json,365);
			                return false;
			            }
			        });
			    }
			    if(canadd){
			        var json="[";
			        var start=0;
			        var isfirst="]";
			        isfirst=!len?"]":",";
			        json+="{\"name\":\""+name+"\",\"pic\":\""+pic+"\",\"link\":\""+link+"\",\"part\":\""+part+"\"}"+isfirst;
			        if(len>limit-1)
		            	len-=1;
		        	for(i=0;i<len-1;i++){
		            	json+="{\"name\":\""+history[i].name+"\",\"pic\":\""+history[i].pic+"\",\"link\":\""+history[i].link+"\",\"part\":\""+history[i].part+"\"},";
		       	 	}
		        	if(len>0){
		            	json+="{\"name\":\""+history[len-1].name+"\",\"pic\":\""+history[len-1].pic+"\",\"link\":\""+history[len-1].link+"\",\"part\":\""+history[len-1].part+"\"}]";
		        	}
			        MyTheme.Cookie.Set('history',json,365);
			    }  
			}
		},
		'Player': function() {
			if($("#player-left").length){
				var PlayerLeft = $("#player-left");
		    	var PlayerSide = $("#player-sidebar");
				var LeftHeight = PlayerLeft.outerHeight();
				var Position = $("#playlist li.active").position().top;
				$("#player-sidebar-is").click(function() {
					PlayerSide.toggle();
					if(PlayerSide.css("display")==='none') {
						PlayerLeft.css("width","100%");
						$(this).html("<i class='fa fa-angle-left'></i>");
					}	
					if(PlayerSide.css("display")==='block') {
						PlayerLeft.css("width","");
						$(this).html("<i class='fa fa-angle-right'></i>");
					}
				});
				if(!MyTheme.Browser.useragent.mobile){
					PlayerSide.css({"height":LeftHeight,"overflow":"auto"});
					PlayerSide.scrollTop(Position);
				}
				PlayerSide.scroll(function(){
					$(".lazyload").lazyload();
				});
			}		
			if($(".player-fixed").length){
				if(!MyTheme.Browser.useragent.mobile){
					$(window).scroll(function(){
						if($(window).scrollTop()>window.outerHeight){
							$(".player-fixed").addClass("fixed fadeInDown");
							$(".player-fixed-off").show();
							$(".close-box").hide();
						}else if($(window).scrollTop()<window.outerHeight){
							$(".player-fixed").removeClass("fixed fadeInDown");
							$(".player-fixed-off").hide();
							$(".close-box").show();
						}
					});
				}
				$(".player-fixed-off").click(function() {
					$(".player-fixed").removeClass("fixed fadeInDown");
				});
			}
			
		},
		'Close': function() {
			$(".close-btn").on("click",function(){
				$(this).parents(".close-box").remove();
			});
		},
		'Roll': function(obj,higt,time) {
			setInterval(function(){ 
				$(obj).find("ul").animate({
					marginTop : higt,
				},time,function(){
					$(this).css({marginTop : "0px"}).find("li:first").appendTo(this);
				})
			}, 3000);
		},
		'Xunlei': function() {
			$.getScript(myui.thunderurl, function() {

				$(".common_down").on("click",function(){
					var link=$(this).parents("li").find("input[type='text']");
					var url=link.eq(0).val();
					var filename=$(this).parents("li").find(".text").eq(0).text();
					thunderLink.newTask({
						downloadDir: '下载目录',
						tasks: [{
							name: filename,
							url: url,
							size: 0
						}]
					});
				});

				$("input[name='checkall']").on("click",function(e){
					var checkboxs=$(this).parent().parent().parent().parent().find("input[name^='down_url_list_']");
					for(let i=checkboxs.length;i--;)
						checkboxs[i].checked=this.checked;
				});
		
				$(".thunder_down_all").on("click",function(){
					checked=$(this).parents(".downlist").find("li input[type='checkbox']:checked");
					
					if(checked.length<1){
							layer.msg("请选中要下载的文件");
						}
					else
						{
							var tasks=[];
							var links=$(this).parents(".downlist").find("li .down_url");
							var selectbox=$(this).parents(".downlist").find("li input[type='checkbox']");
				
							for(let i=0;i<links.length;++i){
								if(selectbox.eq(i).is(':checked')){
									var task={
										url:links.eq(i).val(),
										size:0
									};
									tasks.push(task);
								}
							}
									
							thunderLink.newTask({
								downloadDir: '下载目录',
								installFile: '',
								taskGroupName: '下载文件',
								tasks: tasks,
								excludePath: ''
						   });           	
					}
					
				});
			
				//启动迅雷看看
				if($(".thunderkk").length){
					$(".thunderkk").on("click",function(){
						var link=$(this).parents(".downlist").find("li .down_url");
						var url=link.eq(0).val();
						kkPlay(url,"");
					});        
				
					var kkDapCtrl = null;
					
					function kkGetDapCtrl() {
						if (null == kkDapCtrl) {
							try {
								if (window.ActiveXObject) {
									kkDapCtrl = new ActiveXObject("DapCtrl.DapCtrl");
								} else {
									var browserPlugins = navigator.plugins;
									for (var bpi = 0; bpi < browserPlugins.length; bpi++) {
										try {
											if (browserPlugins[bpi].name.indexOf('Thunder DapCtrl') != -1) {
												var e = document.createElement("object");
												e.id = "dapctrl_history";
												e.type = "application/x-thunder-dapctrl";
												e.width = 0;
												e.height = 0;
												document.body.appendChild(e);
												break;
											}
										} catch(e) {}
									}
									kkDapCtrl = document.getElementById('dapctrl_history');
								}
							} catch(e) {}
						}
						return kkDapCtrl;
					}
					function kkPlay(url, moviename) {
						var dapCtrl = kkGetDapCtrl();
						try {
							var ver = dapCtrl.GetThunderVer("KANKAN", "INSTALL");
							var type = dapCtrl.Get("IXMPPACKAGETYPE");
							if (ver && type && ver >= 672 && type >= 2401) {
								dapCtrl.Put("SXMP4ARG", '"' + url + '" /title "' + moviename + '" /startfrom "_web_xunbo" /openfrom "_web_xunbo"');
							} else {
								var r = confirm("\u8bf7\u5148\u4e0b\u8f7d\u5b89\u88c5\u8fc5\u96f7\u770b\u770b\uff0c\u70b9\u786e\u5b9a\u8fdb\u5165\u8fc5\u96f7\u770b\u770b\u5b98\u7f51\u4e0b\u8f7d");
								if (r == true) {
									window.open('http://www.kankan.com/app/xmp.html','','');
								}
							}
						} catch(e) {
							var r = confirm("\u8bf7\u5148\u4e0b\u8f7d\u5b89\u88c5\u8fc5\u96f7\u770b\u770b\uff0c\u70b9\u786e\u5b9a\u8fdb\u5165\u8fc5\u96f7\u770b\u770b\u5b98\u7f51\u4e0b\u8f7d");
							if (r == true) {
								window.open('http://www.kankan.com/app/xmp.html','','');
							}
						}
					}
				}
			});
			$(".Codyurl").each(function(){
				var downurl = $(this).attr("data-text");
				MyTheme.Link.Copy.Set(this,downurl);
			});
		},
		'Language':function(){
			
			String.prototype.s2t = function() {
				var k='';
				for(var i=0;i<this.length;i++){
					var c = this.charAt(i);
					var p = simple().indexOf(c)
					k += p < 0 ? c : traditional().charAt(p);
				}
				return k;
			 }
			 
			 String.prototype.t2s = function() {			 
					var k='';
					for(var i=0;i<this.length;i++){
						var c = this.charAt(i);
						var p = traditional().indexOf(c)
						k += p < 0 ? c : simple().charAt(p);
					}
			      return k;
			 }
			 
			function s2t() {
				document.body.innerHTML = document.body.innerHTML.s2t();
			}
			
			function t2s() {
			    document.body.innerHTML = document.body.innerHTML.t2s();
			}
			
			var language = MyTheme.Cookie.Get('language')||myui.language;
			if (language == 1) {
				s2t();
			} else {
				t2s();
			}
			
			$('.language').click(function() {
				if (language == 0) {
					layer.msg("正在切换繁体，请稍后...",{anim:5,time: 2000},function(){
						s2t();
						window.location.reload();
					});
					MyTheme.Cookie.Set('language',1,365);
				} else {
					layer.msg("正在切换简体，请稍后...",{anim:5,time: 2000},function(){
						t2s();
						window.location.reload();
					});
					MyTheme.Cookie.Set('language',0,365);
				}
			});
			
		}
	}	
};

$(function(){
	if(MyTheme.Browser.useragent.mobile){
		MyTheme.Mobile.Nav.Init();
		MyTheme.Mobile.Mshare();
	}
	MyTheme.Images.Lazyload();
	MyTheme.Images.Flickity.Init();	
	MyTheme.Link.Copy.Init();
	MyTheme.Link.Short();
	MyTheme.Other.Bootstrap();
	MyTheme.Other.Sort();
	MyTheme.Other.Search();
	MyTheme.Other.Collapse();
	MyTheme.Other.Slidedown();
	MyTheme.Other.Scrolltop();
	MyTheme.Other.History.Init();
	MyTheme.Other.Player();
	MyTheme.Other.Close();
	MyTheme.Other.Xunlei();
	
});

//cmsjs
var Myui = {
	'Comment': {
		'Init':function(){
			$('body').on('click', '.my_comment_submit', function(e){			        
		        if($(this).parent().parent().parent().find(".comment_data").val() == ''){
	                layer.msg("请输入评论内容");
	                return false;
	           }
		        Myui.Comment.Submit();
			});
			$('body').on('click', '.my_comment_report', function(e){
                var $that = $(this);
                if($(this).attr("data-id")){
                    MyTheme.Ajax(maccms.path + '/index.php/comment/report.html?id='+$that.attr("data-id"),'get','json','',function(r){
                        $that.addClass('disabled');                       
                        layer.msg(r.msg);
                    });
                }
            });
			$('body').on('click', '.my_comment_reply', function(e){
                var $that = $(this);
                if($that.attr("data-id")){
                    var str = $that.html();
                    $('.comment_reply_form').remove();
                    if (str == '取消回复') {
                        $that.html('回复');
                        return false;
                    }
                    if (str == '回复') {
                        $('.my_comment_reply').html('回复');
                    }
                    var html = $('.comment_form').prop("outerHTML");

                    var oo = $(html);
                    oo.addClass('comment_reply_form');
                    oo.find('input[name="comment_pid"]').val( $that.attr("data-id") );

                    $that.parent().after(oo);
                    $that.html('取消回复');
                }
            });
            $('body').on('click', '.my_comment_report', function(e){
                var $that = $(this);
                if($(this).attr("data-id")){
                    MyTheme.Ajax(maccms.path + '/index.php/comment/report.html?id='+$that.attr("data-id"),'get','json','',function(r){
                        $that.addClass('disabled');
                        layer.msg(r.msg);
                    });
                }
            });
		},
		'Show':function($page){
			MyTheme.Ajax(maccms.path + '/index.php/comment/ajax.html?rid='+$('.myui_comment').attr('data-id')+'&mid='+ $('.myui_comment').attr('data-mid') +'&page='+$page,'get','json','',function(r){
			    $(".myui_comment").html(r);
			},function(){
			    $(".myui_comment").html('<p class="text-center"><a href="javascript:void(0)" onclick="Myui.Comment.Show('+$page+');">评论加载失败，点击我刷新...</a></p>');
			});
        },
		'Submit':function(){		        
			MyTheme.Ajax(maccms.path + '/index.php/comment/saveData','post','json',$(".comment_form").serialize() + '&comment_mid='+ $('.myui_comment').attr('data-mid') + '&comment_rid=' + $('.myui_comment').attr('data-id'),function(r){
	            if(r.code==1){ 
	            	layer.msg(r.msg,{anim:5},function(){
					    Myui.Comment.Show(1);
					});
		        } else {
		        	if(MAC.Gbook.Verify==1){
		           	 	$('#verify_img').click();
		            }
		            layer.msg(r.msg);
		        }
	        });
		}
	},
	'Gbook': {
		'Init':function(){
			$('body').on('click', '.gbook_submit', function(e){
				if($(".gbook_data").val() == ''){
		            layer.msg("请输入留言内容");
		            return false;
		        }
				Myui.Gbook.Submit();
			});
		},
		'Submit':function(){
			MyTheme.Ajax(maccms.path + '/index.php/gbook/saveData','post','json',$("#myform").serialize(),function(r){
	            if(r.code==1){ 
	            	layer.msg(r.msg,{anim:5},function(){
					    location.reload();
					});	            
		        } else {
		        	if(MAC.Gbook.Verify==1){
		           	 	$('#verify_img').click();
		            }
		            layer.msg(r.msg);
		        }
	        });
		}
	},
	'Score':function(){
		var hadpingfen = 0;
		$("ul.rating li").each(function(i) {
			var $title = $(this).attr("title");
			var $lis = $("ul.rating li");
			var num = $(this).index();
			var n = num + 1;
			$(this).click(function () {
					if (hadpingfen > 0) {
						layer.msg('已经评分,请务重复评分');
					}
					else {
						$lis.removeClass("active");
						$("ul.rating li:lt(" + n + ")").find(".fa").addClass("fa-star").removeClass("fa-star-o");
						$("#ratewords").html($title);
						$.getJSON(maccms.path+'/index.php/ajax/score?mid='+$('#rating').attr('data-mid')+'&id='+$('#rating').attr('data-id')+'&score='+($(this).attr('val')*2), function (r) {
							if (parseInt(r.code) == 1) {
								layer.msg(r.msg);
								hadpingfen = 1;
							}
							else {
								hadpingfen = 1;
								layer.msg(r.msg);
							}
						});
					}
				}
			).hover(function () {
				this.myTitle = this.title;
				this.title = "";
				$(this).nextAll().find(".fa").addClass("fa-star-o").removeClass("fa-star");
				$(this).prevAll().find(".fa").addClass("fa-star").removeClass("fa-star-o");
				$(this).find(".fa").addClass("fa-star").removeClass("fa-star-o");
				$("#ratewords").html($title);
			}, function () {
				this.title = this.myTitle;
				$("ul.rating li:lt(" + n + ")").removeClass("hover");
			});
		});
	},
	'Autocomplete': function() {
		var searchWidth= $('#search').width();
		try {
			$('.search_wd').autocomplete(maccms.path + '/index.php/ajax/suggest?mid=1', {		
			    resultsClass: "autocomplete-suggestions",
			    width: searchWidth, scrollHeight: 410, minChars: 1, matchSubset: 0, cacheLength: 10, multiple: false, matchContains: true, autoFill: false,
			    dataType: "json",
			    parse: function (r) {
			        if (r.code == 1) {
			        	$(".head-dropdown").hide();
			            var parsed = [];
			            $.each(r['list'], function (index, row) {
			                row.url = r.url;
			                parsed[index] = {
			                    data: row
			                };
			            });
			            return parsed;
			        } else {
			            return {data: ''};
			        }
			    },
			    formatItem: function (row, i, max) {
			        return row.name;
			    },
			    formatResult: function (row, i, max) {
			        return row.text;
			    }
			}).result(function (event, data, formatted) {
			    $(this).val(data.name);
			    location.href = data.url.replace('mac_wd', encodeURIComponent(data.name));
			});
		}
		catch(e){}
	},
	'Favorite': function() {
		if($('.favorite').length>0){
			$('body').on('click', 'a.favorite', function(e){
		        var $that = $(this);
		        if($that.attr("data-id")){
		            $.ajax({
		                url: maccms.path+'/index.php/user/ajax_ulog/?ac=set&mid='+$that.attr("data-mid")+'&id='+$that.attr("data-id")+'&type='+$that.attr("data-type"),
		                cache: false,
		                dataType: 'json',
		                success: function($r){
		                	layer.msg($r.msg);
		                }
		            });
		        }
		    });
		}
	},
	'User': {
		'BuyPopedom':function(o){
            var $that = $(o);
            if($that.attr("data-id")){
                if (confirm('您确认购买此条数据访问权限吗？')) {
                    MyTheme.Ajax(maccms.path + '/index.php/user/ajax_buy_popedom.html?id=' + $that.attr("data-id") + '&mid=' + $that.attr("data-mid") + '&sid=' + $that.attr("data-sid") + '&nid=' + $that.attr("data-nid") + '&type=' + $that.attr("data-type"),'get','json','',function(r){
                        $that.addClass('disabled');
                        layer.msg($r.msg);
                        if (r.code == 1) {
                            top.location.reload();
                        }
                        $that.removeClass('disabled');
                    });
                }
            }
        },
		'Login':function(){
			MyTheme.Layer.Div('.ajax_login');
			$('body').on('click', '.login_form_submit', function(e){
			    $(this).unbind('click');
			    MyTheme.Ajax(maccms.path + '/index.php/user/login','post','json',$('.mac_login_form').serialize(),function(r){
					layer.msg(r.msg);
			        if(r.code == 1){
						layer.msg(r.msg,{anim:5},function(){
						    location.reload();
						});
			        }
			    });
			});
		}
	}
};

$(function(){	
	Myui.Comment.Init();
	Myui.Gbook.Init();
	Myui.Autocomplete();
	Myui.Favorite();
});

//简体中文
function simple(){ return "万与丑专业丛东丝丢两严丧个丬丰临为丽举么义乌乐乔习乡书买乱争于亏云亘亚产亩亲亵亸亿仅从仑仓仪们价众优伙会伛伞伟传伤伥伦伧伪伫体余佣佥侠侣侥侦侧侨侩侪侬俣俦俨俩俪俭债倾偬偻偾偿傥傧储傩儿兑兖党兰关兴兹养兽冁内冈册写军农冢冯冲决况冻净凄凉凌减凑凛几凤凫凭凯击凼凿刍划刘则刚创删别刬刭刽刿剀剂剐剑剥剧劝办务劢动励劲劳势勋勐勚匀匦匮区医华协单卖卢卤卧卫却卺厂厅历厉压厌厍厕厢厣厦厨厩厮县参叆叇双发变叙叠叶号叹叽吁后吓吕吗吣吨听启吴呒呓呕呖呗员呙呛呜咏咔咙咛咝咤咴咸哌响哑哒哓哔哕哗哙哜哝哟唛唝唠唡唢唣唤唿啧啬啭啮啰啴啸喷喽喾嗫呵嗳嘘嘤嘱噜噼嚣嚯团园囱围囵国图圆圣圹场坂坏块坚坛坜坝坞坟坠垄垅垆垒垦垧垩垫垭垯垱垲垴埘埙埚埝埯堑堕塆墙壮声壳壶壸处备复够头夸夹夺奁奂奋奖奥妆妇妈妩妪妫姗姜娄娅娆娇娈娱娲娴婳婴婵婶媪嫒嫔嫱嬷孙学孪宁宝实宠审宪宫宽宾寝对寻导寿将尔尘尧尴尸尽层屃屉届属屡屦屿岁岂岖岗岘岙岚岛岭岳岽岿峃峄峡峣峤峥峦崂崃崄崭嵘嵚嵛嵝嵴巅巩巯币帅师帏帐帘帜带帧帮帱帻帼幂幞干并广庄庆庐庑库应庙庞废庼廪开异弃张弥弪弯弹强归当录彟彦彻径徕御忆忏忧忾怀态怂怃怄怅怆怜总怼怿恋恳恶恸恹恺恻恼恽悦悫悬悭悯惊惧惨惩惫惬惭惮惯愍愠愤愦愿慑慭憷懑懒懔戆戋戏戗战戬户扎扑扦执扩扪扫扬扰抚抛抟抠抡抢护报担拟拢拣拥拦拧拨择挂挚挛挜挝挞挟挠挡挢挣挤挥挦捞损捡换捣据捻掳掴掷掸掺掼揸揽揿搀搁搂搅携摄摅摆摇摈摊撄撑撵撷撸撺擞攒敌敛数斋斓斗斩断无旧时旷旸昙昼昽显晋晒晓晔晕晖暂暧札术朴机杀杂权条来杨杩杰极构枞枢枣枥枧枨枪枫枭柜柠柽栀栅标栈栉栊栋栌栎栏树栖样栾桊桠桡桢档桤桥桦桧桨桩梦梼梾检棂椁椟椠椤椭楼榄榇榈榉槚槛槟槠横樯樱橥橱橹橼檐檩欢欤欧歼殁殇残殒殓殚殡殴毁毂毕毙毡毵氇气氢氩氲汇汉污汤汹沓沟没沣沤沥沦沧沨沩沪沵泞泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涂涌涛涝涞涟涠涡涢涣涤润涧涨涩淀渊渌渍渎渐渑渔渖渗温游湾湿溃溅溆溇滗滚滞滟滠满滢滤滥滦滨滩滪漤潆潇潋潍潜潴澜濑濒灏灭灯灵灾灿炀炉炖炜炝点炼炽烁烂烃烛烟烦烧烨烩烫烬热焕焖焘煅煳熘爱爷牍牦牵牺犊犟状犷犸犹狈狍狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珉珏珐珑珰珲琎琏琐琼瑶瑷璇璎瓒瓮瓯电画畅畲畴疖疗疟疠疡疬疮疯疱疴痈痉痒痖痨痪痫痴瘅瘆瘗瘘瘪瘫瘾瘿癞癣癫癯皑皱皲盏盐监盖盗盘眍眦眬着睁睐睑瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硅硕硖硗硙硚确硷碍碛碜碱碹磙礼祎祢祯祷祸禀禄禅离秃秆种积称秽秾稆税稣稳穑穷窃窍窑窜窝窥窦窭竖竞笃笋笔笕笺笼笾筑筚筛筜筝筹签简箓箦箧箨箩箪箫篑篓篮篱簖籁籴类籼粜粝粤粪粮糁糇紧絷纟纠纡红纣纤纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络绝绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绱绲绳维绵绶绷绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缐缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡翘翙翚耢耧耸耻聂聋职聍联聩聪肃肠肤肷肾肿胀胁胆胜胧胨胪胫胶脉脍脏脐脑脓脔脚脱脶脸腊腌腘腭腻腼腽腾膑臜舆舣舰舱舻艰艳艹艺节芈芗芜芦苁苇苈苋苌苍苎苏苘苹茎茏茑茔茕茧荆荐荙荚荛荜荞荟荠荡荣荤荥荦荧荨荩荪荫荬荭荮药莅莜莱莲莳莴莶获莸莹莺莼萚萝萤营萦萧萨葱蒇蒉蒋蒌蓝蓟蓠蓣蓥蓦蔷蔹蔺蔼蕲蕴薮藁藓虏虑虚虫虬虮虽虾虿蚀蚁蚂蚕蚝蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蜡蝇蝈蝉蝎蝼蝾螀螨蟏衅衔补衬衮袄袅袆袜袭袯装裆裈裢裣裤裥褛褴襁襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯詟誉誊讠计订讣认讥讦讧讨让讪讫训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀证诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳说诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谥谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶谷豮贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赝赞赟赠赡赢赣赪赵赶趋趱趸跃跄跖跞践跶跷跸跹跻踊踌踪踬踯蹑蹒蹰蹿躏躜躯车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辩辫边辽达迁过迈运还这进远违连迟迩迳迹适选逊递逦逻遗遥邓邝邬邮邹邺邻郁郄郏郐郑郓郦郧郸酝酦酱酽酾酿释里鉅鉴銮錾钆钇针钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钝钞钟钠钡钢钣钤钥钦钧钨钩钪钫钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钻钼钽钾钿铀铁铂铃铄铅铆铈铉铊铋铍铎铏铐铑铒铕铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铪铫铬铭铮铯铰铱铲铳铴铵银铷铸铹铺铻铼铽链铿销锁锂锃锄锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗错锚锜锞锟锠锡锢锣锤锥锦锨锩锫锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镆镇镈镉镊镌镍镎镏镐镑镒镕镖镗镙镚镛镜镝镞镟镠镡镢镣镤镥镦镧镨镩镪镫镬镭镮镯镰镱镲镳镴镶长门闩闪闫闬闭问闯闰闱闲闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陧陨险随隐隶隽难雏雠雳雾霁霉霭靓静靥鞑鞒鞯鞴韦韧韨韩韪韫韬韵页顶顷顸项顺须顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饤饥饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓魇魉鱼鱽鱾鱿鲀鲁鲂鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳛鳜鳝鳞鳟鳠鳡鳢鳣鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹇鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹯鹰鹱鹲鹳鹴鹾麦麸黄黉黡黩黪黾鼋鼌鼍鼗鼹齄齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟志制咨只里系范松没尝尝闹面准钟别闲干尽脏拼"}
//繁体中文		
function traditional(){ return "萬與醜專業叢東絲丟兩嚴喪個爿豐臨為麗舉麼義烏樂喬習鄉書買亂爭於虧雲亙亞產畝親褻嚲億僅從侖倉儀們價眾優夥會傴傘偉傳傷倀倫傖偽佇體餘傭僉俠侶僥偵側僑儈儕儂俁儔儼倆儷儉債傾傯僂僨償儻儐儲儺兒兌兗黨蘭關興茲養獸囅內岡冊寫軍農塚馮衝決況凍淨淒涼淩減湊凜幾鳳鳧憑凱擊氹鑿芻劃劉則剛創刪別剗剄劊劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勳猛勩勻匭匱區醫華協單賣盧鹵臥衛卻巹廠廳曆厲壓厭厙廁廂厴廈廚廄廝縣參靉靆雙發變敘疊葉號歎嘰籲後嚇呂嗎唚噸聽啟吳嘸囈嘔嚦唄員咼嗆嗚詠哢嚨嚀噝吒噅鹹呱響啞噠嘵嗶噦嘩噲嚌噥喲嘜嗊嘮啢嗩唕喚呼嘖嗇囀齧囉嘽嘯噴嘍嚳囁嗬噯噓嚶囑嚕劈囂謔團園囪圍圇國圖圓聖壙場阪壞塊堅壇壢壩塢墳墜壟壟壚壘墾坰堊墊埡墶壋塏堖塒塤堝墊垵塹墮壪牆壯聲殼壺壼處備複夠頭誇夾奪奩奐奮獎奧妝婦媽嫵嫗媯姍薑婁婭嬈嬌孌娛媧嫻嫿嬰嬋嬸媼嬡嬪嬙嬤孫學孿寧寶實寵審憲宮寬賓寢對尋導壽將爾塵堯尷屍盡層屭屜屆屬屢屨嶼歲豈嶇崗峴嶴嵐島嶺嶽崠巋嶨嶧峽嶢嶠崢巒嶗崍嶮嶄嶸嶔崳嶁脊巔鞏巰幣帥師幃帳簾幟帶幀幫幬幘幗冪襆幹並廣莊慶廬廡庫應廟龐廢廎廩開異棄張彌弳彎彈強歸當錄彠彥徹徑徠禦憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀懇惡慟懨愷惻惱惲悅愨懸慳憫驚懼慘懲憊愜慚憚慣湣慍憤憒願懾憖怵懣懶懍戇戔戲戧戰戩戶紮撲扡執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇掛摯攣掗撾撻挾撓擋撟掙擠揮撏撈損撿換搗據撚擄摑擲撣摻摜摣攬撳攙擱摟攪攜攝攄擺搖擯攤攖撐攆擷擼攛擻攢敵斂數齋斕鬥斬斷無舊時曠暘曇晝曨顯晉曬曉曄暈暉暫曖劄術樸機殺雜權條來楊榪傑極構樅樞棗櫪梘棖槍楓梟櫃檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒棬椏橈楨檔榿橋樺檜槳樁夢檮棶檢欞槨櫝槧欏橢樓欖櫬櫚櫸檟檻檳櫧橫檣櫻櫫櫥櫓櫞簷檁歡歟歐殲歿殤殘殞殮殫殯毆毀轂畢斃氈毿氌氣氫氬氳彙漢汙湯洶遝溝沒灃漚瀝淪滄渢溈滬濔濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜塗湧濤澇淶漣潿渦溳渙滌潤澗漲澀澱淵淥漬瀆漸澠漁瀋滲溫遊灣濕潰濺漵漊潷滾滯灩灄滿瀅濾濫灤濱灘澦濫瀠瀟瀲濰潛瀦瀾瀨瀕灝滅燈靈災燦煬爐燉煒熗點煉熾爍爛烴燭煙煩燒燁燴燙燼熱煥燜燾煆糊溜愛爺牘犛牽犧犢強狀獷獁猶狽麅獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽瑉玨琺瓏璫琿璡璉瑣瓊瑤璦璿瓔瓚甕甌電畫暢佘疇癤療瘧癘瘍鬁瘡瘋皰屙癰痙癢瘂癆瘓癇癡癉瘮瘞瘺癟癱癮癭癩癬癲臒皚皺皸盞鹽監蓋盜盤瞘眥矓著睜睞瞼瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜矽碩硤磽磑礄確鹼礙磧磣堿镟滾禮禕禰禎禱禍稟祿禪離禿稈種積稱穢穠穭稅穌穩穡窮竊竅窯竄窩窺竇窶豎競篤筍筆筧箋籠籩築篳篩簹箏籌簽簡籙簀篋籜籮簞簫簣簍籃籬籪籟糴類秈糶糲粵糞糧糝餱緊縶糸糾紆紅紂纖紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺絏紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽緔緄繩維綿綬繃綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒韁繾繰繯繳纘罌網羅罰罷羆羈羥羨翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚膁腎腫脹脅膽勝朧腖臚脛膠脈膾髒臍腦膿臠腳脫腡臉臘醃膕齶膩靦膃騰臏臢輿艤艦艙艫艱豔艸藝節羋薌蕪蘆蓯葦藶莧萇蒼苧蘇檾蘋莖蘢蔦塋煢繭荊薦薘莢蕘蓽蕎薈薺蕩榮葷滎犖熒蕁藎蓀蔭蕒葒葤藥蒞蓧萊蓮蒔萵薟獲蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蕆蕢蔣蔞藍薊蘺蕷鎣驀薔蘞藺藹蘄蘊藪槁蘚虜慮虛蟲虯蟣雖蝦蠆蝕蟻螞蠶蠔蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠟蠅蟈蟬蠍螻蠑螿蟎蠨釁銜補襯袞襖嫋褘襪襲襏裝襠褌褳襝褲襇褸襤繈襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶讋譽謄訁計訂訃認譏訐訌討讓訕訖訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣證詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗諡謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖穀豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贗讚贇贈贍贏贛赬趙趕趨趲躉躍蹌蹠躒踐躂蹺蹕躚躋踴躊蹤躓躑躡蹣躕躥躪躦軀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭辯辮邊遼達遷過邁運還這進遠違連遲邇逕跡適選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰鬱郤郟鄶鄭鄆酈鄖鄲醞醱醬釅釃釀釋裏钜鑒鑾鏨釓釔針釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鈍鈔鍾鈉鋇鋼鈑鈐鑰欽鈞鎢鉤鈧鈁鈥鈄鈕鈀鈺錢鉦鉗鈷缽鈳鉕鈽鈸鉞鑽鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鈰鉉鉈鉍鈹鐸鉶銬銠鉺銪鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鉿銚鉻銘錚銫鉸銥鏟銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏈鏗銷鎖鋰鋥鋤鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺錯錨錡錁錕錩錫錮鑼錘錐錦鍁錈錇錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鏌鎮鎛鎘鑷鐫鎳鎿鎦鎬鎊鎰鎔鏢鏜鏍鏰鏞鏡鏑鏃鏇鏐鐔钁鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐮鐿鑔鑣鑞鑲長門閂閃閆閈閉問闖閏闈閑閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隉隕險隨隱隸雋難雛讎靂霧霽黴靄靚靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順須頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飆飛饗饜飣饑飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢魘魎魚魛魢魷魨魯魴魺鮁鮃鯰鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鯵鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鼇鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅鰼鱖鱔鱗鱒鱯鱤鱧鱣鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鴬鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鷳鵜鵡鵲鶓鵪鶤鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶿鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺鸇鷹鸌鸏鸛鸘鹺麥麩黃黌黶黷黲黽黿鼂鼉鞀鼴齇齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜誌製谘隻裡係範鬆冇嚐嘗鬨麵準鐘彆閒乾儘臟拚"}
//BDTG
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?97dae9ca138986795e5d5441648955f4";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
