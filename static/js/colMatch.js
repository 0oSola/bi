// JavaScript Document
(function(){
	
	
	//test
	var saleJson = '{"col_list": [["id","int(11)","自增字段","",""],["province","varchar(30)","省份名称","",""],["month","int(11)","月份","",""],["amount","decimal(10,0)","销售额","",""]],"error_messge":"","error_code":0}';
	var salematch_Json = '{"match_list": [["id","自增字段"],["province","省份名称"],["month","月份"],["sales_amount","销售额"]],"error_messge":"","error_code":0}';
	
	var customerJson = '{"col_list": [["ID","int(11)","自增字段","",""],["NAME","varchar(10)","姓名","",""],["GENDER","int(11)","性别，0是女性，1是男性","",""],["AGE","int(11)","年龄","",""],["INCOME","int(11)","收入","",""]],"error_messge":"","error_code":0}';
	var customermatch_Json = '{"match_list": [["ID","自增字段"],["NAME","省份名称"],["GENDER","性别，0是女性，1是男性"],["AGE","年龄"],["INCOME","收入"]],"error_messge":"","error_code":0}';
		
	//end test
	
	var pageSize = 10;
	var ds_table = "";
	var db_alias = $("#table-list").attr("data-dsAlias");
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
		
		$(".closeColBtn").on("click",function(){
			var buttonName = "关闭智能匹配页面";
			addition = "";
			logupLoad(buttonName,addition);
			
			if (confirm("您确定要关此页面吗？")) {
				window.opener = null;
				window.open('', '_self');
				window.close();
			} else {}
		});
		
		eventHandler.tableClick();
		
		$(".table-item").each(function(index, element) {
            if(index==0){
				$(".table-item").removeClass("select");
				$(this).addClass("select");
				ds_table = $(this).attr("data-table");
				ajaxHandler.loadTableCol();
				return;
			}
        });
		
		$("[data-toggle='tooltip']").tooltip();	
	});
	
	var ajaxHandler = {
		
		//加载数据源字段
		loadTableCol:function(){
			$("#spin").css("display","block");
			$("#spin").css("height",$("body").height());	
			
			//test 
			var match_listJson = "";
			
			if(ds_table=="SALE"){
				match_listJson = saleJson;
			}else if(ds_table=="CUSTOMER"){
				match_listJson = customerJson;
			}
			
			dataJson = JSON.parse(match_listJson);
			eventHandler.viewtableCol(dataJson.col_list);
			ajaxHandler.matchCol();
			ajaxHandler.sumbitMatch();
			//end test
			
			/*$.ajax({
				url:"/workbench/user_bi/datasource/table",
				type:"POST",
				data:{
					db_alias:db_alias,
					db_table:ds_table
				},
				error: function(){
					$("#msg-content").html("连接服务器失败，请联系管理员");
					$("#msg-box").animate({top:"0"});
				},
				success: function(data){
					var dataJson = JSON.parse(data);
					if(dataJson.error_code==0){
						eventHandler.viewtableCol(dataJson.col_list);
						ajaxHandler.matchCol();
						ajaxHandler.sumbitMatch();
					}else{
						$("#msg-content").html(dataJson.error_messge);
						$("#msg-box").animate({top:"0"});
					}
				}
			});	*/
			setTimeout('$("#spin").css("display","none")',0);
		},
		//云端智能匹配
		matchCol:function(){
			$(".matchColBtn").off("click");
			$(".matchColBtn").on("click",function(){
				$("#spin").css("display","block");
				$("#spin").css("height",$("body").height());
				
				var buttonName = "智能匹配";
				addition = "进行智能匹配";
				logupLoad(buttonName,addition);
				
				//test
				//var testRunJson = '{"result_list": [["uuid","name","img","size","type"],["uuid","name","img","size","type"]],"totalCount":100,"error_messge":"","error_code":0}';
				var match_listJson = salematch_Json;
				
				if(ds_table=="SALE"){
					match_listJson = salematch_Json;
				}else if(ds_table=="CUSTOMER"){
					match_listJson = customermatch_Json;
				}
				
				var dataJson = JSON.parse(match_listJson);
				eventHandler.matchCol(dataJson.match_list);
				
				
				setTimeout('$("#spin").css("display","none")',1000);
				setTimeout("$('.success-heading').html('智能匹配成功！！')",1000);
				setTimeout("$('#success-box').animate({top:'0'})",1000);;
				setTimeout("$('#success-box').animate({top:'-50%'})",3000);
				
				//end test
							
				/*$.ajax({
					url:"/workbench/user_bi/datasource/table/field/match",
					type:"POST",
					data:{
						db_alias:db_alias,
						db_table:ds_table
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							$('.success-heading').html("智能匹配成功！！");
							$('#success-box').animate({top:'0'});
							eventHandler.matchCol(dataJson.match_list);
							setTimeout("$('#success-box').animate({top:'-50%'})",3000);
							
						}else{
							$("#msg-content").html(dataJson.error_messge);
							$("#msg-box").animate({top:"0"});
						}
					}
				});	
				setTimeout('$("#spin").css("display","none")',0);*/
			})
		},
		
		//提交匹配
		sumbitMatch:function(){
			$(".sumbitColBtn").off("click");
			$(".sumbitColBtn").on("click",function(){
				
				var buttonName = "保存智能匹配";
				addition = "保存智能匹配";
				logupLoad(buttonName,addition);
				
				var match_list = [];
				var check_num = 0;
				$(".check-col").each(function(index, element) {
                    var parent = $(element).parent().parent();
					
					if($(element).prop("checked")){
						var match = parent.find(".col-match").val();
						var match_desc = parent.find(".col-match-zusi").val();
						
						if(match!=""){
							var name = parent.find(".col-name").html();
							var arr = [];
							arr.push(name);
							arr.push(match);
							arr.push(match_desc);
							match_list.push(arr);
							
							
							//test
							if(ds_table=="SALE"){
								testjson = JSON.parse(saleJson);
								testjson.col_list[index][3] = match;
								testjson.col_list[index][4] = match_desc;
								console.log(testjson);
								saleJson = JSON.stringify(testjson);
							}else if(ds_table=="CUSTOMER"){
								testjson = JSON.parse(customerJson);
								testjson.col_list[index][3] = match;
								testjson.col_list[index][4] = match_desc;
								console.log(testjson);
								customerJson = JSON.stringify(testjson);
							}
							//end test
							check_num++;
						}
					}
                });
				if(check_num<=0){
					$("#msg-content").html("请至少填写一个标准字段并选中再提交");
					$("#msg-box").animate({top:"0"});
					return;
				}
				match_list = JSON.stringify(match_list);
				
				//test
				
				$("#spin").css("display","block");
				$("#spin").css("height",$("body").height());
				setTimeout('$("#spin").css("display","none")',1000);
				setTimeout("$('.success-heading').html('保存字段成功！！')",1000);
				setTimeout("$('#success-box').animate({top:'0'})",1000);;
				setTimeout("$('#success-box').animate({top:'-50%'})",3000);
				//end test
				
				/*$("#spin").css("display","block");
				$("#spin").css("height",$("body").height());
				$.ajax({
					url:"/workbench/user_bi/datasource/table/field/match/submit",
					type:"POST",
					data:{
						db_alias:db_alias,
						db_table:ds_table,
						match_list:match_list
					},
					error: function(){
						$("#msg-content").html("连接服务器失败，请联系管理员");
						$("#msg-box").animate({top:"0"});
					},
					success: function(data){
						var dataJson = JSON.parse(data);
						if(dataJson.error_code==0){
							$('.success-heading').html("保存字段成功！！");
							$('#success-box').animate({top:'0'});
							
						}else{
							$("#msg-content").html(dataJson.error_messge);
							$("#msg-box").animate({top:"0"});
						}
					}
				});	
				setTimeout('$("#spin").css("display","none")',0);*/
			})
		},
		
		
	}
	
	var eventHandler = {
		
		//全选事件
		allcheck:function(){
			$(".all-check").off("click");
			$(".all-check").on("click",function(){
				var buttonName = "全选/反选";
				addition = "字段";
				logupLoad(buttonName,addition);
				
				if($(".all-check").prop("checked")){
					$(".check-col").prop("checked",true);
				}else{
					$(".check-col").prop("checked",false);
				}
				
			});
			
		},
		//表点击事件
		tableClick:function(){
			$(".table-item").on("click",function(){
				
				var buttonName = "选择表";
				addition = "";
				logupLoad(buttonName,addition);
				$(".table-item").removeClass("select");
				$(this).addClass("select");
				ds_table = $(this).attr("data-table");
				ajaxHandler.loadTableCol();
			});
		},
		//智能匹配
		matchCol:function(match_list){
			$(".col-match").each(function(index, element) {
                $(this).val(match_list[index][0]);
            });
			$(".col-match-zusi").each(function(index, element) {
                $(this).val(match_list[index][1]);
            });
		},
		
		//显示表结构
		viewtableCol:function(data){
			var target = $("#col-table");
			target.find(".data-tbody").html("");

			data.forEach(function(ele,idx){

				var tpl = $('<tr class="col-row gradeA"></tr>');
				var td_tpl = "";
				td_tpl += '<td><input type="checkbox" class="check-col"></td>';
				
				//td_tpl += '<td class="result-img"><img style="width:100px;" src="../static/img/test.png"/></td>';
				td_tpl += '<td class="col-name">'+ele[0]+'</td>';
				td_tpl += '<td class="col-type">'+ele[1]+'</td>';
				td_tpl += '<td class="col-note">'+ele[2]+'</td>';
				td_tpl += '<td><input class="col-match" type="text" value="'+ele[3]+'"/></td>';
				td_tpl += '<td><input class="col-match-zusi" type="text" value="'+ele[4]+'"/></td>';
				
				tpl.append(td_tpl);
				
				
				
				if(idx%2==0){
					tpl.addClass("odd");
				}else{
					tpl.addClass("even");
				}
				$(".all-check").prop("checked",false);
				eventHandler.allcheck();
				target.find(".data-tbody").append(tpl);
			});
			
		}

		
	}
	
})();
