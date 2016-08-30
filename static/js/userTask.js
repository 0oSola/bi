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
		
		
		
		
		$(".report-copy").zclip({ 
			path: '/static/js/jquery-zclip/ZeroClipboard.swf', 
			copy: function(){//复制内容 
				//日志
				buttonName = "复制内容";
				addition = "";
				logupLoad(buttonName,addition);
				//日志end
				return $(this).attr("data-url"); 
			}, 
			afterCopy: function(){//复制成功 
				$('.success-heading').html("报表链接复制成功！！");
				$('#success-box').animate({top:'0'});
				setTimeout("$('#success-box').animate({top:'-50%'})",3000);
			}
		});
		
		
		eventHandler.addTask();
		eventHandler.viewTask();
		eventHandler.editTask();
		eventHandler.removeTask();
		eventHandler.evaluateTask();
		eventHandler.reportCopy();
		//eventHandler.chartCreate(".taskOver-content");
		
		//排序
		$(".datatable").addClass("sortable");
		$.bootstrapSortable(true);
		
		
		
		
		
		
		
	});
	
	var ajaxHandler = {
		//获取评价
		getEvaluateMission:function(uuid){
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());

			$.ajax({
				url:"/workbench/needs/"+uuid+"/comment",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					
					
					if(dataJson.error_code==0){
						//setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						var comment = dataJson.comment;
						if(JSON.stringify(comment)=="{}"){
							comment="";
						}
						if(comment!=""){
							$('#evaluate-sd').raty({ readOnly: true,score: parseInt(comment.need_speed) });
							$('#evaluate-zl').raty({ readOnly: true,score: parseInt(comment.need_quality) });
							$('#evaluate-td').raty({ readOnly: true,score: parseInt(comment.need_status) });
							$('#task-bz').val(comment.remark);
							$('#task-bz').attr("disabled","true");
							$('.evaluateTaskBtn').css("display","none");
						}else{
							$('.evaluateTaskBtn').css("display","inline-block");
							$('#task-bz').removeAttr("disabled");
						}
						
						$("#evaluateTaskModal").modal("show");
						
						$(".evaluateTaskBtn").off("click");
						$(".evaluateTaskBtn").on("click",function(){
							
							//日志
							buttonName ="提交评价";
							addition = "";
							logupLoad(buttonName,addition);
							//日志end
							
							//取值
							var sd = $('#evaluate-sd').raty('score');
							var zl = $('#evaluate-zl').raty('score');
							var td = $('#evaluate-td').raty('score');
							var bz = $('#task-bz').val();
							ajaxHandler.evaluateMission(uuid,sd,zl,td,bz);
						})
						
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//添加评价
		evaluateMission:function(uuid,sd,zl,td,bz){
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/needs/comment",
				type:"POST",
				timeout:30000,
				data:{
					uuid:uuid,
					need_speed:sd,
					need_quality:zl,
					need_status:td,
					remark:bz
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("评价成功！！");
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
		//删除需求请求
		removeMission:function(uuid){

			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/needs/"+uuid+"/delete",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("删除需求成功！！");
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
		
		//更新需求请求
		editMission:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			var name = $("#editTaskModal").find(".task-name").val();
			var deadline = $("#editTaskModal").find(".form-control1").val();
			var description = $("#editTaskModal").find(".task-description").val();
			
			$.ajax({
				url:"/workbench/task/update",
				type:"POST",
				timeout:30000,
				data:{
					uuid:uuid,
					name:name,
					deadline:deadline,
					description:description
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("更新需求成功！！");
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
		//添加需求请求
		addMission:function(){
			
			var name = $(".new-task-box").find(".task-name").val();
			var deadline = $(".new-task-box").find(".form-control1").val();
			var description = $(".new-task-box").find(".task-description").val();
			
			var d=new Date(Date.parse(deadline.replace(/\-/g, "\/")));
			var curDate=new Date();
			if(d <curDate){
				$("#msg-content").html("请选择大于今天的截止时间！！");
				$("#msg-box").animate({top:"0"});
				return false;
			}else if(name==""){
				$("#msg-content").html("需求名称不能为空！！");
				$("#msg-box").animate({top:"0"});
				return false;
			}else if(description==""){
				$("#msg-content").html("需求描述不能为空！！");
				$("#msg-box").animate({top:"0"});
				return false;
			}else if(deadline==""){
				$("#msg-content").html("截止时间不能为空！！");
				$("#msg-box").animate({top:"0"});
				return false;
			}else{
				$("#spin").css("display","block");
				$("#spin").css("height",$("body").height());
				$.ajax({
					url:"/workbench/needs/release",
					type:"POST",
					timeout:30000,
					data:{
						name:name,
						deadline:deadline,
						description:description
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							$('.success-heading').html("创建需求成功！！");
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
		},
	}
	
	var eventHandler = {
		
		
		//图表绘制
		chartCreate:function(ele){
			//test
			var dataJson = JSON.parse(datatest);
			if(dataJson.error_code==0){
				var targetChart = $(ele).find(".chart-content");
				if(targetChart.attr("data-type") == "area"){
					areaChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
				}else if(targetChart.attr("data-type") == "bar"){
					barChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
				}
				/*viewRender.renderList($(ele),dataJson.data_list);
				var totalPage = Math.ceil(dataJson.totalCount / pageSize);
				eventsManager.bindPage($(ele).find(".pageContainer"),totalPage);*/
			}else{
				$("#msg-content").html(dataJson.error_message);
				$("#msg-box").animate({top:"0"});
			}
			
			$.ajax({
				url:""+nowDate,
				type:GET,
				timeout:30000,
				success: function(){
					if(dataJson.error_code==0){
						var targetChart = $(ele).find(".chart-content");
						if(targetChart.attr("data-type") == "area"){
							areaChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
						}else if(targetChart.attr("data-type") == "bar"){
							barChart(dataJson.chart_data,dataJson.x_name,dataJson.y_name,dataJson.chart_name,targetChart.attr("id"));
						}
						/*viewRender.renderList($(ele),dataJson.data_list);
						var totalPage = Math.ceil(dataJson.totalCount / pageSize);
						eventsManager.bindPage($(ele).find(".pageContainer"),totalPage);*/
					}
				}
			});
			
			//end test
		},
		
		//复制报表
		reportCopy:function(){
			
			
		},
		
		//需求评价
		evaluateTask:function(){
			$(".task-evaluate").on("click",function(){
				$('.evaluate').raty();
				$('#task-bz').val("");
				var uuid = $(this).parent().parent().find(".task-name").attr("data-uuid");	
				var ev_list = ajaxHandler.getEvaluateMission(uuid);	
			})
		},
		//删除需求
		removeTask:function(){
			$(".request-delete").on("click",function(){
				$("#deleteTaskModal").modal("show");
				var uuid = $(this).parent().parent().find(".task-name").attr("data-uuid");	
				$(".deleteTaskBtn").off("click");
				$(".deleteTaskBtn").on("click",function(){
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					ajaxHandler.removeMission(uuid);
				})		
			})
		},
		//查看需求
		viewTask:function(){
			$(".task-view").on("click",function(){
				
				
				
				if($(this).attr("data-type")==0){
					$("#viewTaskModal").find(".progress-list").css("display","inline-block");
				}else if($(this).attr("data-type")==2){
					$("#viewTaskModal").find(".progress-list").css("display","inline-block");
				}else{
					$("#viewTaskModal").find(".progress-list").css("display","none");
				}
				$("#viewTaskModal").modal("show");
				
				var target = $(this).parent().parent();	
				var uuid = target.find(".task-name").attr("data-uuid");
				var name = target.find(".task-name").html();
				var deadline = target.find(".task-deadline").html();
				var receiver = target.find(".task-receiver").html();
				var description = target.find(".task-description").attr("data-description");
				var result = target.find(".task-result").attr("data-result");
				var progress =target.find(".task-progress").attr("data-progress");
				var progress_description = target.find(".progress-description").html();
				
				
				if(result==""){
					$(".read-result").css("display","none");
				}else{
					$(".read-result").css("display","inline-block");
					$(".read-result").off("click");
					$(".read-result").on("click",function(){
						//日志
						buttonName = $(this).text().replace(/\s+/g,'');
						addition = "";
						logupLoad(buttonName,addition);
						//日志end
						window.open(result,"_blank");
					});
				}
				
				$("#viewTaskModal").find(".task-name").val("");
				$("#viewTaskModal").find(".task-deadline").val("");
				$("#viewTaskModal").find(".task-receiver").val("");
				$("#viewTaskModal").find(".task-result").val("");
				$("#viewTaskModal").find(".task-description").val("");
				$("#viewTaskModal").find(".task-progress").val("");
				$("#viewTaskModal").find(".progress-description").val("");
				
				$("#viewTaskModal").find(".task-name").val(name);
				$("#viewTaskModal").find(".task-deadline").val(deadline);
				$("#viewTaskModal").find(".task-receiver").val(receiver);
				$("#viewTaskModal").find(".task-result").val(result);
				$("#viewTaskModal").find(".task-description").val(description);
				$("#viewTaskModal").find(".task-progress").val(progress);
				$("#viewTaskModal").find(".progress-description").val(progress_description);
			})
		},
		//编辑需求
		editTask:function(){
			$(".task-edit").on("click",function(){
				$("#editTaskModal").modal("show");	
				var target = $(this).parent().parent();	
				
				var uuid = target.find(".task-name").attr("data-uuid");
				var name = target.find(".task-name").html();
				var deadline = target.find(".task-deadline").html();
				var description = target.find(".task-description").attr("data-description");

				$("#editTaskModal").find(".task-name").val(name);
				$("#editTaskModal").find(".form-control1").val(deadline);
				$("#editTaskModal").find(".task-deadline").val(deadline);
				$("#editTaskModal").find(".task-description").val(description);
				$(".edit-task").off("click");
				$(".edit-task").on("click",function(){
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					ajaxHandler.editMission(uuid);
				});
			})
		},
		//添加需求
		addTask:function(){
			$(".new-mission-btn").on("click",function(){
				$("#newTaskModal").modal("show");
				$(".sumbit-task").off("click");
				$(".sumbit-task").on("click",function(){
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					ajaxHandler.addMission();		
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
