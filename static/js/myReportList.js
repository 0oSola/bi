// JavaScript Document
(function(){
	
	
	//test
	var testReportJson = '{"data_list": [["uuid","report_name","project_name","create_time","creater","url"],["uuid","report_name","project_name","create_time","creater","url"]],"totalCount":10,"error_messge":"","error_code":0}';
	var data1 = JSON.parse(testReportJson);
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
		
		
		axjaxHandler.loadReportList(".report-content");
		
	});
	
	var axjaxHandler = {
		//加载报表列表
		loadReportList:function(ele){
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			
			var pageNo = $(ele).attr("data-pageNo");
			
			//test
			/*eventHandler.showReportList(data1.data_list);
			var totalPage = Math.ceil(data1.totalCount / pageSize);
			eventHandler.bindPage($(ele).find(".pageContainer"),totalPage);*/
			//end test
			
			$.ajax({
				url:"/workbench/user_bi/report/list",
				type:"POST",
				timeout:30000,
				data:{
					page_No:pageNo,
					page_size:pageSize
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data); 
					if(dataJson.error_code==0){
						/*$('.success-heading').html("加载任务成功！！");
						$('#success-box').animate({top:'0'});*/
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						eventHandler.showReportList(dataJson.data_list);
						var totalPage = Math.ceil(dataJson.totalCount / pageSize);
						eventHandler.bindPage($(ele).find(".pageContainer"),totalPage);
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
		
		//显示报表列表
		showReportList:function(data){
			
			var target = $("#report-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class="gradeA"></tr>');
				var td_tpl = "";
				//{"data_list": [["uuid","report_name","create_time","creater","url"],["uuid","report_name","create_time","creater","url"]],"totalCount":10,"error_messge":"","error_code":0}
				td_tpl += '<td style="padding:2px 10px;"><span data-url="'+ele[4]+'" class="report_button report-sumbit">提交报表</span><a href="'+ele[4]+'" class="report_button report-review" target="_black">预览报表</a><span data-uuid='+ele[0]+'" class="report_button report-remove">删除报表</span></td>';
				td_tpl += '<td class="report-name" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				td_tpl += '<td class="create-time">'+ele[2]+'</td>';
				td_tpl += '<td class="creater">'+ele[3]+'</td>';
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
			eventHandler.deleteReport();
			eventHandler.sumbitReport();
			
			
			//日志
			$(".report_button").on("click",function(){
				var buttonName = $(this).text();
				addition = "报表列表";
				logupLoad(buttonName,addition);
			})
			//end 日志	
		
			
			$("[data-toggle='tooltip']").tooltip();	
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
				ajaxHandler.loadFinshData(ele);
            });
		},
		
		//提交报表
		sumbitReport:function(){
			$(".report-sumbit").off("click");
			$(".report-sumbit").on("click",function(){
				var url = $(this).attr("data-url");
				loadUnNeed(url);	
			});
		},
		
		//删除报表
		deleteReport:function(){
			$(".report-remove").off("click");
			$(".report-remove").on("click",function(){
				var uuid = $(this).attr("data-uuid");
				$("#deleteReportModal").modal("show");
				$(".deleteReportBtn").off("click");
				$(".deleteReportBtn").on("click",function(){
					
					//日志
					buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
					addition = $(this).text().replace(/\s+/g,'')+buttonName;
					logupLoad(buttonName,addition);
					//end 日志
					
					
					$.ajax({
						url:"/workbench/user_bi/report/"+uuid+"/delete",
						type:"GET",
						timeout:30000,
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								$('.success-heading').html("删除报表成功！！");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
								$("#deleteReportModal").modal("hide");
								window.location.reload();
								
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});
					setTimeout('$("#spin").css("display","none")',2000);
				});
				
			});
		}
	}
	
	
	//请求未完成需求
	function loadUnNeed(targetUrl){
		
		//test
		/*var testJson = '{"data_list": [["uuid","name","deadline","description"],["uuid","name","deadline","description"]]}';
		var data1 = JSON.parse(testJson).data_list;
		loadUI(data1,targetUrl);*/
		//end test
		
		$("#spin").css("display","block");
		$("#spin").css("height",$("#wrapper").height());

		$.ajax({
			url:"/workbench/user_bi/needs/unfinished/list",
			type:"GET",
			timeout:30000,
			error: function(){
				$("#msg-content").html("连接服务器失败，请联系管理员");
				$("#msg-box").animate({top:"0"});
			},
			success: function(data){
				var dataJson = JSON.parse(data);
				if(dataJson.error_code==0){
					loadUI(dataJson.data_list,targetUrl);
					
					//$('.success-heading').html("生成表报成功！！");
					//$('#success-box').animate({top:'0'});
					//setTimeout("$('#success-box').animate({top:'-50%'})",3000);
				}else{
					$("#msg-content").html(dataJson.error_messge);
					$("#msg-box").animate({top:"0"});
				}
			}
		});	
		setTimeout('$("#spin").css("display","none")',0);
	}
	
	//渲染列表
	function loadUI(data,targetUrl){
		
		var target = $("#task-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class=" gradeA"></tr>');
				var td_tpl = "";
				td_tpl += '<td class="task-cz"><input type="checkbox" data-uuid="'+ele[0]+'" class="task-check" name="check"/></td>';
				td_tpl += '<td class="task-name" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				td_tpl += '<td class="task-deadline">'+ele[2]+'</td>';
				td_tpl += '<td class="task-description">'+ele[3]+'</td>';
	
				tpl.append(td_tpl);
				
				if(idx%2==0){
					tpl.addClass("odd");
				}else{
					tpl.addClass("even");
				}
				
				target.find(".data-tbody").append(tpl);
				
			});
			
			layer.open({
				title:'批量确认需求',
				content: target.html(),
				area: '1040px',
				scrollbar: false,
				closeBtn:0,
				btn: ['确认','关闭'],
				yes: function(index, layero){
					var buttonName = "批量确认任务";
					addition = "报表提交";
					logupLoad(buttonName,addition);
					
					target.find(".data-tbody").html("");
					$(".task-check").each(function(index, element) {
						if($(this).prop("checked")==true){
							var uuid = $(this).attr("data-uuid"); 
							submitNeed(uuid,targetUrl);
						}
					});
				},btn2: function(index){
					var buttonName = "关闭";
					addition = "报表提交";
					logupLoad(buttonName,addition);
				}
			});
			
			$(".all-check").off("click");
			$(".all-check").on("click",function(){
				$(".task-check").each(function(index, element) {
					$(element).attr("checked",true);
				});
			});
	}
	
	
	//提交需求
	function submitNeed(uuid,result){

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
						$('.success-heading').html("提交需求结果成功！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',1000);
	}
	
	
})()