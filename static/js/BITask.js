// JavaScript Document
(function(){
	
	var pageSize = 10;
	
	
	
	//test
		var testJson = '{"data_list": [["uuid","name","create_time","start_time","deadline","finish_time","receiver","description",1,"day"],["uuid","name","create_time","start_time","deadline","finish_time","receiver","description",0,"day"]],"totalCount":100}';
		
		var testJson = '{"data_list": [["123","14","tes","te","43","23","32","32",1,"4"],["255","34","76","5","yty","76","76","76",0,"76"]],"totalCount":100}';
		var data1 = JSON.parse(testJson);
		
	    testJson = '{"data_list": [["uuid","name","create_time","start_time","deadline","finish_time","","description",3,0,"progress-description","day"],["uuid","name","create_time","start_time","deadline","finish_time","result","description",0,100,"progress-description","day"],["uuid","name","create_time","start_time","deadline","finish_time","","description",2,20,"progress-description","day"]],"totalCount":100}';
		var data2 = JSON.parse(testJson);

		//eventHandler.loadAlltask(data1);
		//eventHandler.loadMytask(data2);
		//end test
	
		
	
	$(function(){
		
		
		$("html").on("click",function(){
			if($("#msg-box").css("top")=='0px'){
				$("#msg-box").animate({top:"-50%"});
			}
		});
		$("#msg-box").on("click",function(){
			$(this).animate({top:"-50%"});
		});
		
		ajaxHandler.loadAllData(".allmission-content");
		ajaxHandler.loadMyData(".mymission-content");
		chartHandler.evaluateChart();
		chartHandler.storageChart();
		
		$("[data-toggle='tooltip']").tooltip();	
	});
	
	var ajaxHandler = {
		//获取评价
		getEvaluateMission:function(uuid){
			
			//test
			/*var datalist= JSON.parse('{"comment":{"sd":"5","zl":"1","td":"2","bz":"bz1"}}');
			var data = datalist.comment;
			return data;*/
			//end test
			
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
							comment = "";
						}
						if(comment!=""){
							$('#evaluate-sd').raty({ readOnly: true,score: parseInt(comment.need_speed) });
							$('#evaluate-zl').raty({ readOnly: true,score: parseInt(comment.need_quality) });
							$('#evaluate-td').raty({ readOnly: true,score: parseInt(comment.need_status) });
							$('#task-bz').val(comment.remark);
							$('.evaluateTaskBtn').css("display","none");
						}
					
					$('#task-bz').attr("disabled","true");
					$("#evaluateTaskModal").modal("show");
						
						
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//提交需求
		submitMission:function(uuid,result){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_bi/needs/submit",
				type:"POST",
				timeout:30000,
				data:{
					uuid:uuid,
					result:result
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("提交需求成功！！");
						$('#success-box').animate({top:'0'});
						ajaxHandler.loadMyData(".mymission-content");
						$("#fin_need_num").html(parseInt($("#fin_need_num").html())+1);
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//提交需求进度
		submitSchdual:function(uuid,plan,progress_description){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_bi/needs/submit/progress",
				type:"POST",
				timeout:30000,
				data:{
					uuid:uuid,
					plan:plan,
					progress_description:progress_description
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("提交进度成功！！");
						$('#success-box').animate({top:'0'});
						ajaxHandler.loadMyData(".mymission-content");;
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//接受需求请求
		receiveMission:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			var user = $("#account-name").html();
			$.ajax({
				url:"/workbench/user_bi/needs/"+uuid+"/receive",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("接受需求成功！！");
						$('#success-box').animate({top:'0'});
						ajaxHandler.loadMyData(".mymission-content");;
						ajaxHandler.loadAllData(".allmission-content");
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						$("#acc_need_num").html(parseInt($("#acc_need_num").html())+1);
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
				url:"/workbench/task/delete/"+uuid,
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
						ajaxHandler.loadMyData(".mymission-content");;
						ajaxHandler.loadAllData(".allmission-content");
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//加载我的需求
		loadMyData:function(ele){
			
			
			//test
			/*eventHandler.loadMytask(data2.data_list);
			$("#fin_need_num").html("("+data2.totalCount+")");
			var totalPage = Math.ceil(data2.totalCount / pageSize);
			eventHandler.bindMyPage($(ele).find(".pageContainer"),totalPage);*/
			//end test
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			var acount = $("#account-name").html();
			var pageNo = $(ele).attr("data-pageNo");
			
			$.ajax({
				url:"/workbench/user_bi/needs/received/list",
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
						$('.success-heading').html("加载需求成功！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						eventHandler.loadMytask(dataJson.data_list);
						$("#fin_need_num").html("("+dataJson.totalCount+")");
						var totalPage = Math.ceil(dataJson.totalCount / pageSize);
						eventHandler.bindMyPage($(ele).find(".pageContainer"),totalPage);
					
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//加载未领取的需求
		loadAllData:function(ele){
			
			//test
			/*eventHandler.loadAlltask(data1.data_list);
			var totalPage = Math.ceil(data1.totalCount / pageSize);
			eventHandler.bindAllPage($(ele).find(".pageContainer"),totalPage);*/
			//end test
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			var acount = $("#account-name").html();
			var pageNo = $(ele).attr("data-pageNo");
			$.ajax({
				url:"/workbench/user_bi/needs/unreceived/list",
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
						$('.success-heading').html("加载需求成功！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						eventHandler.loadAlltask(dataJson.data_list);
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
	
	//图表控制器
	var chartHandler= {
		//评价图表
		evaluateChart:function(){
			["#14ADC4","#ececec","#7cb5ec","#e55555","#ff8788","#7ec6ff","#fedc78"]
			RingChart("satisfaction-chart",$("#satisfaction-chart").attr("data-num"),"用户满意度"," ",["#14ADC4","#ececec"]);
		},
		//存储空间
		storageChart:function(){
			var used = parseInt($("#storage-chart").attr("data-used"));
			var unUsed = parseInt($("#storage-chart").attr("data-unUsed"));
			var precent = used/(unUsed+used);
			if(precent>0.9){
				$(".detail-tip").html("当前存储空间快满，请清除文件已释放空间");
			}
			precent = (precent*100).toFixed(2);
			RingChart("storage-chart",precent,"存储空间已用"," ",["#7cb5ec","#ececec"]);
		}
		
	}
	
	
	var eventHandler = {
		
		//获取需求评价
		evaluateTask:function(){
			$(".task-evaluate").on("click",function(){
				$('.evaluate').raty({readOnly: true});
				var uuid = $(this).parent().parent().find(".task-name").attr("data-uuid");	
				ajaxHandler.getEvaluateMission(uuid);
				
				
			})
			
		},
		
		//接受需求
		receiveTask:function(uuid){
			$(".receive-task").off("click")
			$(".receive-task").on("click",function(){
				
				buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
				addition = $(this).text().replace(/\s+/g,'')+buttonName;
				logupLoad(buttonName,addition);
				$("#viewTaskModal").modal("hide");
				$("#receiveTaskModal").modal("show");
				$(".receiveTaskBtn").off("click");
				$(".receiveTaskBtn").on("click",function(){
					ajaxHandler.receiveMission(uuid);
					$("#receiveTaskModal").modal("hide");
				});
				$(".unreceiveTaskBtn").off("click");
				$(".unreceiveTaskBtn").on("click",function(){
					$("#viewTaskModal").modal("show");
				})
			})
		},
		//删除需求
		removeTask:function(){
			$(".task-remove").on("click",function(){
				$("#deleteTaskModal").modal("show");
				var uuid = $(this).parent().parent().find(".task-name").attr("data-uuid");	
				$(".deleteTaskBtn").off("click");
				$(".deleteTaskBtn").on("click",function(){
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					ajaxHandler.removeMission(uuid);
					$("#deleteTaskModal").modal("hide");
				})		
			})
		},
		//查看所有需求的详细
		viewUnreceiveTask:function(){
			$(".detail-task").off("click");
			$(".detail-task").on("click",function(){
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
					$("#viewTaskModal").find(".receive-task").css("display","inline-block");
				}else{
					$("#viewTaskModal").find(".receive-task").css("display","none");
				}
				eventHandler.receiveTask(uuid);
				
			})
		},
		
		//查看提交需求
		viewTask:function(){
			$(".task-view").off("click");
			$(".task-view").on("click",function(){
				var status = parseInt($(this).parent().parent().find(".task-result").attr("data-status"));
				
				
				if(status==3){
					$(".sumbit-task").css("display","none");
					$(".post-schedule").css("display","none");
					$(".read-result").css("display","none");
					$(".task-result").attr("disabled","disabled");
					$(".progress-description").attr("disabled","disabled");
					$(".task-schedule").attr("readonly",true);
				}else if(status==0){
					$(".sumbit-task").css("display","none");
					$(".post-schedule").css("display","none");
					$(".task-result").attr("disabled","disabled");
					$(".progress-description").attr("disabled","disabled");
					$(".task-schedule").attr("readonly",true);
				}else{
					$(".sumbit-task").css("display","inline-block");
					$(".post-schedule").css("display","inline-block");
					$(".read-result").css("display","inline-block");
					$(".task-result").removeAttr("disabled");
					$(".progress-description").removeAttr("disabled");
					$(".task-schedule").removeAttr("readonly");
				}
				
				$("#sumbitTaskModal").modal("show");	
				var target = $(this).parent().parent();	
				var uuid = target.find(".task-name").attr("data-uuid");
				var name = target.find(".task-name").html();
				var deadline = target.find(".task-deadline").html();
				var description = target.find(".task-description").attr("data-description");
				var result = target.find(".task-result").attr("data-result");
				var plan = target.find(".task-plan").attr("data-progress");
				var progress_description = target.find(".task-plan").attr("progress-description");
				//plan = plan.substring(0,plan.length-1);
				
				if(result==""){
					$(".read-result").css("display","none");
				}else{
					$(".read-result").css("display","inline-block");
					$(".read-result").off("click");
					$(".read-result").on("click",function(){
						window.open(result,"_blank");
					});
				}
				
				$("#sumbitTaskModal").find(".task-result").val("");
				
				$("#sumbitTaskModal").find(".task-name").val(name);
				$("#sumbitTaskModal").find(".task-deadline").val(deadline);
				$("#sumbitTaskModal").find(".task-result").val(result);
				$("#sumbitTaskModal").find(".task-description").val(description);
				$("#sumbitTaskModal").find(".task-schedule").val(parseInt(plan));	
				$("#sumbitTaskModal").find(".progress-description").val(progress_description);	
				
				$(".sumbit-task").off("click");
				$(".sumbit-task").on("click",function(){
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					
					result = $("#sumbitTaskModal").find(".task-result").val();
					if(result!=""){
						ajaxHandler.submitMission(uuid,result);
						$("#sumbitTaskModal").modal("hide");
					}else{
						$("#msg-content").html("提交需求结果不能为空");
						$("#msg-box").animate({top:"0"});
					}
					
				});
				$(".post-schedule").off("click");
				$(".post-schedule").on("click",function(){
					
					buttonName = $(this).text().replace(/\s+/g,'');
					addition = "需求详情";
					logupLoad(buttonName,addition);
					
					var schedule = parseInt($("#sumbitTaskModal").find(".task-schedule").val());
					var description = $("#sumbitTaskModal").find(".progress-description").val();
					if(schedule!=""){
						if(schedule<0||schedule>100){
							$("#msg-content").html("需求进度不能大于100小于0！！");
							$("#msg-box").animate({top:"0"});
						}else if(schedule==100){
							$(".sumbit-task").trigger("click");
						}else{
							ajaxHandler.submitSchdual(uuid,schedule,description);
							$("#sumbitTaskModal").modal("hide");
						}
					}else{
						$("#msg-content").html("提交需求进度不能为空");
						$("#msg-box").animate({top:"0"});
					}
					
				});
				
			})
		},
		//渲染UI
		loadMytask:function(data){
			//static 0完成 1待接受 2进行中 3失效
			
			var target = $("#my-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class=" gradeA"></tr>');
				var td_tpl = "";
				if(ele[8]==0){
					td_tpl += '<td class="task-description" data-description="'+ele[7]+'"><span class="task-view cz-item">详情</span><span class="task-evaluate cz-item" style="margin-left:10px">查看评价</span></td>';
				}else{
					td_tpl += '<td class="task-description" data-description="'+ele[7]+'"><span class="task-view cz-item">详情</span></td>';
				}
				
				td_tpl += '<td class="task-name" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				td_tpl += '<td class="task-create-time">'+ele[2]+'</td>';
				td_tpl += '<td class="task-start-time">'+ele[3]+'</td>';
				td_tpl += '<td class="task-finish-time">'+ele[5]+'</td>';
				if(ele[8]==0){
					td_tpl += '<td class="task-result" data-result="'+ele[6]+'" data-status="'+ele[8]+'">完成</td>';
				}else if(ele[8]==2){
					td_tpl += '<td class="task-result" data-result="'+ele[6]+'" data-status="'+ele[8]+'">需求进行中</td>';
				}else if(ele[8]==3){
					td_tpl += '<td class="task-result" data-result="'+ele[6]+'" data-status="'+ele[8]+'">失效</td>';
				}
				td_tpl += '<td class="task-plan" data-progress="'+ele[9]+'" progress-description="'+ele[10]+'"><progress value="'+ele[9]+'" max="100"></progress>'+ele[9]+'%</td>';
				td_tpl += '<td class="task-deadline">'+ele[4]+'</td>';
				td_tpl += '<td class="task-day">'+ele[11]+'</td>';
				//<i class="fa fa-trash-o task-remove cz-item" data-toggle="tooltip" data-placement="bottom" title="放弃需求"></i
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
			eventHandler.viewTask();
			eventHandler.removeTask();
			eventHandler.evaluateTask();
			
			//日志
			$(".cz-item").on("click",function(){
				var buttonName = $(this).text();
				addition = "需求列表";
				logupLoad(buttonName,addition);
			})
			//end 日志
			$("[data-toggle='tooltip']").tooltip();	
		},
		
		loadAlltask:function(data){
			
			var target = $("#all-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class=" gradeA"></tr>');
				var td_tpl = "";
				if(ele[8]==0){
					td_tpl += '<td class="task-description" data-description="'+ele[7]+'"><span class="detail-task">详情</span></td>';
				}else if(ele[8]==1){
					td_tpl += '<td class="task-description" data-description="'+ele[7]+'"><span class="detail-task">详情</span></td>';
				}else if(ele[8]==2){
					td_tpl += '<td class="task-description" data-description="'+ele[7]+'"><span class="detail-task">详情</span></td>';
				}else if(ele[8]==3){
					td_tpl += '<td class="task-description" data-description="'+ele[7]+'"><span class="detail-task">详情</span></td>';
				}
				td_tpl += '<td class="task-name need-item" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				td_tpl += '<td class="task-create-time need-item">'+ele[2]+'</td>';
				td_tpl += '<td class="task-start-time need-item">'+ele[3]+'</td>';
				td_tpl += '<td class="task-finish_time need-item">'+ele[5]+'</td>';
				td_tpl += '<td class="task-receiver need-item">'+ele[6]+'</td>';
				if(ele[8]==0){
					td_tpl += '<td class="task-result need-item" data-status="'+ele[8]+'">完成</td>';
				}else if(ele[8]==1){
					td_tpl += '<td class="task-result need-item" data-status="'+ele[8]+'">待接受</td>';
				}else if(ele[8]==2){
					td_tpl += '<td class="task-result need-item" data-status="'+ele[8]+'">进行中</td>';
				}else if(ele[8]==3){
					td_tpl += '<td class="task-result need-item" data-status="'+ele[8]+'">失效</td>';
				}
				td_tpl += '<td class="task-deadline need-item">'+ele[4]+'</td>';
				td_tpl += '<td class="task-day">'+ele[9]+'</td>';
			
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
			eventHandler.viewUnreceiveTask();
			//日志
			$(".detail-task").on("click",function(){
				var buttonName = $(this).text();
				addition = "需求列表";
				logupLoad(buttonName,addition);
			})
			//end 日志
			
			$("[data-toggle='tooltip']").tooltip();	
		},
		//我的需求 分页
		bindMyPage:function(ele,totalPage){
			var pageNo = ele.attr("data-pageNo");
			ele.bootpag({
                total: totalPage,          // total pages
                page: pageNo,            // default page
                maxVisible: 10,     // visible pagination
                leaps: true         // next/prev leaps through maxVisible
            }).unbind("page").on("page", function(event, num){
				ele.attr("data-pageNo",num);
				ajaxHandler.loadMyData(ele);
            });
		},
		//全部需求 分页
		bindAllPage:function(ele,totalPage){
			var pageNo = ele.attr("data-pageNo");
			ele.bootpag({
                total: totalPage,          // total pages
                page: pageNo,            // default page
                maxVisible: 10,     // visible pagination
                leaps: true         // next/prev leaps through maxVisible
            }).unbind("page").on("page", function(event, num){
				ele.attr("data-pageNo",num);
				ajaxHandler.loadAllData(ele);
            });
		}
		
	};
	
})();
