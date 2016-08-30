// JavaScript Document
(function(){
	$(function(){
		$("html").on("click",function(){
			if($("#msg-box").css("top")=='0px'){
				$("#msg-box").animate({top:"-50%"});
			}
		});
		$("#msg-box").on("click",function(){
			$(this).animate({top:"-50%"});
		});
		
		
		eventHandler.deleteDB();
		eventHandler.EditDB();
		eventHandler.createDatabase();
		
		//排序
		$(".datatable").addClass("sortable");
		$.bootstrapSortable(true);
	});
	
	
	var eventHandler = {
		//创建数据源
		createDatabase:function(){
			$(".create-database").on("click",function(){
				buttonName = $(this).text().replace(/\s+/g,'');
				addition = "数据源列表";
				logupLoad(buttonName,addition);
				
				$("#createDBModal").modal("show");
			});
		},
		
		
		
		//编辑数据源
		EditDB:function(){
			$(".db-edit").on("click",function(){
							
				var name = $(this).attr("data-name");
				var type = $(this).parent().parent().find(".ds-type").html();
				var host = $(this).parent().parent().find(".ds-host").html();
				var port = $(this).parent().parent().find(".ds-port").html();
				var user = $(this).parent().parent().find(".ds-user").html();
				var dbName = $(this).parent().parent().find(".ds-dbname").html();
				
				$("#editDBModal").find(".ds-alais").html(name);
				$("#editDBModal").find(".ds-host").val(host);
				$("#editDBModal").find(".ds-port").val(port);
				$("#editDBModal").find(".ds-user").val(user);
				$("#editDBModal").find(".ds-dbname").val(dbName);
				
				$("#editDBModal").modal("show");
				
				//测试连接数据源
				$(".test-database").off("click");
				$(".test-database").on("click",function(){
					$("#spin").css("display","block");
					$("#spin").css("height",$("#wrapper").height());
					
					var host = $("#editDBModal").find(".ds-host").val();
					var port = $("#editDBModal").find(".ds-port").val();
					
					var user = $("#editDBModal").find(".ds-user").val();
					var password = $("#editDBModal").find(".ds-password").val();
					var dbName = $("#editDBModal").find(".ds-dbname").val();
					
					$.ajax({
						url:"/workbench/user_bi/datasource/link",
						type:"POST",
						timeout:30000,
						data:{
							ds_alias:name,
							ds_name:dbName,
							ds_host:host,
							ds_type:type,
							ds_user:user,
							ds_password:password,
							ds_port:port
						},
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("连接数据源成功！！");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
								$(".editDBBtn").css("display","inline-block");
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});
					setTimeout('$("#spin").css("display","none")',0);
				});
				

				$(".editDBBtn").off("click");
				$(".editDBBtn").on("click",function(){
					$("#spin").css("display","block");
					$("#spin").css("height",$("#wrapper").height());
					
					var host = $("#editDBModal").find(".ds-host").val();
					var port = $("#editDBModal").find(".ds-port").val();
					var user = $("#editDBModal").find(".ds-user").val();
					var password = $("#editDBModal").find(".ds-password").val();
					var dbName = $("#editDBModal").find(".ds-dbname").val();
					
					$.ajax({
						url:"/workbench/user_bi/datasource/update",
						type:"POST",
						timeout:30000,
						data:{
							ds_alias:name,
							ds_name:dbName,
							ds_host:host,
							ds_type:type,
							ds_user:user,
							ds_password:password,
							ds_port:port
						},
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("测试连接数据源成功,已修改数据源");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
								$("#editDBModal").modal("hide");
								setTimeout("window.location.reload()",1000);
								
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});
					setTimeout('$("#spin").css("display","none")',0);
				});
				
			});
		},
		deleteDB:function(){
			$(".db-remove").on("click",function(){
				var name = $(this).attr("data-name");
				$("#deleteDBModal").modal("show");
				$(".deleteDBBtn").off("click");
				$(".deleteDBBtn").on("click",function(){
					
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					
					$("#spin").css("display","block");
					$("#spin").css("height",$("#wrapper").height());
					
					$.ajax({
						url:"/workbench/user_bi/datasource/"+name+"/delete",
						type:"GET",
						timeout:30000,
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("删除数据源成功！！");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
								$("#deleteDBModal").modal("hide");
								window.location.reload();
								
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});
					setTimeout('$("#spin").css("display","none")',0);
				});
				
			});
		}
	}
	
})()