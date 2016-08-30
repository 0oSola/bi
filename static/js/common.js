// JavaScript Document
(function(){
	$(".logout-box").on("click",function(){
		$("#logoutModal").modal("show");
		$(".sure-logout").off("click");
		$(".sure-logout").on("click",function(){
			$("#logoutModal").modal("hide");
		});
	});
})()
