// JavaScript Document
(function(){
	
	//test
	var datatest = '{"chart_type":"area","chart_name":["增加量","激活量"],"y_name":"人数","x_name":["12/14","12/15","12/16","12/17","12/18","12/19","12/20"],"chart_data":[[3, 4, 3, 5, 4, 10, 12],[1, 3, 4, 3, 3, 5, 4]],"data_list":[["日期","设备","新增账户","新增设备"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"]],"totalCount":100,"error_code":0,"error_message":""}';
	
	var datatest = '{"chart_type":"area","chart_name":["近一周用户满意度","项目完成数量"],"y_name":"人数","x_name":["12/14","12/15","12/16","12/17","12/18","12/19","12/20"],"chart_data":[[3, 4, 3, 5, 4, 10, 12],[1, 3, 4, 3, 3, 5, 4]],"data_list":[["日期","设备","新增账户","新增设备"],["2015-01-01","11","0","21"]],"totalCount":100,"error_code":0,"error_message":""}'; 
	//end test
	
	var notice_list = '{"notice_count":999,"notice_list":[["task_name","finish_time"],"task_name2"],"error_code":0,"error_messge":""}';
	var notice_list = '{"notice_count":999,"notice_list":[["task_name","2016-03-28: 15:55:46"],["task_name2","2016-03-28: 15:55:46"]],"error_code":0,"error_messge":""}';
	//定时请求
	
	var locationUrl = location.href.substring(location.href.lastIndexOf('/')+1,location.href.length);
	
	function taskNotice(){  
		
		$.ajax({
			url:"/workbench/user_bi/task/finished/notice",
			type:"GET",
			timeout:30000,
			success: function(data){
				var dataJson = JSON.parse(data);
				if(dataJson.error_code==0){
					eventHandler.updateNotice(dataJson.notice_count,dataJson.notice_list);
				}
			}
		});
	}
	
	
	var eventHandler ={
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
			//end test
			
			
			
		},
		//更新通知
		updateNotice:function(num,dataJson){
			if(dataJson.length>0){
				$("#new-notice").addClass("show");
				$(".complate-list").css("display","block");
				$(".null-content").css("display","none");
				$("#new-notice").addClass("show");
				$("#new-notice").html(num);
				$(".complate-list").html("");
				
				$.each(dataJson,function(index,value){
					debugger;
					if(locationUrl.indexOf("workbench")>=0||locationUrl.indexOf("console")>=0){
						var html = '<li><a href="/workbench/user_bi/my_task" target="_blank">'+value[0]+'已完成,完成时间：<span style="font-size:10px;">'+value[1]+'</span></a></li>';
						$(".complate-list").append(html);
					}else{
						var html = '<li><a href="/workbench/user_bi/my_task">'+value[0]+'已完成,完成时间：<span style="font-size:10px;">'+value[1]+'</span></a></li>';
						$(".complate-list").append(html);
					}
					
				});
			}else{
				$("#new-notice").removeClass("show");
				$(".complate-list").css("display","none");
				$(".null-content").css("display","block");
			}
		} 
	}
	
	//ui更新
	var uiHandler = { 
		initNotice:function(){
			$(".notice-item").hover(function(){
				$(this).find("#drop-notice").stop(true,false).slideDown();	
			},function(){
				$(this).find("#drop-notice").stop(true,false).slideUp();
			})
			$(function(){
				$(".user-item").hover(function(){
					$(this).find("#drop-user").stop(true,false).slideDown();	
				},function(){
					$(this).find("#drop-user").stop(true,false).slideUp();
				})
			})
			
			/*$(".notice-item").on("mouseover",function(){
				 $("").slideDown();
				 $("#drop-notice").on("mouseover",function(){
				 	
				 }).on("mouseout",function(){
					$("#drop-notice").slideUp();
				 })
			})*/
			
		}	
	}
	
	$(function(){
		
		/*var dataJson = JSON.parse(notice_list);
		if(dataJson.error_code==0){
			eventHandler.updateNotice(dataJson.notice_count,dataJson.notice_list);
		}*/
		
		taskNotice();
		eventHandler.chartCreate(".satisfaction-content");
		uiHandler.initNotice();
		setInterval(taskNotice,10000);

		
	})
	
	
	
	
	
})()