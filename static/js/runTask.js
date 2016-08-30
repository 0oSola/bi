// JavaScript Document
(function(){
	
	
	//test

		var testFinJson = '{"data_list": [["uuidFin","name","project_name","create_time","finish_time",100,0,"creater","consume","0"],["uuid","name","project_name","create_time","finish_time",100,0,"creater","consume","1"]],"totalCount":20,"error_messge":"","error_code":0}';
		var data1 = JSON.parse(testFinJson);
		
	    var testUnJson = '{"data_list": [["uuidUnFin","name","project_name","create_time",80,2,"creater"],["uuid","name","project_name","create_time",30,1,"creater"]],"totalCount":10,"error_messge":"","error_code":0}';
		var data2 = JSON.parse(testUnJson);

		//end test
	var pageSize = 10;
	
	$(function(){
		
		
		$("html").on("click",function(){
			if($("#msg-box").css("top")=='0px'){
				$("#msg-box").animate({top:"-50%"});
			}
		});
		$("#msg-box").on("click",function(){
			$(this).animate({top:"-50%"});
		});
		
		//加载扩展模块
		layer.config({
			extend: 'extend/layer.ext.js'
		});
		
		ajaxHandler.loadUnMission(".unmission-content");
		ajaxHandler.loadFinshMission(".finishMission-content");

		$("[data-toggle='tooltip']").tooltip();	
	});
	
	var ajaxHandler = {

		
		//加载结果集
		loadResultSet:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());	
			
			//test
			/*var data = '{"data":"1234","error_messge":"","error_code":0}';
			var dataJson = JSON.parse(data);
			
			layer.open({
				title:'查看算法结果集',
				content: '<div>'+dataJson.data+'</div>',
				area: ['540px', '420px'],
				scrollbar: false,
				btn: ['关闭'],
				closeBtn: 0,
				btn1: function(index){
					var buttonName = "关闭算法查看结果";
					addition = "";
					logupLoad(buttonName,addition);
				}
			});*/
			//end test
			
			$.ajax({
				url:"/workbench/user_bi/task/"+uuid+"/algorithm_resultset",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						layer.open({
							title:'查看算法结果集',
							content: '<div style="height:420px;">'+dataJson.data+'</div>',
							area: '540px',
							scrollbar: false,
							btn: ['关闭'],
							closeBtn: 0,
							btn1: function(index){
								var buttonName = "关闭算法查看结果";
								addition = "";
								logupLoad(buttonName,addition);
							}
						});
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//加载任务结果列表
		loadTaskResult:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			
			//test
			//var testRunJson = '{"result_list": [["uuid","name","img","size","type"],["uuid","name","img","size","type"]],"totalCount":100,"error_messge":"","error_code":0}';
			/*var testRunJson = '{"result_list": [["name","../static/img/test.png","size","1"],["name","../static/img/test.txt","size","0"]],"totalCount":100,"error_messge":"","error_code":0}';
			
			var dataJson = JSON.parse(testRunJson);
			if(dataJson.error_code==0){
				eventHandler.showResultList(uuid,dataJson.result_list);
			}else{
				$("#msg-content").html(dataJson.error_messge);
				$("#msg-box").animate({top:"0"});
			}*/
			//end test
			
			
			$.ajax({
				url:"/workbench/user_bi/task/"+uuid+"/result_list",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						/*$('.success-heading').html("删除任务成功！！");
						$('#success-box').animate({top:'0'});*/
						eventHandler.showResultList(uuid,dataJson.result_list);
						//setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		
		//任务报错
		errorRunTask:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_bi/task/"+uuid+"/error",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("此任务已提交到管理员！！");
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
		
		//删除任务请求
		removeMission:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_bi/task/"+uuid+"/delete",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("删除任务成功！！");
						$('#success-box').animate({top:'0'});
						ajaxHandler.loadUnMission(".unmission-content");
						ajaxHandler.loadFinshMission(".finishMission-content");
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//加载已完成任务
		loadFinshMission:function(ele){
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			
			var acount = $("#account-name").html();
			var pageNo = $(ele).attr("data-pageNo");
			
			//test
			/*eventHandler.loadFinshtask(data1.data_list);
			var totalPage = Math.ceil(data1.totalCount / pageSize);
			eventHandler.bindFinshPage($(ele).find(".pageContainer"),totalPage);*/
			//end test
			
			$.ajax({
				url:"/workbench/user_bi/task/finished/list",
				type:"POST",
				timeout:30000,
				data:{
					page_No:pageNo,
					page_size:pageSize,
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data); 
					if(dataJson.error_code==0){
						/*$('.success-heading').html("加载任务成功！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);*/
						eventHandler.loadFinshtask(dataJson.data_list);
						var totalPage = Math.ceil(dataJson.totalCount / pageSize);
						eventHandler.bindFinshPage($(ele).find(".pageContainer"),totalPage);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//加载未完成任务
		loadUnMission:function(ele){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			var acount = $("#account-name").html();
			var pageNo = $(ele).attr("data-pageNo");
			
			//test
			/*eventHandler.loadUntask(data2.data_list);
			var totalPage = Math.ceil(data2.totalCount / pageSize);
			eventHandler.bindAllPage($(ele).find(".pageContainer"),totalPage);*/
			//end test
			
			$.ajax({
				url:"/workbench/user_bi/task/unfinished/list",
				type:"POST",
				timeout:30000,
				data:{
					page_No:pageNo,
					page_size:pageSize,
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					
					if(dataJson.error_code==0){
/*						$('.success-heading').html("加载任务成功！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);*/
						eventHandler.loadUntask(dataJson.data_list);
						var totalPage = Math.ceil(dataJson.totalCount / pageSize);
						eventHandler.bindAllPage($(ele).find(".pageContainer"),totalPage);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		
		
	}
	
	var eventHandler = {
		
		//批量选择
		mutiSelectTask:function(){
			$(".all-unfin-check").off("click");
			$(".all-unfin-check").on("click",function(){
				var buttonName = "全选/反选";
				addition = "未完成任务";
				logupLoad(buttonName,addition);
				
				if($(".all-unfin-check").prop("checked")){
					$(this).parent().parent().parent().parent().find(".task-check").prop("checked",true);
				}else{
					$(this).parent().parent().parent().parent().find(".task-check").prop("checked",false);
				}
				
			});
			$(".all-fin-check").off("click");
			$(".all-fin-check").on("click",function(){
				var buttonName = "全选/反选";
				addition = "未完成任务";
				logupLoad(buttonName,addition);
				if($(".all-fin-check").prop("checked")){
					$(this).parent().parent().parent().parent().find(".task-check").prop("checked",true);
				}else{
					$(this).parent().parent().parent().parent().find(".task-check").prop("checked",false);
				}
				
			});
		},
		
		//任务批量删除
		deleteMutiTask:function(){
			$(".delete-unfin-task").off("click");
			$(".delete-unfin-task").on("click",function(){
				
				var parent = $(this).parent();
				var check_num = 0;
				
				parent.find(".task-check").each(function(index, element) {
					if($(element).prop("checked")){
						check_num++;
					}
				});
				if(check_num>0){
					
					//日志
					var buttonName = $(this).text();
					addition = "未完成任务列表";
					logupLoad(buttonName,addition);
					//end 日志
					$("#deleteMutiTaskModal").modal("show");
					$(".deleteMutiTaskBtn").off("click");
					$(".deleteMutiTaskBtn").on("click",function(){
						
						//日志
						buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
						addition = $(this).text().replace(/\s+/g,'')+buttonName;
						logupLoad(buttonName,addition);
						//日志end
						
						parent.find(".task-check").each(function(index, element) {
							if($(element).prop("checked")){
								var uuid = $(element).attr("data-uuid");
								ajaxHandler.removeMission(uuid);
							}
						});
						$("#deleteMutiTaskModal").modal("hide");
						$(".all-check").prop("checked",false);
					})
				}else{
					$("#msg-content").html("请选选中一个任务");
					$("#msg-box").animate({top:"0"});
				}
				
			})
			
			$(".delete-fin-task").off("click");
			$(".delete-fin-task").on("click",function(){
				var parent = $(this).parent();
				var check_num = 0;
				parent.find(".task-check").each(function(index, element) {
					if($(element).prop("checked")){
						check_num++;
					}
				});
				if(check_num>0){
					//日志
					var buttonName = $(this).text();
					addition = "未完成任务列表";
					logupLoad(buttonName,addition);
					//end 日志
					$("#deleteMutiTaskModal").modal("show");
					$(".deleteMutiTaskBtn").off("click");
					$(".deleteMutiTaskBtn").on("click",function(){
						//日志
						buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
						addition = $(this).text().replace(/\s+/g,'')+buttonName;
						logupLoad(buttonName,addition);
						//日志end
						
						parent.find(".task-check").each(function(index, element) {
							if($(element).prop("checked")){
								var uuid = $(element).attr("data-uuid");
								ajaxHandler.removeMission(uuid);
							}
						});
						$("#deleteMutiTaskModal").modal("hide");
						$(".all-check").prop("checked",false);
					})
				}else{
					$("#msg-content").html("请选选中一个任务");
					$("#msg-box").animate({top:"0"});
				}
			})
			
			
		},
		
		//报错
		errorRunTask:function(){
			
			$(".error-run").off("click");
			$(".error-run").on("click",function(){
				var uuid = $(this).attr("data-uuid");
				ajaxHandler.errorRunTask(uuid);
			})
		},
		
		//查看任务结果
		viewMissionResult:function(){
			$(".detail-run").off("click");
			$(".detail-run").on("click",function(){
				$(this).parent().parent().find(".isread").css("display","none");
				//日志
				var buttonName = $(this).text();
				addition = "任务列表";
				logupLoad(buttonName,addition);
				//end 日志
				$("#viewTaskModal").modal("show");
				var uuid = $(this).attr("data-uuid");
				ajaxHandler.loadTaskResult(uuid);
			})
			
		},

		
		//删除任务
		removeTask:function(){
			$(".delete-run").off("click");
			$(".delete-run").on("click",function(){
				//日志
				var buttonName = $(this).text();
				addition = "任务列表";
				logupLoad(buttonName,addition);
				//end 日志
				
				$("#deleteTaskModal").modal("show");
				var uuid = $(this).attr("data-uuid");	
				$(".deleteTaskBtn").off("click");
				$(".deleteTaskBtn").on("click",function(){
					
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//日志end
					ajaxHandler.removeMission(uuid);
					$("#deleteTaskModal").modal("hide");
				})		
			})
		},
		//查看所有任务的详细
		viewUnreceiveTask:function(){
			$(".detail-task").off("click");
			$(".detail-task").on("click",function(){
				//日志
				var buttonName = $(this).text();
				addition = "任务列表";
				logupLoad(buttonName,addition);
				//end 日志
				
				$("#viewTaskModal").modal("show");	
				var target = $(this).parent().parent();	
				var uuid = target.find(".task-name").attr("data-uuid");
				var name = target.find(".task-name").html();
				var deadline = target.find(".task-deadline").html();
				var description = target.find(".task-description").attr("data-description");
				var result = target.find(".task-result").attr("data-result");
				var status = parseInt(target.find(".task-result").attr("data-status"));
				
				$("#viewTaskModal").find(".task-name").val(name);
				$("#viewTaskModal").find(".task-deadline").val(deadline);
				$("#viewTaskModal").find(".task-result").val(result);
				$("#viewTaskModal").find(".task-description").val(description);
				
				if(status==1){
					$("#viewTaskModal").find(".receive-task-sumbit").css("display","inline-block");
				}else{
					$("#viewTaskModal").find(".receive-task-sumbit").css("display","none");
				}
				
				
			})
		},
		
		//预览结果
		previewResult:function(){
			$(".preview-run").off("click");
			$(".preview-run").on("click",function(){
				var url = $(this).attr("data-url");
				layer.open({
					title:'查看图表',
					content: '<img style="height:720px;width:100%;" src="'+url+'">',
					area: '840px',
					scrollbar: false,
					btn: ['关闭'],
					closeBtn: 0,
					btn1: function(index){
						var buttonName = "关闭查看图表";
						addition = "";
						logupLoad(buttonName,addition);
					}
				});
				
				
			});
		},
		
		//查看结果集
		viewRun:function(){
			$(".view-run").off("click");
			$(".view-run").on("click",function(){
				var uuid = $(this).attr("data-uuid");
				ajaxHandler.loadResultSet(uuid);
			});
			
		},
		//加载任务结果列表
		showResultList:function(uuid,data){
						
			//type ele[3]:0 图片
			//type ele[3]:1 文本
			var target = $("#result-table");
			target.find(".data-tbody").html("");

			data.forEach(function(ele,idx){

				var tpl = $('<tr class="resultrow gradeA"></tr>');
				var td_tpl = "";
				td_tpl += '<td class="result-name" data-uuid="'+ele[4]+'" style="word-break:break-all">'+ele[0]+'</td>';
				//缩略图
				if(parseInt(ele[3])==1){
					td_tpl += '<td class="result-img"><img style="width:100px;" src="'+ele[1]+'"/></td>';
				}else{
					td_tpl += '<td class="result-img"></td>';
				}
				
				//td_tpl += '<td class="result-img"><img style="width:100px;" src="../static/img/test.png"/></td>';
				td_tpl += '<td class="result-size">'+ele[2]+'</td>';
				
				if(parseInt(ele[3])==1){
					td_tpl += '<td class="task-result" style="width:130px;"><span class="preview-run" data-url="'+ele[1]+'">预览</span><a class="dw-run" href="'+ele[1]+'" download="'+ele[0]+'">下载</a></td>';
				}else{
					//td_tpl += '<td class="task-result"><span class="view-run">查看</span><a class="dw-run" href="../bichart.txt" download="bi">下载</a></td>';
					td_tpl += '<td class="task-result" style="width:130px;"><span class="view-run" data-uuid="'+ele[4]+'">查看</span><a class="dw-run" href="'+ele[1]+'" download="'+ele[0]+'">下载</a></td>';
				}
				
				
				tpl.append(td_tpl);
				
				
				
				if(idx%2==0){
					tpl.addClass("odd");
				}else{
					tpl.addClass("even");
				}
				
				target.find(".data-tbody").append(tpl);
			});

			eventHandler.previewResult();
			eventHandler.viewRun();
			
			//日志
			$(".preview-run").on("click",function(){
				buttonName = "预览图表";
				addition = "查看任务";
				logupLoad(buttonName,addition);
			})
			
			$(".view-run").on("click",function(){
				var buttonName = "查看算法";
				addition = "查看任务";
				logupLoad(buttonName,addition);
			})
			
			$(".dw-run").on("click",function(){
				var buttonName = "下载任务结果";
				addition = "查看任务";
				logupLoad(buttonName,addition);
			})
			//end 日志
			
			
			$("[data-toggle='tooltip']").tooltip();	
		},
		
		//渲染UI
		loadFinshtask:function(data){
			//static 0完成 1失败 2进行中

			var target = $("#finish-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class="taskrow gradeA"></tr>');
				var td_tpl = "";
				if(ele[9]==0){
					td_tpl += '<td class="tasks-check"><input type="checkbox" name="task-check" class="task-check" data-uuid="'+ele[0]+'"/><span class="isread"></span></td>';
				}else{
					td_tpl += '<td class="tasks-check"><input type="checkbox" name="task-check" class="task-check" data-uuid="'+ele[0]+'"/></td>';
				}
				
				td_tpl += '<td class="task-result"><span class="detail-run" data-uuid="'+ele[0]+'">查看结果</span><span class="delete-run" data-uuid="'+ele[0]+'">删除任务</span></td>';
				td_tpl += '<td class="task-name" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				td_tpl += '<td class="project-name">'+ele[2]+'</td>';
				td_tpl += '<td class="task-create-time">'+ele[3]+'</td>';
				td_tpl += '<td class="task-finish-time">'+ele[4]+'</td>';
				td_tpl += '<td class="task-plan"><progress value="'+ele[5]+'" max="100"></progress>'+ele[5]+'%</td>';
				if(ele[6]==0){
					td_tpl += '<td class="task-result" data-status="'+ele[6]+'">完成</td>';
				}else if(ele[6]==1){
					td_tpl += '<td class="task-result" data-status="'+ele[6]+'">进行中</td>';
				}else if(ele[6]==2){
					td_tpl += '<td class="task-result" data-status="'+ele[6]+'">失败</td>';
				}
				td_tpl += '<td class="task-creater">'+ele[7]+'</td>';
				td_tpl += '<td class="task-consume">'+ele[8]+'</td>';
				//<i class="fa fa-trash-o task-remove cz-item" data-toggle="tooltip" data-placement="bottom" title="放弃任务"></i
				tpl.append(td_tpl);
				
				if(idx%2==0){
					tpl.addClass("odd");
				}else{
					tpl.addClass("even");
				}
				
				target.find(".data-tbody").append(tpl);
			});
			//排序
			target.addClass("sortable");
			$.bootstrapSortable(true);
			eventHandler.removeTask();
			eventHandler.viewMissionResult();
			eventHandler.mutiSelectTask();
			eventHandler.deleteMutiTask();
			$("[data-toggle='tooltip']").tooltip();	
		},
		
		//未完成任务UI
		loadUntask:function(data){
			
			var target = $("#all-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class="taskrow gradeA"></tr>');
				var td_tpl = "";
				td_tpl += '<td class="tasks-check"><input type="checkbox" name="task-check" class="task-check" data-uuid="'+ele[0]+'"/></td>';
				
				/*if(ele[5]==2){
					td_tpl += '<td class="task-result"><span class="delete-run" data-uuid="'+ele[0]+'">删除任务</span><span class="error-run" data-uuid="'+ele[0]+'">故障申告</span></td>';	
				}else{
					td_tpl += '<td class="task-result"><span class="delete-run" data-uuid="'+ele[0]+'">删除任务</span></td>';
				}*/
				
				td_tpl += '<td class="task-result"><span class="delete-run" data-uuid="'+ele[0]+'">删除任务</span></td>';
				
				td_tpl += '<td class="task-name" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				td_tpl += '<td class="project-name">'+ele[2]+'</td>';
				td_tpl += '<td class="task-create-time">'+ele[3]+'</td>';
				td_tpl += '<td class="task-plan"><progress value="'+ele[4]+'" max="100"></progress>'+ele[4]+'%</td>';
				if(ele[5]==0){
					td_tpl += '<td class="task-result" data-status="'+ele[5]+'">完成</td>';
				}else if(ele[5]==1){
					td_tpl += '<td class="task-result" data-status="'+ele[5]+'">任务进行中</td>';
				}else if(ele[5]==2){
					td_tpl += '<td class="task-result" data-status="'+ele[5]+'">失败</td>';
				}
				td_tpl += '<td class="task-creater">'+ele[6]+'</td>';
				
			
				tpl.append(td_tpl);
				
				if(idx%2==0){
					tpl.addClass("odd");
				}else{
					tpl.addClass("even");
				}
				
				target.find(".data-tbody").append(tpl);
			});
			//排序
			target.addClass("sortable");
			$.bootstrapSortable(true);
			eventHandler.removeTask();
			eventHandler.mutiSelectTask();
			eventHandler.deleteMutiTask();
			$("[data-toggle='tooltip']").tooltip();	
		},
		//我的任务 分页
		bindFinshPage:function(ele,totalPage){
			var pageNo = ele.attr("data-pageNo");
			ele.bootpag({
                total: totalPage,          // total pages
                page: pageNo,            // default page
                maxVisible: 10,     // visible pagination
                leaps: true         // next/prev leaps through maxVisible
            }).unbind("page").on("page", function(event, num){
				ele.attr("data-pageNo",num);
				ajaxHandler.loadFinshMission(ele);
            });
		},
		//全部任务 分页
		bindAllPage:function(ele,totalPage){
			var pageNo = ele.attr("data-pageNo");
			ele.bootpag({
                total: totalPage,          // total pages
                page: pageNo,            // default page
                maxVisible: 10,     // visible pagination
                leaps: true         // next/prev leaps through maxVisible
            }).unbind("page").on("page", function(event, num){
				ele.attr("data-pageNo",num);
				ajaxHandler.loadUnMission(ele);
            });
		}
		
	};
	
})();
