// JavaScript Document

var page = window.location.href;
var type = 0;
var addition = "";

//log日志
function logupLoad(buttonName,addition){
	if(type==0){
		buttonName = buttonName.replace(/\s+/g,'');
		addition = addition.replace(/\s+/g,'');
		$.ajax({
			url:"/workbench/action/log",
			type:"POST",
			data:{
				page:page,
				button:buttonName,
				addition:addition
			},
			success: function(data){
				
			}
		});	
	}
}


$(function(){
	
	$(".sure-logout").on("click",function(){
		var buttonName = "登出用户";
		addition = "确认登出";
		logupLoad(buttonName,addition);
	})
	
	$(".logout-box").on("click",function(){
		var buttonName = "登出用户";
		addition = "";
		logupLoad(buttonName,addition);
	})
	
	$(".close").on("click",function(){
		buttonName = $(this).parent().find(".modal-title").text().replace(/\s+/g,'');
		addition = "关闭"+buttonName;
		logupLoad(buttonName,addition);
	})
	
	$(".list-more").on("click",function(){
		var buttonName = "查看更多任务";
		addition = "";
		logupLoad(buttonName,addition);
	})
	
	$(".btn").on("click",function(){
		buttonName = $(this).parent().parent().find(".modal-title").text().replace(/\s+/g,'');
		addition = $(this).text().replace(/\s+/g,'')+buttonName;
		logupLoad(buttonName,addition);
	})
	
	
	$(".cz-item").on("click",function(){
		buttonName = $(this).text().replace(/\s+/g,'');
		addition = $(this).parent().parent().parent().parent().parent().parent().parent().find(".title").text().replace(/\s+/g,'');
		logupLoad(buttonName,addition);
	})
	
	$(".user-switch").on("click",function(){
		var buttonName = "用户切换";
		addition = "";
		logupLoad(buttonName,addition);
	})
	
	$(".close-work").on("click",function(){
		var buttonName = "关闭工作台";
		addition = "";
		logupLoad(buttonName,addition);
	});
	$(".close-report").on("click",function(){
		var buttonName = "关闭报表";
		addition = "";
		logupLoad(buttonName,addition);
	});
	$(".save-report").on("click",function(){
		var buttonName = "保存报表";
		addition = "";
		logupLoad(buttonName,addition);
	});
	
	$(".menu-button").on("click",function(){
		var buttonName = $(this).attr("data-original-title");
		addition = "";
		logupLoad(buttonName,addition);
	});
	
	$(".edit-box").on("dblclick",function(){
		var buttonName = "编辑报表";
		addition = "";
		logupLoad(buttonName,addition);
	});
	
	$(".menu-row").on("click",function(){
		var buttonName = $(this).text();
		addition = $(this).parent().parent().parent().find(".title").text();
		if(buttonName.indexOf("(")!=-1){
			buttonName = buttonName.substring(0,buttonName.indexOf("("));
		}
		
		logupLoad(buttonName,addition);
	})
	$("#create-report").on("click",function(){
		var buttonName = $(this).text();
		addition = "报表列表";
		logupLoad(buttonName,addition);
	})

	$(".shortcut-item").on("click",function(){
		var buttonName = $(this).text();
		addition = "BI用户";
		logupLoad(buttonName,addition);
	})

	$(".key-list").on("click",function(){
		var buttonName = $(this).text();
		addition = "url:"+$(this).attr("href");
		logupLoad(buttonName,addition);
	})
})
