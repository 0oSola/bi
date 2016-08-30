// JavaScript Document
(function(){
	$(function(){
		eventHandler.addDB();
		eventHandler.testlink();
	});
	
	
	var eventHandler = {
		
		addDB:function(){
			$(".add-database").off("click");
			$(".add-database").on("click",function(){
				if($(".ds-type").val()!=""){
					var error_msg = "";
					$(".input").css("border-color","#ccc");
					if($("#createDBModal").find(".ds-alais").val()==""){
						error_msg = "数据源名称不能为空";
						$(".ds-alais").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-host").val()==""){
						error_msg = "数据库IP不能为空";
						$(".ds-host").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-port").val()==""){
						error_msg = "数据库端口不能为空";
						$(".ds-port").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-user").val()==""){
						error_msg = "数据库用户名不能为空";
						$(".ds-user").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-dbname").val()==""){
						error_msg = "数据库名称不能为空";
						$(".ds-dbname").css("border-color","#f00");
					}
					if(error_msg==""){
						buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
						addition = $(this).text().replace(/\s+/g,'')+buttonName;
						logupLoad(buttonName,addition);
						eventHandler.linkDatabase();
					}else{
						
						$("#msg-content").html(error_msg);
						$("#msg-box").animate({top:"0"});
					}
					
				}else{
					$("#msg-content").html("请选选择数据库类型");
					$("#msg-box").animate({top:"0"});
				}
			});
		},
		
		//连接
		testlink:function(){
			//测试连接数据源
			$("#createDBModal").find(".test-database").off("click");
			$("#createDBModal").find(".test-database").on("click",function(){
				
				if($(".ds-type").val()!=""){
					var error_msg = "";
					$(".input").css("border-color","#ccc");
					if($("#createDBModal").find(".ds-alais").val()==""){
						error_msg = "数据源名称不能为空";
						$(".ds-alais").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-host").val()==""){
						error_msg = "数据库IP不能为空";
						$(".ds-host").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-port").val()==""){
						error_msg = "数据库端口不能为空";
						$(".ds-port").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-user").val()==""){
						error_msg = "数据库用户名不能为空";
						$(".ds-user").css("border-color","#f00");
					}else if($("#createDBModal").find(".ds-dbname").val()==""){
						error_msg = "数据库名称不能为空";
						$(".ds-dbname").css("border-color","#f00");
					}
					if(error_msg==""){
						$("#spin").css("display","block");
						$("#spin").css("height",$("#wrapper").height());
						
						var ds_type =  $("#createDBModal").find(".ds-type").val();
						var ds_host =  $("#createDBModal").find(".ds-host").val();
						var ds_port =  $("#createDBModal").find(".ds-port").val();
						var ds_user = $("#createDBModal").find(".ds-user").val();
						var ds_password = $("#createDBModal").find(".ds-password").val();
						var ds_name = $("#createDBModal").find(".ds-dbname").val();
						var ds_alias = $("#createDBModal").find(".ds-alais").val();
						
						$.ajax({
							url:"/workbench/user_bi/datasource/link",
							type:"POST",
							timeout:30000,
							data:{
								ds_alias:ds_alias,
								ds_name:ds_name,
								ds_host:ds_host,
								ds_type:ds_type,
								ds_user:ds_user,
								ds_password:ds_password,
								ds_port:ds_port
							},
							error: function(){
								$("#msg-content").html("连接服务器失败，请联系管理员");
								$("#msg-box").animate({top:"0"});
							},
							success: function(data){
								var dataJson = JSON.parse(data);
								if(dataJson.error_code==0){
									$('.success-heading').html("测试连接数据源成功,添加完成");
									$('#success-box').animate({top:'0'});
									setTimeout("$('#success-box').animate({top:'-50%'})",3000);
									$(".add-database").css("display","inline-block");
									
								}else{
									$("#msg-content").html(dataJson.error_messge);
									$("#msg-box").animate({top:"0"});
									
								}
							}
						});
						setTimeout('$("#spin").css("display","none")',0);
					}else{
						$("#msg-content").html(error_msg);
						$("#msg-box").animate({top:"0"});
					}
					
				}else{
					$("#msg-content").html("请选选择数据库类型");
					$("#msg-box").animate({top:"0"});
				}
				
				
			});
		},
		//创建
		linkDatabase:function(){
				var dbtype =  $("#createDBModal").find(".ds-type").val();
				var dsHost =  $("#createDBModal").find(".ds-host").val();
				var dsport =  $("#createDBModal").find(".ds-port").val();
				var db_user =  $("#createDBModal").find(".ds-user").val();
				var db_pw =  $("#createDBModal").find(".ds-password").val();
				var db_name =  $("#createDBModal").find(".ds-dbname").val();
				var ds_name =  $("#createDBModal").find(".ds-alais").val();
				
				
				
				$("#spin").css("display","block");
				$("#spin").css("height",$("#wrapper").height());

				$.ajax({
					url:"/workbench/user_bi/datasource/add",
					type:"POST",
					timeout:30000,
					data:{
						ds_alias:ds_name,
						ds_type:dbtype,
						ds_host:dsHost,
						ds_port:dsport,
						ds_user_name:db_user,
						ds_password:db_pw,
						ds_name:db_name
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							$('.success-heading').html("测试连接数据源成功,添加完成");
							$('#success-box').animate({top:'0'});
							setTimeout("$('#success-box').animate({top:'-50%'})",3000);
							setTimeout("window.location.reload()",1000);
						}else{
							$("#msg-content").html(dataJson.error_messge);
							$("#msg-box").animate({top:"0"});
						}
					}
				});
				setTimeout('$("#spin").css("display","none")',0);
		}
		
		
		
	}
	
	
	
})()