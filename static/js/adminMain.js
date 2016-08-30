// JavaScript Document
(function(){
	
	/*var datatest = '{"chart_type":"area","chart_name":["近一周发布需求数","近一周需求被接受情况"],"y_name":"人数","x_name":["12/14","12/15","12/16","12/17","12/18","12/19","12/20"],"chart_data":[[3, 4, 4, 5, 4, 10, 12],[1, 3, 3, 3, 3, 5, 4]],"error_code":0,"error_message":""}';*/
	
	//"data_list":[["日期","设备","新增账户","新增设备"],["2015-01-01","11","0","21"]],"totalCount":100,
	
	$(function(){
		
		$("[data-toggle='tooltip']").tooltip();	
		$("html").on("click",function(){
			if($("#msg-box").css("top")=='0px'){
				$("#msg-box").animate({top:"-50%"});
			}
		});
		$("#msg-box").on("click",function(){
			$(this).animate({top:"-50%"});
		});
		
		eventHandler.addUser();
		eventHandler.editUser();
		eventHandler.deleteUser();
		eventHandler.resetpassword();
	});
	
	var ajaxHandler = {
		
		//重置密码请求
		resetPw:function(name){
			var pw = $("#resetPwModal").find(".user-password").val();
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_admin/user/update/password",
				type:"POST",
				timeout:30000,
				data:{
					username:name,
					password:pw
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("修改密码成功！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		
		//删除用户请求
		deleteUser:function(name){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_admin/user/"+name+"/delete",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("删除用户成功！！");
						$('#success-box').animate({top:'0'});
						window.location.reload();
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		
		//更新用资料户请求
		editUser:function(name){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			var username = $("#editUserModal").find(".user-name").val();
			var name = $("#editUserModal").find(".nomral-name").val();
			var phone = $("#editUserModal").find(".user-phone").val();
			var email = $("#editUserModal").find(".user-email").val();
			
			var type = -1;
			var BIType = $("#editUserModal").find(".BI-type").prop("checked");
			var commonType = $("#editUserModal").find(".common-type").prop("checked");
			if(BIType&&commonType){
				type = 0;
			}else if(!BIType&&commonType){
				type = 1;
			}
			
			$.ajax({
				url:"/workbench/user_admin/user/update/info",
				type:"POST",
				timeout:30000,
				data:{
					username:username,
					name:name,
					phone:phone,
					email:email,
					type:type
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("更新用户资料成功！！");
						$('#success-box').animate({top:'0'});
						window.location.reload();
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		
		//添加用户请求
		createUSer:function(){
			var name = $("#newUserModal").find(".nomral-name").val();
			var username = $("#newUserModal").find(".user-name").val();
			var phone = $("#newUserModal").find(".user-phone").val();
			var email = $("#newUserModal").find(".user-email").val();
			var pw = $("#newUserModal").find(".user-password").val();
		
			var type = -1;
			var BIType = $("#newUserModal").find(".BI-type").prop("checked");
			var commonType = $("#newUserModal").find(".common-type").prop("checked");
			if(BIType&&commonType){
				type = 0;
			}else if(!BIType&&commonType){
				type = 1;
			}
			
			$("#newUserModal").find(".user-input").css("border-color","#ccc");
			var error_msg = "";
			console.log("error_msg:"+error_msg);
			if($("#newUserModal").find(".user-name").val()==""){
				error_msg = "用户名不能为空";
				$("#newUserModal").find(".user-name").css("border-color","#f00");
				$("#msg-content").html(error_msg);
				$("#msg-box").animate({top:"0"});
			}else if($("#newUserModal").find(".user-password").val()==""){
				error_msg = "密码不能为空";
				$("#newUserModal").find(".user-password").css("border-color","#f00");
				$("#msg-content").html(error_msg);
				$("#msg-box").animate({top:"0"});
			}else{
				if(error_msg==""){
					$("#spin").css("display","block");
					$("#spin").css("height",$("body").height());
					$.ajax({
						url:"/workbench/user_admin/user/create",
						type:"POST",
						timeout:30000,
						data:{
							username:username,
							name:name,
							phone:phone,
							email:email,
							password:pw,
							type:type
						},
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("创建用户成功！！");
								$('#success-box').animate({top:'0'});
								window.location.reload();
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});	
					setTimeout('$("#spin").css("display","none")',0);
				}
			}
			
		},
	}
	
	var eventHandler = {
		//更新密码
		resetpassword:function(){
			$(".reset-pw").on("click",function(){
				var target = $(this).parent().parent();	
				var username = target.find(".user-name").html();
				$("#resetPwModal").modal("show");
				$(".reset-Btn").off("click");
				$(".reset-Btn").on("click",function(){
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					ajaxHandler.resetPw(username);
				});
			});
			
		},
		
		//图表绘制
		chartCreate:function(ele){
			//test
			/*var dataJson = JSON.parse(datatest);
			if(dataJson.error_code==0){
				var targetChart = $(ele).find(".chart-content");
				if(targetChart.attr("data-type") == "area"){
					areaChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
				}else if(targetChart.attr("data-type") == "bar"){
					barChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
				}
				viewRender.renderList($(ele),dataJson.data_list);
				var totalPage = Math.ceil(dataJson.totalCount / pageSize);
				eventsManager.bindPage($(ele).find(".pageContainer"),totalPage);
			}else{
				$("#msg-content").html(dataJson.error_message);
				$("#msg-box").animate({top:"0"});
			}
			
			$.ajax({
				url:""+nowDate,
				type:GET,
				success: function(){
					if(dataJson.error_code==0){
						var targetChart = $(ele).find(".chart-content");
						if(targetChart.attr("data-type") == "area"){
							areaChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
						}else if(targetChart.attr("data-type") == "bar"){
							barChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
						}
						viewRender.renderList($(ele),dataJson.data_list);
						var totalPage = Math.ceil(dataJson.totalCount / pageSize);
						eventsManager.bindPage($(ele).find(".pageContainer"),totalPage);
					}
				}
			});*/
			
			//end test
		},
		
		//删除用户
		deleteUser:function(){
			$(".delete-btn").on("click",function(){
				$("#deleteUserModal").modal("show");
				var name = $(this).parent().parent().find(".user-name").html();	
				$(".deleteUserBtn").off("click");
				$(".deleteUserBtn").on("click",function(){
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					
					ajaxHandler.deleteUser(name);
				})		
			})
		},
		
		//编辑用户
		editUser:function(){
			$(".edit-btn").on("click",function(){
				$("#editUserModal").modal("show");	
				var target = $(this).parent().parent();	
				
				var username = target.find(".user-name").html();
				var name = target.find(".nomral-name").html();
				var phone = target.find(".user-phone").html();
				var email = target.find(".user-email").html();
				
				$("#editUserModal").find(".user-name").val("");
				$("#editUserModal").find(".nomral-name").val("");
				$("#editUserModal").find(".user-phone").val("");
				$("#editUserModal").find(".user-email").val("");
				$("#editUserModal").find(".user-password").val("");
				
				//common-type
				var type = target.find(".user-type").attr("data-type");
			
				$("#editUserModal").find(".user-name").val(username);
				$("#editUserModal").find(".nomral-name").val(name);
				$("#editUserModal").find(".user-phone").val(phone);
				$("#editUserModal").find(".user-email").val(email);
				if(type==0){
					$("#editUserModal").find(".BI-type").attr("checked",true);
					$("#editUserModal").find(".common-type").attr("checked",true);
				}else if(type==1){
					$("#editUserModal").find(".BI-type").attr("checked",false);
					$("#editUserModal").find(".common-type").attr("checked",true);
				}
				
				
				$(".edit-user").off("click");
				$(".edit-user").on("click",function(){
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					ajaxHandler.editUser(username);
				});
				
				
				
			})
		},
		//添加用户
		addUser:function(){
			$("#create-user").on("click",function(){
				var buttonName = $(this).text();
				addition = "用户列表";
				logupLoad(buttonName,addition);
				$("#newUserModal").modal("show");
				$(".sumbit-user").off("click");
				$(".sumbit-user").on("click",function(){
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					ajaxHandler.createUSer();		
				})
			})
		},
		
		//分页
		bindPage:function(ele,totalPage){
			var pageNo = ele.attr("data-pageNo");
			ele.bootpag({
                total: totalPage,          // total pages
                page: pageNo,            // default page
                maxVisible: 10,     // visible pagination
                leaps: true         // next/prev leaps through maxVisible
            }).unbind("page").on("page", function(event, num){
				ele.attr("data-pageNo",num);
            });
		}
	};
	
})();
