 // JavaScript Document
/*
* sola
*/
(function(){
	var sourceList = [];
	var buttoncontent = $('#mainData'),
		menu = $('#menu'),
		topMenu = $("#top-menu");
	var instance;
	
	var workUI;
	var page = window.location.href;	 

	var noDB = "请选择关联的数据表";
	var nogl = "请先进行过滤数据";
	
	var new_uid = 0;
	
	
	var project_name = $("#project-name").html();
	
	var nowModal = "";
	
	var lineColor = '#A7A7A9',
		pstyle = {
			Endpoint: ["Dot", { radius: 2 }],
			paintStyle: {
				strokeStyle: lineColor,
				fillStyle: lineColor
			},
			connector: ["Flowchart", {stub: [0, 0], gap: 2, cornerRadius: 5, alwaysRespectStubs: true }],
			connectorStyle: {
				lineWidth: 1,
				strokeStyle: lineColor
			},
			maxConnections: -1
		};
	

	//加载扩展模块
	layer.config({
		extend: 'extend/layer.ext.js'
	});
	$(".close-work").on("click",function(){
		
		if (confirm("您确定要关闭工作台吗？")) {
			/*window.opener = null;
			window.open('', '_self');
			window.close();*/
			open(location, '_self').close();
		} else {}
	});
	
	
	
	
	$("#sf-menu").on("click",function(){
		$(this).addClass("sf-list-menu-active");
		$("#chart-menu").removeClass("chart-list-menu-active");
		$("#chart-list-box").stop(true,false).slideUp();	
		$("#sf-list-box").stop(true,false).slideDown();	
		
	});
	
	$("#chart-menu").on("click",function(){
		$(this).addClass("chart-list-menu-active");
		$("#sf-menu").removeClass("sf-list-menu-active");
		$("#sf-list-box").stop(true,false).slideUp();	
		$("#chart-list-box").stop(true,false).slideDown();
	});
	
	$(document)  
	  .on('show.bs.modal', '.modal', function(event) {
		$(this).appendTo($('body'));
	  })
	  .on('shown.bs.modal', '.modal.in', function(event) {
		setModalsAndBackdropsOrder();
	  })
	  .on('hidden.bs.modal', '.modal', function(event) {
		setModalsAndBackdropsOrder();
		if ($('.modal.in').length == 0) {
		  $('body').removeClass('modal-open');
		}
	  });
	
	function setModalsAndBackdropsOrder() {  
	  $('body').addClass('modal-open');
	  var modalZIndex = $('.modal.in').length + 1050 + 1;
	  var backdropZIndex = modalZIndex - 1;
	  $('.modal-backdrop').addClass('hidden');
	  $('.modal.in:last').css('z-index', modalZIndex);
	  $('.modal-backdrop.in:last').css('z-index', backdropZIndex).removeClass('hidden');
	}
	
	$(function(){
		
		eventHandler.checkDataSourse();
		eventHandler.createDatabase();
		$("[data-toggle='tooltip']").tooltip();		
		$("html").on("click",function(){
			if($("#msg-box").css("top")=='0px'){
				$("#msg-box").animate({top:"-50%"});
			}
		});
		$("#msg-box").on("click",function(){
			$(this).animate({top:"-50%"});
		});
		
		//容器
		instance = jsPlumb.getInstance({
			Endpoint : ["Dot", {radius:2}],
			ConnectionOverlays : [
				[ "Arrow", {location: 1, id:"arrow", length:10, foldback:0.8, width: 10} ],
			],
			DragOptions : { zIndex:2000 },
			Container:"mainData"
		});
		window.jsp = instance;
		
		
		
		//连接线
		instance.bind("connectionDragStop", function(info) {
			info.bind('click',function(){
					clickHandler.detachLine(info);
			});
			if(info.sourceId.indexOf("sf")>=0){
				instance.detach(info); 
			}else if(info.sourceId.indexOf("chart")>=0){
				instance.detach(info); 
			}else if(info.targetId.indexOf("table")>=0){
				instance.detach(info);
			}else if(info.sourceId == info.targetId){
				alert('不能以自己作为目标元素');
				instance.detach(info);  
			}else if($("#"+info.targetId).attr("data-sourse")==info.sourceId){
				instance.detach(info); 
			}else{
				if(info.targetId.indexOf("chart")>=0&&$("#"+info.targetId).attr("data-sourse")){
					instance.detach(info); 
				}else{
					$("#"+info.targetId).attr("data-sourse",info.sourceId);
					$("#Modal_"+info.targetId).attr("data-sourse",info.sourceId);
					$("#Modal_"+info.targetId).attr("input-table",$("#"+info.sourceId).attr("data-id"));
					/*if(info.targetId.indexOf("sf")>=0){
						$("#Modal_"+info.targetId).find(".default-chart").css("display","block");
						$("#Modal_"+info.targetId).find(".chart-img").css("display","none");
					}else if(info.targetId.indexOf("chart")>=0){
						$("#Modal_"+info.targetId).find(".default-chart").css("display","block");
						$("#Modal_"+info.targetId).find(".chart-img").css("display","none");
					}*/
				}
				
			}
			
			
			/*if($.inArray(info.sourceId, sourceList)>=0){
				//console.log(sourceList);
				
			}else if(info.targetId.toString().indexOf('undefined_')>=0){
				sourceList.push(info.sourceId);
			}*/
			
		});
	
		//拖动创建元素
		menu.find('.drag-items').draggable(
		{
			start: function(event,ui) {
				$(".database-list").css("overflow","visible");
			},
			stop:function(event,ui){
				$(".database-list").css("overflow-y","auto");
				$(".database-list").css("overflow-x","visible");
			},
			helper: 'clone',
			scope: 'button'
		});
		topMenu.find('.drag-items').draggable({
			helper: 'clone',
			scope: 'button'
		});
		
		buttoncontent.droppable({
			scope: 'button',
			drop: function(event, ui){
				//获取基本元素与参数
				var $this = $(this),
					dragui = ui.draggable,
					fatop = parseInt($this.offset().top),
					faleft = parseInt($this.offset().left),
					uitop = parseInt(ui.offset.top),
					uileft = parseInt(ui.offset.left),
					spantxt = dragui.text(),
					uid = dragui.attr('data-type'),
					alluid = buttoncontent.children('div.' + uid);
				
				//ID计算
				var allicon = alluid.length,
					idnum = 0,
					idArr  = new Array;
				alluid.each(function(i) {
					idArr.push(parseInt($(this).attr('id').split('_')[1]));
				});
				idArr.sort(function(a,b){return a>b?1:-1});
				for(i = 0; i < allicon; i++){
				   var idArrOne = parseInt(idArr[i]);
					if(i != idArrOne){
						idnum = idArrOne - 1;
						break;
					}else{
						idnum = allicon;
					} 
				}
				
				//插入元素组织
				var newstyle = 'left:' + (uileft - faleft) + 'px;top:' + (uitop - fatop) + 'px',
					//newid = uid + '_' + idnum,
					newid = uid + '_' + new_uid,
					
					str = "";

					new_uid++;
				
				if(uid=="chart"){
					str = $('<div class="elebox '+uid+'" id='+newid+' style='+newstyle+'><span>'+spantxt+'<b class="glyphicon glyphicon-remove delete-ele"></b><div class="cz-box"><i class="fa fa-play-circle item-edit click-item" data-id='+newid+'></i><div></span></div>');
					str.addClass("glyphicon");
					str.addClass("glyphicon-stats");
					str.addClass("chart-ele");
				}else if(uid=="sf"){
					str = $('<div class="elebox '+uid+'" id='+newid+' style='+newstyle+'><span>'+spantxt+'<b class="glyphicon glyphicon-remove delete-ele"></b><div class="cz-box"><i class="fa fa-play-circle item-edit click-item" data-id='+newid+'></i><div></span></div>');
					str.addClass("glyphicon");
					str.addClass("glyphicon-random");
					str.addClass("sf-ele");
				}else if(uid=="table"){
					str = $('<div class="elebox '+uid+'" id='+newid+' style='+newstyle+'><span><i class="fa fa-anchor dragPoint item-dragPoint" ></i>'+spantxt+'<b class="glyphicon glyphicon-remove delete-ele"></b><div class="cz-box"><i class="fa fa-edit item-edit click-item" data-id='+newid+'></i><div></span></div>');
					str.addClass("fa");
					str.addClass("fa-table");
					str.addClass("db-ele");
				}
				
				/*新增弹出窗*/
				var tpl = $($('#'+uid+'Modal-tpl').html());
				tpl.attr("id","Modal_"+newid);
				tpl.attr("target-master",newid);
				tpl.attr("type-stopAsix",20);
				
				
				
				if(uid=="chart"){
					chartType = dragui.attr("chart-type");
					tpl.attr("chart-type",chartType);
					str.attr("chart-type",chartType);
					tpl.find(".chart-img").css("display","none");
					tpl.find("."+chartType).css("display","block");
					tpl.find(".run-name").val(project_name+"_"+newid+"_"+Math.floor(Math.random()*24));
					if(chartType=="pie"){
						tpl.find(".x-title").html("标签");
						tpl.find(".y-title").html("数值");
						tpl.find(".tips").html("*”数值“只能选择数值型字段，其他类型会导致图表无法生成");
					}else{
						tpl.find(".x-title").html("x轴");
						tpl.find(".y-title").html("y轴");
						tpl.find(".tips").html("*y轴只能选择数值型字段，其他类型会导致图表无法生成");
					}
				}
				if(uid=="table"){
					targetId=dragui.attr('for');
					tpl.attr("data-id",targetId);
					str.attr("data-id",targetId);
					tpl.find(".sql-editor").val("select * from "+spantxt);
				}
				if(uid=="sf"){
					sfType=dragui.attr('sf-type');
					tpl.attr("sf-type",sfType);
					str.attr("sf-type",sfType);
					tpl.find(".run-name").val(project_name+"_"+newid+"_"+Math.floor(Math.random()*24));
				}
				
				
				$("body").append(tpl);
				
				$this.append(str);
				renderConnect(newid);
				$("#" + newid).draggable({ containment: "parent" });
				
				
				/*表格模板*/
				if(uid=="table"){
					eventManager.addTableItem($('#Modal_'+newid));
					clickHandler.tableglHandler("Modal_"+newid);
				}else if(uid=="sf"){
					ajaxHandler.buildSftAjax("Modal_"+newid)
					ajaxHandler.buildSFCharttAjax("Modal_"+newid);	
					clickHandler.dwData("Modal_"+newid);
				}else if(uid=="chart"){
					ajaxHandler.buildChartAjax("Modal_"+newid);
				}
				eventManager.eleboxClickHandler();
				eventManager.eleClick();
				eventManager.glTypeHandler();
				eventManager.tabChangeHandler("Modal_"+newid);
				clickHandler.saveChartToService("Modal_"+newid);
				clickHandler.deleteEle();
				
				$("#Modal_"+newid).find(".sf-chart").on("click",function(){
					$("#Modal_"+newid).find(".SFSc-btn").trigger("click");
				})
				
			}
		});
		
		$("[data-toggle='tooltip']").tooltip();
		
		var clickone = 0;
		
		$(".db-list").off("click");
		$(".db-list").on("click",function(){
			var target = $(this).find(".db-list-icon");
			if($("#db-box").css("display")=="none"){
				if(target.hasClass("fa-plus-square")){
					target.removeClass("fa-plus-square");
					target.addClass("fa-minus-square");
				}
			}else{
				if(target.hasClass("fa-minus-square")){
					target.removeClass("fa-minus-square");
					target.addClass("fa-plus-square");
				}
			}
			if(clickone==1){
				target.removeClass("fa-minus-square");
				target.addClass("fa-plus-square");
			}
			clickone = clickone+1;
		})
		$("#menu").find("li").on("click",function(){
			event.stopPropagation();
		});
		
		
		eventManager.save_wf();
		//加载内容
		ajaxHandler.loadWork();
		//test
		/*$.getJSON("../data.json",function(respone){
			eventManager.editDataTest(respone);
		});*/
		//end test
		
		
	});
	
	//渲染新元素
	function renderConnect(newid){
		instance.draggable(newid);
		instance.doWhileSuspended(function(){
			var isFilterSupported = instance.isDragFilterSupported();
			if(isFilterSupported){
				instance.makeSource(newid, {filter:".dragPoint",anchor:"Continuous"}, pstyle);
			}else{
				var eps = jsPlumb.getSelector(".dragPoint");
				for (var i = 0; i < eps.length; i++) {
					var e = eps[i], p = e.parentNode;
					instance.makeSource(e, {parent:p, anchor:"Continuous"}, pstyle);
				}
			}
		});
		instance.makeTarget(newid, {dropOptions:{hoverClass:"dragHover"}, anchor:"Continuous"}, pstyle);
	}
	
	
	
	var clickHandler = {
		//保存图片
		saveChartToService:function(target){
			$("#"+target).find(".chartBc-btn").on("click",function(){
				var fileName = $("#"+target).find(".chartDw-btn").attr("download");
				if(fileName!=null){
					$("#"+target).modal("hide");
					$("#saveChartModal").modal("show");
					$("#saveChartModal").find(".save-chart").off("click");
					$("#saveChartModal").find(".save-chart").on("click",function(){
						var new_name = $("#new-chart-name").val();
						if(new_name!=null){
							$("#spin").css("display","block");
							$("#spin").css("height",$("#wrapper").height());
							$.ajax({
								url:"/workbench/material/save",
								type:"POST",
								data:{
									title:new_name,
									file_name:fileName
								},
								timeout:30000,
								error: function(){
									$("#msg-content").html("连接服务器失败，请联系管理员");
									$("#msg-box").animate({top:"0"});
								},
								success: function(data){
									var dataJson = JSON.parse(data);
									if(dataJson.error_code==0){
										$("#new-chart-name").val("");
										$('.success-heading').html("保存成功！！");
										$('#success-box').animate({top:'0'});
										setTimeout("$('#success-box').animate({top:'-50%'})",3000);
										$("#saveChartModal").modal("hide");
										$("#"+target).modal("show");
									}else{
										$("#msg-content").html(dataJson.error_messge);
										$("#msg-box").animate({top:"0"});
									}
								}
							});	
							setTimeout('$("#spin").css("display","none")',0);		
						}
					});
				}else{
					$("#msg-content").html("请先生成图表");
					$("#msg-box").animate({top:"0"});
				}
			})
		},
		//下载图表
		Saveas:function(target,name){
			 $("#"+target).find(".chartDw-btn").on("click",function(){
				 var href = $(this).attr("href");
				 var a = window.open(href);
				 a.document.execCommand('Saveas',true,name);
				 a.window.close();
				 return false;
			 })
		},
		//下载数据
		dwData:function(target){
			$("#"+target).find(".SFXz-btn").on("click",function(){
				
				var file_data = $("#"+target).find(".data-area").val();
				if(file_data!=""){
					$("#spin").css("display","block");
					$("#spin").css("height",$("#wrapper").height());
					$.ajax({
						url:"/workbench/algorithm/data_download",
						type:"POST",
						data:{
							data:file_data
						},
						timeout:30000,
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(request){
							var dataJson = JSON.parse(request);
							if(dataJson.error_code==0){
								
								var w = window.open(dataJson.download_url,"_top");
								/*$('.success-heading').html("！！");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);*/
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});	
					setTimeout('$("#spin").css("display","none")',1000);	
				}
			})
		},
		//删除元素
		deleteEle:function(){
			$(".delete-ele").off("click");
			$(".delete-ele").on("click",function(){
				var targetId = $(this).parent().parent().attr("id");
				$("#deleteEleModal").modal("show");
				$(".deleteEleBtn").off("click");
				$(".deleteEleBtn").on("click",function(){
					$.each(instance.getConnections(),function(index, value) {
						console.log(value.sourceId);
						console.log(value.targetId);
						if(value.sourceId==targetId){
							$("#"+value.targetId).removeAttr("data-sourse");
							$("#Modal_"+value.targetId).removeAttr("data-sourse");
							$("#Modal_"+value.targetId).removeAttr("input-table");
							$("#Modal_"+value.targetId).find(".chartDw-btn").removeAttr("href");
							$("#Modal_"+value.targetId).find(".chartDw-btn").removeAttr("download");
						}
						
					}); 
					
					
					
					instance.removeAllEndpoints(targetId);
					instance.remove(targetId);
					
					
					//$("#"+info.targetId).attr("data-sourse")
					$("#Modal_"+targetId).remove();
					
					
					//$("#"+targetId).remove();
					$("#deleteEleModal").modal("hide");
				});
			});
		},
		
		//删除链接线
		detachLine:function(info){//删除连接
			$("#deleteModal").modal("show");
			$(".deleteBtn").off("click");
			$(".deleteBtn").on("click",function(){
				instance.detach(info);
				$("#"+info.targetId).removeAttr("data-sourse");
				$("#Modal_"+info.targetId).removeAttr("data-sourse");
				$("#Modal_"+info.targetId).removeAttr("input-table");
				
				/*if(info.targetId.indexOf("sf")>=0){
					$("#Modal_"+info.targetId).find(".default-chart").css("display","block");
					$("#Modal_"+info.targetId).find(".chart-img").css("display","none");
				}else if(info.targetId.indexOf("chart")>=0){
					$("#Modal_"+info.targetId).find(".default-chart").css("display","block");
					$("#Modal_"+info.targetId).find(".chart-img").css("display","none");
				}*/

				$("#deleteModal").modal("hide");
				
				
			});
        },
		
		/*数据表过滤事件*/
		//type 0:条件模式
		//type 1:sql模式
		tableglHandler:function(target){
			$("#"+target).find(".gl-submit").off("click");	
			$("#"+target).find(".gl-submit").on("click",function(){
				$(this).css("display","none");
				setTimeout('$(".gl-submit").css("display","inline-block")',1000);	
				
				$("#"+target).find(".gl-result").css("display","inline-block");
				$(this).parent().parent().find(".menu-row").each(function(index, element) {
                   	 if($(element).hasClass("select")){
							if($(element).attr("data-type")=="tj-content"){
								var requestStr = "[";
								$(this).parent().parent().find(".tj-row").each(function(idx, ele) {
									var colStr = "{";
										colStr += '"colName":"'+$(ele).find(".item-name").html()+'",';
										colStr += '"coltype":"'+$(ele).find(".gl-type").val()+'",';
										colStr += '"colval1":"'+$(ele).find(".start-value").val()+'"';
									if($(ele).find(".gl-type").val()==1){
										colStr += ',"colval2":"'+$(ele).find(".end-value").val()+'"';
									}
									
									colStr+="}";
									requestStr+= colStr+","
                                });
								var type = 0;
								requestStr = requestStr.substring(0,requestStr.length-1)+"]";
								
								console.log(requestStr);
								ajaxHandler.showtableAjax(target,type,requestStr);
							}else if($(element).attr("data-type")=="sql-content"){
								var sqlStr = $(this).parent().parent().find(".sql-editor").val();
								console.log(sqlStr);
								var type = 1;
								
								ajaxHandler.showtableAjax(target,type,sqlStr);
							}
					 }
                });
			});	
		}
	}
	
	var ajaxHandler = {
		/*请求加载项目*/
		loadWork:function(){
			var work_name = $("#project-name").html();
			$("#spin").css("display","block");
			$("#spin").css("height",$("#wrapper").height());
			$.ajax({
				url:"/workbench/user_bi/project/"+work_name+"/layout_get",
				type:"GET",
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						if(dataJson.layout!=""){
							eventManager.editData(dataJson.layout);	
							$('.success-heading').html("加载项目成功！！");
							$('#success-box').animate({top:'0'});
							setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						}else{
							$("#workbenchTipsModal").modal("show");
						}
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	
			setTimeout('$("#spin").css("display","none")',0);	
		},
		
		
		/*过滤结果*/
		showtableAjax:function(target,request_type,request){
			
			if(request==""){
				$("#msg-content").html("请输入sql语句");
				$("#msg-box").animate({top:"0"});
				return;
			}
			$("#spin").css("display","block");
			$("#spin").css("height",$("#wrapper").height());
			
			var tableName = $("#"+$("#"+$("#"+target).attr("target-master")).attr("data-id")).parent().find(".drag-items").attr("data-name");
			var db_alias = $("#"+$("#"+$("#"+target).attr("target-master")).attr("data-id")).parent().parent().parent().find(".database-name").attr("data-alias");

			//test
			/*var datatest = '{"data_list":[["日期1","设2备","新增2账户","新增3设备"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"],["2015-01-01","11","0","21"],["2012-01-01","11","10","21"],["2018-01-01","1","0","2"]],"error_code":0,"error_messge":""}';
			
			$("#"+target).find(".gl-default").css("display","none");
			$("#"+target).find(".gl-main").css("display","block");
			
			$("#"+target).find(".data-tbody").html("");
			$("#"+target).find(".table-title").html("");
			
			var colStr = [];
			JSON.parse(datatest).data_list.forEach(function(ele,idx){
				if(idx==0){
					ele.forEach(function(item,i){
						var td_tpl = '<th>'+item+'</th>'
						$("#"+target).find(".table-title").append(td_tpl);
						colStr.push(item);
					});
				}else{
					var tpl = $('<tr class=" gradeA"></tr>');
					ele.forEach(function(item,i){
						var td_tpl = '<td>'+item+'</td>'
						tpl.append(td_tpl);
					});
					if(idx%2==0){
						tpl.addClass("odd");
					}else{
						tpl.addClass("even");
					}
					//操作列
					//tpl.append('<td><i class="fa fa-trash-o db-remove" data-uuid="'+ele[0]+'"></i></td>');
					$("#"+target).find(".data-tbody").append(tpl);
				}
			});
			$("#"+$("#"+target).attr("target-master")).attr("data-col",colStr);
			$("#"+$("#"+target).attr("target-master")).attr("data-sourse",JSON.stringify(JSON.parse(datatest).data_list));
			var property="";
			if(request_type==0){
				property = '{"type":'+request_type+',"request":'+request+'}';
			}else{
				property = '{"type":'+request_type+',"request":"'+request+'"}';
			}
			$("#"+$("#"+target).attr("target-master")).attr("data-properties",property);
			
			
			var show_content = "table-content";
			$("#"+target).find(".tab-item").css("display","none");
			$("#"+target).find("."+show_content).css("display","block");	
	
			$("#"+target).find(".menu-row").removeClass("select");
			$("#"+target).find(".gl-result").addClass("select");
			var left=$("#"+target).find(".gl-result").position().left;
			$("#"+target).find(".back").css("left",left);
			$("#"+target).attr("type-stopAsix",left);*/
			
			//end test
			var buttonName = "开始过滤";
			var addition = "";
			logupLoad(buttonName,addition);
			
			$.ajax({
				url:"/workbench/user_bi/task/query",
				type:"POST",
				data:{
					ds_alias:db_alias,
					table_name:tableName,
					request_type:request_type,
					sql:request
				},
				timeout:30000,
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						//table嵌入
						$("#"+target).find(".gl-default").css("display","none");
						$("#"+target).find(".gl-main").css("display","block");
						
						$("#"+target).find(".data-tbody").html("");
						$("#"+target).find(".table-title").html("");
						
						var colStr = [];
						
						dataJson.data_list.forEach(function(ele,idx){
							if(idx==0){
								ele.forEach(function(item,i){
									var td_tpl = '<th>'+item+'</th>'
									$("#"+target).find(".table-title").append(td_tpl);
									colStr.push(item);
								});
							}else{
								var tpl = $('<tr class=" gradeA"></tr>');
								ele.forEach(function(item,i){
									var td_tpl = '<td>'+item+'</td>'
									tpl.append(td_tpl);
								});
								if(idx%2==0){
									tpl.addClass("odd");
								}else{
									tpl.addClass("even");
								}
								//操作列
								//tpl.append('<td><i class="fa fa-trash-o db-remove" data-uuid="'+ele[0]+'"></i></td>');
								$("#"+target).find(".data-tbody").append(tpl);
							}
						});
						$("#"+$("#"+target).attr("target-master")).attr("data-col",colStr);
						//data_list --> uuid
						$("#"+$("#"+target).attr("target-master")).attr("data-sourse",JSON.stringify(dataJson.data_list));
						var property="";
						if(request_type==0){
							property = '{"type":'+request_type+',"request":'+request+'}';
						}else{
							property = '{"type":'+request_type+',"request":"'+request+'"}';
						}

						$("#"+$("#"+target).attr("target-master")).attr("data-properties",property);
						
						$('.success-heading').html("过滤完成！！");
						$('#success-box').animate({top:'0'});
						setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						
						var show_content = "table-content";
						$("#"+target).find(".tab-item").css("display","none");
						$("#"+target).find("."+show_content).css("display","block");	
				
						$("#"+target).find(".menu-row").removeClass("select");
						$("#"+target).find(".gl-result").addClass("select");
						var left=$("#"+target).find(".gl-result").position().left;
						$("#"+target).find(".back").css("left",left);
						$("#"+target).attr("type-stopAsix",left);

					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});
			setTimeout('$("#spin").css("display","none")',0);
		},
		
		/*算法计算请求*/
		buildSftAjax:function(target){
			$("#"+target).find(".SFJs-btn").off("click");
			$("#"+target).find(".SFJs-btn").on("click",function(){
				
				$("#spin").css("display","block");
				$("#spin").css("height",$("#wrapper").height());
				//var chartType = target.attr("chart-type");
				
				
				
				var missionName = $("#"+target).find(".run-name").val();
				var sfType = $("#"+target).attr("sf-type");
				var T1Value = $("#"+target).find(".t1-value").val();
				var T2Value = $("#"+target).find(".t2-value").val();
				var nClusters = $("#"+target).find(".n-clusters").val();

				//数据源别名
				var ds_alias = $("#"+target).attr("input-table").split("_")[0];
				//var data_sourse = $("#"+$("#"+target).attr("data-sourse")).attr("data-sourse");
				
				//var data_sql = JSON.stringify(JSON.parse($("#"+$("#"+target).attr("data-sourse")).attr("data-properties")).request);
				var data_sql = JSON.parse($("#"+$("#"+target).attr("data-sourse")).attr("data-properties")).request;

				var buttonName = "算法任务"+"("+sfType+")";
				var addition = "";
				logupLoad(buttonName,addition);

				$.ajax({
					url:"/workbench/user_bi/task/algorithm/submit",
					type:"POST",
					timeout:30000,
					data:{
						project_name:project_name,
						name:missionName,
						algorithm_name:sfType,
						xAxis:T1Value,
						yAxis:T2Value,
						n_clusters:nClusters,
						ds_alias:ds_alias,
						sql:data_sql
						//data:data_sourse
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							//$("#"+target).find(".data-area").val(dataJson.data);
							$('.success-heading').html("任务开始运行，运行完后可以在“我的任务”里面查看！！");
							$('#success-box').animate({top:'0'});
							setTimeout("$('#success-box').animate({top:'-50%'})",3000);
							$("#"+target).modal("hide");
						}else{
							$("#msg-content").html(dataJson.error_messge);
							$("#msg-box").animate({top:"0"});
						}
					}
				});
				setTimeout('$("#spin").css("display","none")',0);
			});
		},
		
		/*算法生成图片请求*/
		buildSFCharttAjax:function(target){
			$("#"+target).find(".SFSc-btn").off("click");
			$("#"+target).find(".SFSc-btn").on("click",function(){
				$("#spin").css("display","block");
				$("#spin").css("height",$("#wrapper").height());
				
				var T1Value = $("#"+target).find(".t1-value").val();
				var T2Value = $("#"+target).find(".t2-value").val();
				var resultSet = $("#"+target).find(".data-area").val();
				var sfType = $("#"+target).attr("sf-type");
				
				if(resultSet==""){
					$("#msg-content").html("请先进行计算");
					$("#msg-box").animate({top:"0"});
				}else{
					$.ajax({
						url:"/workbench/algorithm_chart",
						type:"POST",
						timeout:30000,
						data:{
							name:sfType,
							data:resultSet
						},
						error: function(){
							$("#msg-content").html("连接服务器失败，请联系管理员");
							$("#msg-box").animate({top:"0"});
						},
						success: function(data){
							var dataJson = JSON.parse(data);
							if(dataJson.error_code==0){
								/*$("#"+target).find(".default-chart").css("display","none");
								$("#"+target).find(".chart-img").css("display","block");*/
								//"/static/chart/"+
								$("#"+target).find(".chart-img").attr("src",dataJson.chart_file);
								$("#"+target).find(".chartDw-btn").attr("href",dataJson.chart_file);
								$("#"+target).find(".chartDw-btn").attr("download",dataJson.chart_name);
								
								$('.success-heading').html("图表生成成功！！");
								$('#success-box').animate({top:'0'});
								setTimeout("$('#success-box').animate({top:'-50%'})",3000);
								
								var show_content = "sfChart-content";
								$("#"+target).find(".tab-item").css("display","none");
								$("#"+target).find("."+show_content).css("display","block");	
						
								$("#"+target).find(".menu-row").removeClass("select");
								$("#"+target).find(".gl-result").addClass("select");
								var left=$("#"+target).find(".sf-chart").position().left;
								$("#"+target).find(".back").css("left",left);
								$("#"+target).attr("type-stopAsix",left);
							}else{
								$("#msg-content").html(dataJson.error_messge);
								$("#msg-box").animate({top:"0"});
							}
						}
					});
				}//end else
				setTimeout('$("#spin").css("display","none")',0);
			});
		},
		
		/*图表生成请求*/
		buildChartAjax:function(target){
			$("#"+target).find(".chartSc-btn").off("click");
			$("#"+target).find(".chartSc-btn").on("click",function(){
				$("#spin").css("display","block");
				$("#spin").css("height",$("#wrapper").height());
				var missionName = $("#"+target).find(".run-name").val();
				var chartType = $("#"+target).attr("chart-type");
				var xValue = $("#"+target).find(".x-value").val();
				var yValue = $("#"+target).find(".y-value").val();
				var data_sourse = $("#"+$("#"+target).attr("data-sourse")).attr("data-sourse");
				//数据源名称
				var ds_alias = $("#"+target).attr("input-table").split("_")[0];
				//var data_sql = JSON.stringify(JSON.parse($("#"+$("#"+target).attr("data-sourse")).attr("data-properties")).request);
				var data_sql = JSON.parse($("#"+$("#"+target).attr("data-sourse")).attr("data-properties")).request;
				
				var buttonName = "图表任务"+"("+chartType+")";
				var addition = "";
				logupLoad(buttonName,addition);
				
				//test
				/*$("#"+target).find(".chart-img").attr("src","../static/img/test.png");
				$("#"+target).find(".chartDw-btn").attr("href","../static/img/test.png");
				$("#"+target).find(".chartDw-btn").attr("download","test.png");
				$('.success-heading').html("图表生成成功！！");
				$('#success-box').animate({top:'0'});
				setTimeout("$('#success-box').animate({top:'-50%'})",3000);				
				clickHandler.Saveas(target,"test.png");*/
				//end test
				
				$.ajax({
					url:"/workbench/user_bi/task/chart/submit",
					type:"POST",
					timeout:30000,
					data:{
						project_name:project_name,
						name:missionName,
						chart_type:chartType,
						xAxis:xValue,
						yAxis:yValue,
						sql:data_sql,
						ds_alias:ds_alias
						//data_table:data_sourse
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							/*$("#"+target).find(".default-chart").css("display","none");
							$("#"+target).find(".chart-img").css("display","block");
							$("#"+target).find(".chart-img").attr("src",dataJson.chart_file);
							$("#"+target).find(".chartDw-btn").attr("href",dataJson.chart_file);
							$("#"+target).find(".chartDw-btn").attr("download",dataJson.chart_name);*/
							$('.success-heading').html("任务开始运行，运行完后可以在“我的任务”里面查看！！");
							$('#success-box').animate({top:'0'});
							setTimeout("$('#success-box').animate({top:'-50%'})",3000);
							$("#"+target).modal("hide");
						}else{
							$("#msg-content").html(dataJson.error_messge);
							$("#msg-box").animate({top:"0"});
						}
					}
				});
				
				setTimeout('$("#spin").css("display","none")',0);
			});
		}
	}
	
	
	var eventManager = {
		
		//解析项目UI test
		editDataTest:function(response){
			//response =eval("("+response+")");
			workUI = response;
			
			new_uid = parseInt(response.totalNum)+1;
			debugger;
			var list = eval(response.customline),
				blocks = eval(response.customWidgets),
				htmlText = "",
				conn = ""
			$("#mainData").html('');
			//------------插入元素-------------
			for( var i in blocks){
				if(blocks[i].BlockX!=undefined){
					var viewstyle = 'left:'+blocks[i].BlockX+'px;top:'+blocks[i].BlockY+'px;',
					viewid = blocks[i].BlockId,
					viewClass = blocks[i].BlockClass,
					viewChartType = blocks[i].BlockChartType,
					viewDataID = blocks[i].BlockDataID,
					viewProperties = blocks[i].BlockProperties,
					viewhtml = blocks[i].BlockHtml;
					viewDataSourse = blocks[i].BlockDataSourse,
					viewDataCol = blocks[i].BlockdataCol,
					viewSFType = blocks[i].BlockSFType;
	
					htmlText = $('<div class="elebox '+viewClass+'" id="'+viewid+'"  style="'+viewstyle+'">'+viewhtml+'</div>');
					
					/*新增弹出窗*/
					var tpl = $($('#'+viewClass+'Modal-tpl').html());
					tpl.attr("id","Modal_"+viewid);
					tpl.attr("target-master",viewid);
					tpl.attr("type-stopAsix",20);
					
					if(viewClass=="chart"){
						htmlText.addClass("glyphicon");
						htmlText.addClass("glyphicon-stats");
						htmlText.addClass("chart-ele");
						tpl.find(".chart-img").css("display","none");
						tpl.find("."+viewChartType).css("display","block");
						tpl.find(".run-name").val(project_name+"_"+viewid+"_"+Math.floor(Math.random()*24));
					}else if(viewClass=="sf"){
						
						htmlText.addClass("glyphicon");
						htmlText.addClass("glyphicon-random");
						htmlText.addClass("sf-ele");
					}else if(viewClass=="table"){
						htmlText.addClass("fa");
						htmlText.addClass("fa-table");
						htmlText.addClass("db-ele");
						tpl.find(".run-name").val(project_name+"_"+viewid+"_"+Math.floor(Math.random()*24));
					}
					
					
					if(viewDataSourse!=null){
						htmlText.attr("data-sourse",viewDataSourse);
					}
					if(viewDataCol!=null){
						htmlText.attr("data-col",viewDataCol);
					}
					
					if(viewProperties!=null){
						htmlText.attr("data-properties",viewProperties);
						var properties = JSON.parse(viewProperties.replace(/'/g,"\""));
						if(properties.type==1){
							tpl.find(".sql-editor").val(properties.request);
						}
					}
					
					if(viewClass=="chart"){
						if(viewChartType!=null){
							tpl.attr("chart-type",viewChartType);
							htmlText.attr("chart-type",viewChartType);
						}
					}
					if(viewClass=="table"){
						if(viewDataID!=null){
							tpl.attr("data-id",viewDataID);
							htmlText.attr("data-id",viewDataID);
						}
					}
					if(viewClass=="sf"){
						if(viewSFType!=null){
							tpl.attr("sf-type",viewSFType);
							htmlText.attr("sf-type",viewSFType);
						}
					}
					
					
					$("#mainData").append(htmlText);
					$("body").append(tpl);
					renderConnect(viewid);
					$("#" + viewid).draggable({ containment: "parent" });
					
					
					/*表格模板*/
					if(viewClass=="table"){
						eventManager.addTableItem($('#Modal_'+viewid));
						clickHandler.tableglHandler("Modal_"+viewid);
					}else if(viewClass=="sf"){
						ajaxHandler.buildSftAjax("Modal_"+viewid)
						ajaxHandler.buildSFCharttAjax("Modal_"+viewid);
						clickHandler.dwData("Modal_"+viewid);	
					}else if(viewClass=="chart"){
						ajaxHandler.buildChartAjax("Modal_"+viewid);
					}
					eventManager.eleboxClickHandler();
					eventManager.eleClick();
					eventManager.glTypeHandler();
					eventManager.tabChangeHandler("Modal_"+viewid);
					clickHandler.saveChartToService("Modal_"+viewid);
					clickHandler.deleteEle();
				}
				
			}
			
			//------------默认连接-------------
			var windowsDrag = jsPlumb.getSelector("#mainData .elebox");
			renderConnect(windowsDrag);
	
			//------------更改样式-------------
			for( var i in list){
				if(list[i].PageSourceId!=undefined){
					var conor = instance.connect({ source:list[i].PageSourceId, target:list[i].PageTargetId});
					$("#"+list[i].PageTargetId).attr("data-sourse",list[i].PageSourceId);
					$("#Modal_"+list[i].PageTargetId).attr("data-sourse",list[i].PageSourceId);
					$("#Modal_"+list[i].PageTargetId).attr("input-table",$("#"+list[i].PageSourceId).attr("data-id"));
					
					conor.bind('click',function(){
						clickHandler.detachLine(this);
					});
				}
					
			};
			$("div.elebox").draggable({ containment: "parent" });
		},
		//end test
		
		
		//解析项目UI
		editData:function(response){
			response =eval("("+response+")");
			workUI = response;
			new_uid = parseInt(response.totalNum)+1;
			
			var list = eval(response.customline),
				blocks = eval(response.customWidgets),
				htmlText = "",
				conn = ""
			$("#mainData").html('');
			//------------插入元素-------------
			for( var i in blocks){
				if(blocks[i].BlockX!=undefined){
					var viewstyle = 'left:'+blocks[i].BlockX+'px;top:'+blocks[i].BlockY+'px;',
					viewid = blocks[i].BlockId,
					viewClass = blocks[i].BlockClass,
					viewChartType = blocks[i].BlockChartType,
					viewDataID = blocks[i].BlockDataID,
					viewProperties = blocks[i].BlockProperties,
					viewhtml = blocks[i].BlockHtml;
					viewDataSourse = blocks[i].BlockDataSourse,
					viewDataCol = blocks[i].BlockdataCol,
					viewSFType = blocks[i].BlockSFType;
	
					htmlText = $('<div class="elebox '+viewClass+'" id="'+viewid+'"  style="'+viewstyle+'">'+viewhtml+'</div>');
					
					/*新增弹出窗*/
					var tpl = $($('#'+viewClass+'Modal-tpl').html());
					tpl.attr("id","Modal_"+viewid);
					tpl.attr("target-master",viewid);
					tpl.attr("type-stopAsix",20);
					
					if(viewClass=="chart"){
						htmlText.addClass("glyphicon");
						htmlText.addClass("glyphicon-stats");
						htmlText.addClass("chart-ele");
						tpl.find(".chart-img").css("display","none");
						tpl.find("."+viewChartType).css("display","block");
						tpl.find(".run-name").val(project_name+"_"+viewid+"_"+Math.floor(Math.random()*24));
					}else if(viewClass=="sf"){
						htmlText.addClass("glyphicon");
						htmlText.addClass("glyphicon-random");
						htmlText.addClass("sf-ele");
					}else if(viewClass=="table"){
						htmlText.addClass("fa");
						htmlText.addClass("fa-table");
						htmlText.addClass("db-ele");
						tpl.find(".sql-editor").val("select * from "+viewDataID.substring(viewDataID.indexOf("_")+1,viewDataID.length));
						tpl.find(".run-name").val(project_name+"_"+viewid+"_"+Math.floor(Math.random()*24));
					}
					
					
					if(viewDataSourse!=null){
						htmlText.attr("data-sourse",viewDataSourse);
					}
					if(viewDataCol!=null){
						htmlText.attr("data-col",viewDataCol);
					}
					
					if(viewProperties!=null){
						htmlText.attr("data-properties",viewProperties);
						var properties = JSON.parse(viewProperties.replace(/'/g,"\""));
						if(properties.type==1){
							tpl.find(".sql-editor").val(properties.request);
						}
					}
					
					if(viewClass=="chart"){
						if(viewChartType!=null){
							tpl.attr("chart-type",viewChartType);
							htmlText.attr("chart-type",viewChartType);
						}
					}
					if(viewClass=="table"){
						if(viewDataID!=null){
							tpl.attr("data-id",viewDataID);
							htmlText.attr("data-id",viewDataID);
						}
					}
					if(viewClass=="sf"){
						if(viewSFType!=null){
							tpl.attr("sf-type",viewSFType);
							htmlText.attr("sf-type",viewSFType);
						}
					}
					
					
					$("#mainData").append(htmlText);
					$("body").append(tpl);
					renderConnect(viewid);
					$("#" + viewid).draggable({ containment: "parent" });
					
					
					/*表格模板*/
					if(viewClass=="table"){
						eventManager.addTableItem($('#Modal_'+viewid));
						clickHandler.tableglHandler("Modal_"+viewid);
					}else if(viewClass=="sf"){
						ajaxHandler.buildSftAjax("Modal_"+viewid)
						ajaxHandler.buildSFCharttAjax("Modal_"+viewid);
						clickHandler.dwData("Modal_"+viewid);	
					}else if(viewClass=="chart"){
						ajaxHandler.buildChartAjax("Modal_"+viewid);
					}
					eventManager.eleboxClickHandler();
					eventManager.eleClick();
					eventManager.glTypeHandler();
					eventManager.tabChangeHandler("Modal_"+viewid);
					clickHandler.deleteEle();
					
					$("#Modal_"+viewid).find(".sf-chart").on("click",function(){
						$("#Modal_"+viewid).find(".SFSc-btn").trigger("click");
					})
					
				}
				
			}
			
			//------------默认连接-------------
			var windowsDrag = jsPlumb.getSelector("#mainData .elebox");
			renderConnect(windowsDrag);
	
			//------------更改样式-------------
			for( var i in list){
				if(list[i].PageSourceId!=undefined){
					var conor = instance.connect({ source:list[i].PageSourceId, target:list[i].PageTargetId});
					$("#"+list[i].PageTargetId).attr("data-sourse",list[i].PageSourceId);
					$("#Modal_"+list[i].PageTargetId).attr("data-sourse",list[i].PageSourceId);
					$("#Modal_"+list[i].PageTargetId).attr("input-table",$("#"+list[i].PageSourceId).attr("data-id"));
					
					conor.bind('click',function(){
						clickHandler.detachLine(this);
					});
				}
					
			};
			$("div.elebox").draggable({ containment: "parent" });
		},
		
		//项目存储
		save_wf:function (){
			$(".save-work").on("click",function(){
				var connects = [];
				$.each(instance.getAllConnections(), function (idx, connection) {
					connects.push({
						//lineColor: connection.getPaintStyle('label').fillStyle,
						//connectionLabel : connection.getOverlay('label').label,
						PageSourceId: connection.sourceId,
						PageTargetId: connection.targetId
					});
				});
				
				var buttonName = "保存项目";
				var addition = "";
				logupLoad(buttonName,addition);
				
				var blocks = [];
				$("#mainData .elebox").each(function (idx, elem) {
					var $elem = $(elem);
					
					blocks.push({
							BlockId: $elem.attr('id'),
							BlockClass: $elem.attr('class').split(' ')[1],
							BlockChartType: $elem.attr('chart-type'),
							BlockHtml: $elem.html(),
							BlockDataID:$elem.attr('data-id'),
							BlockProperties:$elem.attr('data-properties'),
							BlockX: parseInt($elem.css("left")),
							BlockY: parseInt($elem.css("top")),
							//BlockDataSourse:$elem.attr('data-sourse'),
							//BlockdataCol:$elem.attr('data-col'),
							BlockSFType:$elem.attr('sf-type')
					});
				});
				serliza = '{"totalNum":'+new_uid+',"customline":'+JSON.stringify(connects) + ',"customWidgets":' + JSON.stringify(blocks).replace(/\\"/g,"'")+"}";
				//workflowStr = workflowStr.substring(0,workflowStr.length-2)+serliza+"}]";
				console.log(serliza);
				
				var work_name = $("#project-name").html();
				
				$.ajax({
					url:"/workbench/user_bi/project/layout_save",
					type:"POST",
					timeout:30000,
					data:{
						project_name:work_name,
						layout:serliza
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							$('.success-heading').html("保存项目成功！！");
							$('#success-box').animate({top:'0'});
							setTimeout("$('#success-box').animate({top:'-50%'})",3000);
						}else{
							$("#msg-content").html(dataJson.error_messge);
							$("#msg-box").animate({top:"0"});
						}
					}
				});
				
				setTimeout('$("#spin").css("display","none")',0);
				
				
			})		
		},
		
		/*图表*/
		addChartData:function(target){
			var targetId = target.attr("data-sourse");
			target.find(".x-value").html("");
			target.find(".y-value").html("");
			if($("#"+targetId).attr("data-col")){
				if($("#"+targetId).attr("data-col").indexOf(",")>=0){
					var colArr = $("#"+targetId).attr("data-col").split(",");
					for(var i=0;i<colArr.length;i++){
						var tpl = "";
						if(i==0){
							tpl = '<option selected value="'+i+'">'+colArr[i]+'</option>';
						}else{
							tpl = '<option value="'+i+'">'+colArr[i]+'</option>';
						}
						
						target.find(".x-value").append(tpl);
						target.find(".y-value").append(tpl);
					}
				}else{
					var tpl = '<option selected value="'+$("#"+targetId).attr("data-col")+'">'+$("#"+targetId).attr("data-col")+'</option>';
					target.find(".x-value").append(tpl);
					target.find(".y-value").append(tpl);
				}
				return  0;
			}else{
				return -1;
			}
			
		},
		/*canopy*/ 
		addCanopyData:function(target){
			var targetId = target.attr("data-sourse");
			target.find(".t1-value").html("");
			target.find(".t2-value").html("");
			if($("#"+targetId).attr("data-col")){
				if($("#"+targetId).attr("data-col").indexOf(",")>=0){
					var colArr = $("#"+targetId).attr("data-col").split(",");
					for(var i=0;i<colArr.length;i++){
						var tpl = '';
						if(i==0){
							tpl = '<option selected value="'+i+'">'+colArr[i]+'</option>'
						}else{
							tpl = '<option value="'+i+'">'+colArr[i]+'</option>'
						}
						target.find(".t1-value").append(tpl);
						target.find(".t2-value").append(tpl); 
					};
				}else{
					var tpl = '<option selected value="'+$("#"+targetId).attr("data-col")+'">'+$("#"+targetId).attr("data-col")+'</option>';
					target.find(".t1-value").append(tpl);
					target.find(".t2-value").append(tpl); 
				}
				return  0;
			}else{
				return  -1;
			}
			
		},
		/*添加表内容*/
		addTableItem:function(target){
			var targetId = target.attr("data-id");
			target.find(".tj-content").html("");
			$("#"+targetId).parent().find(".col-item").each(function(index, element) {		
				var tpl = $($("#tableModal").find(".tj-content").html());		
                tpl.find(".item-name").html($(element).attr("data-value"));
				target.find(".tj-content").append(tpl);
            });
		},
		/*tab切换*/
		tabChangeHandler:function(targetId){
			var add_stopWidth = "100px";
			var type_stopAsix = parseInt($("#"+targetId).attr("type-stopAsix"));

			$("#"+targetId).find(".menu-row").on("mouseenter",function(){  
				var left=$(this).position().left;
				$("#"+targetId).find(".back").stop(true,true).animate({left:left,width:"100px"}, "fast");  
			})
			$("#"+targetId).find(".menu-row").on("mouseleave",function(){
				$("#"+targetId).find(".back").stop(true,true).animate({left:parseInt($("#"+targetId).attr("type-stopAsix")),width:"100px"},"fast");  
			})  
			$("#"+targetId).find(".menu-row").on("click",function(){
				var target = $(this).attr("data-type");
				$("#"+targetId).find(".tab-item").css("display","none");
				$("#"+targetId).find("."+target).css("display","block");	
		
				$("#"+targetId).find(".menu-row").removeClass("select");
				$(this).addClass("select");
				var left=$(this).position().left;
				$("#"+targetId).find(".back").css("left",left);
				$("#"+targetId).attr("type-stopAsix",left); 
				
			});
		},
		/*双击事件*/
		eleboxClickHandler:function(){
			$(".elebox").off("dblclick");
			$(".elebox").on("dblclick",function(){
				var id = $(this).attr("id");
				if($('#Modal_'+id).attr("input-table")!=""&&$('#Modal_'+id).attr("input-table")){
					
					var status = -1;
					if(id.indexOf("sf")>=0){
						status = eventManager.addCanopyData($('#Modal_'+id));
					}else if(id.indexOf("chart")>=0){
						status = eventManager.addChartData($('#Modal_'+id));
					}
					if(status==0){
						$('#Modal_'+id).find(".default").css("display","none");
						$('#Modal_'+id).find(".main").css("display","block");
						
					}else{
						$('#Modal_'+id).find(".default").html(nogl);
					}
					
				}else{
					$('#Modal_'+id).find(".default").html(noDB);
					$('#Modal_'+id).find(".default").css("display","block");
					$('#Modal_'+id).find(".main").css("display","none");
				}
				
				
				$('#Modal_'+id).modal('show');
				
				/*if($(this).hasClass("table")){
					$('#Modal_'+id).modal('show');
				}else if($(this).hasClass("sf")){
					$('#sfModal').modal('show');
				}else if($(this).hasClass("chart")){
					$('#chartModal').modal('show');
				}*/
			});
		},
		
		//点击事件
		eleClick:function(){
			$(".click-item").off("click");
			$(".click-item").on("click",function(){
				var id = $(this).attr("data-id");
				if($('#Modal_'+id).attr("input-table")!=""&&$('#Modal_'+id).attr("input-table")){
					
					var status = -1;
					if(id.indexOf("sf")>=0){
						status = eventManager.addCanopyData($('#Modal_'+id));
					}else if(id.indexOf("chart")>=0){
						status = eventManager.addChartData($('#Modal_'+id));
					}
					if(status==0){
						$('#Modal_'+id).find(".default").css("display","none");
						$('#Modal_'+id).find(".main").css("display","block");
						
					}else{
						$('#Modal_'+id).find(".default").html(nogl);
					}
					
				}else{
					$('#Modal_'+id).find(".default").html(noDB);
					$('#Modal_'+id).find(".default").css("display","block");
					$('#Modal_'+id).find(".main").css("display","none");
				}
				
				
				$('#Modal_'+id).modal('show');
				
				/*if($(this).hasClass("table")){
					$('#Modal_'+id).modal('show');
				}else if($(this).hasClass("sf")){
					$('#sfModal').modal('show');
				}else if($(this).hasClass("chart")){
					$('#chartModal').modal('show');
				}*/
			});
		},
		
		/*过滤事件*/
		glTypeHandler:function(){
			$(".gl-type").off("change");
			$(".gl-type").on("change",function(){
				if($(this).val()==1){
					$(this).parent().find(".qj-box").css("display","inline-block");
				}else{
					$(this).parent().find(".qj-box").css("display","none");
				}
			})
		}
	
	}
	
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
	}
	
	
	
	
})()



