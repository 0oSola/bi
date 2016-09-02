// JavaScript Document
(function(){
	
	
	//test
	var testFinJson = '{"data_list": [["1c23fdsd0ad12","k均值结果图","../static/img/test.png","项目1","2015-10-01","50kb","Jonny",1],["1c23fdsd0ad21","k均值结果集","url","项目1","2015-10-01","15kb","Jonny",0]],"totalCount":10,"error_messge":"","error_code":0}';
	var data1 = JSON.parse(testFinJson);
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
		
		ajaxHandler.loadMaterial(".finishMission-content");

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
				content: '<div style="height:420px">'+dataJson.data+'</div>',
				area: '540px',
				scrollbar: false,
				closeBtn: 0,
				btn: ['关闭'],
				cancel: function(index){
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
							closeBtn: 0,
							content: '<div style="height:420px">'+dataJson.data+'</div>',
							area: '540px',
							scrollbar: false,
							btn: ['关闭'],
							cancel: function(index){
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
		
		
		
		//删除素材
		removematerial:function(uuid){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			$.ajax({
				url:"/workbench/user_bi/material/"+uuid+"/delete",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						$('.success-heading').html("删除素材成功！！");
						$('#success-box').animate({top:'0'});
						ajaxHandler.loadMaterial(".finishMission-content");
						
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);
		},
		//加载素材列表
		loadMaterial:function(ele){
			
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());
			
			var acount = $("#account-name").html();
			var pageNo = $(ele).attr("data-pageNo");
			
			//test
			eventHandler.loadMaterial(data1.data_list);
			var totalPage = Math.ceil(data1.totalCount / pageSize);
			eventHandler.bindFinshPage($(ele).find(".pageContainer"),totalPage);
			//end test
			
			$.ajax({
				url:"/workbench/user_bi/material/list",
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
						eventHandler.loadMaterial(dataJson.data_list);
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
		
		
		
	}
	
	var eventHandler = {
		
		
		
		//删除任务
		removeTask:function(){
			$(".delete-run").off("click");
			$(".delete-run").on("click",function(){
				$("#deleteTaskModal").modal("show");
				var uuid = $(this).attr("data-uuid");	
				$(".deleteTaskBtn").off("click");
				$(".deleteTaskBtn").on("click",function(){
					ajaxHandler.removeMission(uuid);
					$("#deleteTaskModal").modal("hide");
				})		
			})
		},
		
		//预览结果
		previewResult:function(){
			$(".preview-run").off("click");
			$(".preview-run").on("click",function(){
				var url = $(this).attr("data-url");
				layer.open({
					title:'查看图表',
					closeBtn: 0,
					content: '<img style="height:600px;width:100%" src="'+url+'">',
					area: '840px',
					scrollbar: false,
					btn: ['关闭'],
					cancel: function(index){
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
		//加载素材列表
		showMaterialList:function(uuid,data){
						
			//type ele[3]:0 图片
			//type ele[3]:1 文本
			var target = $("#result-table");
			target.find(".data-tbody").html("");

			data.forEach(function(ele,idx){

				var tpl = $('<tr class="resultrow gradeA"></tr>');
				var td_tpl = "";
				
				td_tpl += '<td class="result-name" data-uuid="'+uuid+'">'+ele[0]+'</td>';
				//缩略图
				if(parseInt(ele[3])==1){
					td_tpl += '<td class="result-img"><img style="width:100px;" src="'+ele[1]+'"/></td>';
				}else{
					td_tpl += '<td class="result-img"></td>';
				}
				
				//td_tpl += '<td class="result-img"><img style="width:100px;" src="../static/img/test.png"/></td>';
				td_tpl += '<td class="result-size">'+ele[2]+'</td>';
				
				if(parseInt(ele[3])==1){
					td_tpl += '<td class="task-result"><span class="preview-run" data-url="'+ele[1]+'">预览</span><a class="dw-run" href="'+ele[1]+'" download="'+ele[0]+'">下载</a></td>';
				}else{
					//td_tpl += '<td class="task-result"><span class="view-run">查看</span><a class="dw-run" href="../bichart.txt" download="bi">下载</a></td>';
					td_tpl += '<td class="task-result"><span class="view-run" data-uuid="'+uuid+'">查看</span><a class="dw-run" href="'+ele[1]+'" download="'+ele[0]+'">下载</a></td>';
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
				addition = "素材库";
				logupLoad(buttonName,addition);
			})
			
			$(".view-run").on("click",function(){
				var buttonName = "查看算法";
				addition = "素材库";
				logupLoad(buttonName,addition);
			})
			
			$(".dw-run").on("click",function(){
				var buttonName = "下载任务结果";
				addition = "素材库";
				logupLoad(buttonName,addition);
			})
			//end 日志
			
			$("[data-toggle='tooltip']").tooltip();	
		},
		
		//渲染UI
		loadMaterial:function(data){

			var target = $("#finish-table");
			target.find(".data-tbody").html("");
			
			data.forEach(function(ele,idx){

				var tpl = $('<tr class="taskrow gradeA"></tr>');
				var td_tpl = "";
				/*td_tpl = '<td class="muti-material-check"><input type="checkbox" name="material-check" class="material-check"/></td>';*/
				if(parseInt(ele[7])==1){
					td_tpl += '<td class="material-cz"><span class="preview-run" data-url="'+ele[2]+'">预览</span><a class="dw-run" href="'+ele[2]+'" download="'+ele[1]+'">下载</a></td>';
				}else{
					td_tpl += '<td class="material-cz"><span class="view-run" data-uuid="'+ele[0]+'">查看</span><a class="dw-run" href="'+ele[2]+'" download="'+ele[1]+'">下载</a></td>';
				}
				
				td_tpl += '<td class="material-name" data-uuid="'+ele[0]+'">'+ele[1]+'</td>';
				//缩略图
				if(parseInt(ele[7])==1){
					td_tpl += '<td class="material-url"><img style="width:100px;" src="'+ele[2]+'"/></td>';
					td_tpl += '<td class="material-type">图表</td>';
				}else{
					td_tpl += '<td class="material-url"><img style="width:30px;" src="../static/img/txt.png"/></td>';
					td_tpl += '<td class="material-type">算法结果集</td>';
				}
				
				td_tpl += '<td class="project-name">'+ele[3]+'</td>';
				td_tpl += '<td class="material-size">'+ele[4]+'</td>';
				td_tpl += '<td class="material-create-time">'+ele[5]+'</td>';
				td_tpl += '<td class="task-creater">'+ele[6]+'</td>';
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
			eventHandler.previewResult();
			eventHandler.viewRun();
			
			//日志
			$(".preview-run").on("click",function(){
				buttonName = "预览图表";
				addition = "素材库";
				logupLoad(buttonName,addition);
			})
			
			$(".view-run").on("click",function(){
				var buttonName = "查看算法";
				addition = "素材库";
				logupLoad(buttonName,addition);
			})
			
			$(".dw-run").on("click",function(){
				var buttonName = "下载任务结果";
				addition = "素材库";
				logupLoad(buttonName,addition);
			})
			//end 日志
			
			$("[data-toggle='tooltip']").tooltip();	
		},
		
		
		//我的素材 分页
		bindFinshPage:function(ele,totalPage){
			var pageNo = ele.attr("data-pageNo");
			ele.bootpag({
                total: totalPage,          // total pages
                page: pageNo,            // default page
                maxVisible: 10,     // visible pagination
                leaps: true         // next/prev leaps through maxVisible
            }).unbind("page").on("page", function(event, num){
				ele.attr("data-pageNo",num);
				ajaxHandler.loadMaterial(ele);
            });
		},
		
	};
	
})();
