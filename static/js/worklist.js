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
		
		
		eventHandler.deleteWork();
		eventHandler.creatWork();
		eventHandler.projectView();
		
		$("[data-toggle='tooltip']").tooltip();
		//排序
		$(".datatable").addClass("sortable");
		$.bootstrapSortable(true);
	});
	
	
	var eventHandler = {
		
		
		
		//查看注释
		projectView:function(){
			$(".work-zs").off("click");
			$(".work-zs").on("click",function(){
				
				//日志
				buttonName = $(this).text().replace(/\s+/g,'');
				addition = $(this).parent().parent().parent().parent().parent().parent().parent().find(".title").text().replace(/\s+/g,'');
				logupLoad(buttonName,addition);
				//日志end
				var name = $(this).attr("data-name");
				var des = $(this).attr("data-description");
				$("#viewWorkModal").modal("show");
				$("#viewWorkModal").find(".create-name").val(name);
				$("#viewWorkModal").find(".project-decription").val(des);
			});
		},
		
		
		//创建项目
		creatWork:function(){
			$(".create-work").off("click");
			$(".create-work").on("click",function(){
				
				//日志
				buttonName = $(this).text().replace(/\s+/g,'');
				addition = $(this).parent().parent().parent().parent().parent().parent().parent().find(".title").text().replace(/\s+/g,'');
				logupLoad(buttonName,addition);
				//日志end
				$("#newWorkModal").modal("show");
				$(".newWorkBtn").off("click");
				$(".newWorkBtn").on("click",function(){
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					var name = $(".create-name").val();
					var description = $(".project-decription").val();
					if(name==""){
						$("#msg-content").html("项目名不能为空");
						$("#msg-box").animate({top:"0"});
						return;
					}
					
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					
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
			
			
		},
		deleteWork:function(){
			$(".work-remove").off("click");
			$(".work-remove").on("click",function(){
				//日志
				buttonName = $(this).text().replace(/\s+/g,'');
				addition = $(this).parent().parent().parent().parent().parent().parent().parent().find(".title").text().replace(/\s+/g,'');
				logupLoad(buttonName,addition);
				//日志end
				
				var name = $(this).attr("data-name");
				$("#deleteDBModal").modal("show");
				$(".deleteDBBtn").off("click");
				$(".deleteDBBtn").on("click",function(){
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					$.ajax({
						url:"/workbench/user_bi/project/"+name+"/delete",
						type:"GET",
						timeout:30000,
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("删除项目成功！！");
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