// JavaScript Document
(function(){
	$(function(){
		eventHandler.checkDataSourse();
		eventHandler.creatWork();
		eventHandler.createDatabase();
	});
	
	var eventHandler = {
		
		//数据源检测
		checkDataSourse:function(){
			var hasDS = parseInt($(".has-ds").val());
			if(hasDS==0){
				$("#checkDatabaseModal").modal("show");
			}
			
			
		},
		
		
		//创建数据源
		createDatabase:function(){
			$(".new-database").on("click",function(){
				$("#checkDatabaseModal").modal("hide");
				$("#createDBModal").modal("show");
			});
		},
		
		//创建新项目
		creatWork:function(){
			$(".new-project").on("click",function(){
				$("#newWorkModal").modal("show");
				$(".newWorkBtn").off("click");
				$(".newWorkBtn").on("click",function(){
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//end 日志
					
					var name = $(".create-name").val();
					var description = $(".project-decription").val();
					
					
					if(name==""){
						$("#msg-content").html("项目名不能为空");
						$("#msg-box").animate({top:"0"});
						return;
					}
					
					$.ajax({
						url:"/workbench/user_bi/project/create",
						type:"POST",
						timeout:30000,
						data:{
							project_name:name,
							project_description:description
						},
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("新增项目成功！！");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
								$("#newWorkModal").modal("hide");
								window.open("/workbench/user_bi/project/"+name+"/console");
								$("#newWorkModal").modal("hide");					
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
		
		
	};
	
	
})()