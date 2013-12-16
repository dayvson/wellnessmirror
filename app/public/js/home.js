$(function(){
	var now = new Date();
	$(".datep").datepicker({format: 'yyyy-mm-dd'}).on('changeDate', function(ev) {
				 $(this).datepicker('hide');
	}).val(now.getFullYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate() <= 9 ? "0"+ now.getDate() : now.getDate()));
	now.setDate(now.getDate()-1);
	$("#dataPickerField").val(now.getFullYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate() <= 9 ? "0"+ now.getDate() : now.getDate()));
	$("#overall").on("click", function(elem){
		var data = {"start": $("#dataPickerField").val(), "end":$("#dataPickerField2").val()};
		$("#percentage").removeClass("highlight");
		$(this).addClass("highlight");
		
	    $.ajax({
		  type: "GET",
		  url: apphost + "/sleep/range/" + data.start + "/" + data.end,
		  success: function(result){
		  	$("#stateResult").html((result.sleep||"") + " " + result.hours + ":" + result.minutes +  "h and " + (result.step||""));
		  	$("#percentage_container").hide();
		  	$("#overall_container").show();
		  },
		  dataType: "json"
		});
	});
	$("#percentage").on("click", function(elem){
		var data = {"start": $("#dataPickerField").val(), "end":$("#dataPickerField2").val()};
		$("#overall").removeClass("highlight");
		$(this).addClass("highlight");
		
	    $.ajax({
		  type: "GET",
		  url: apphost + "/activities/range/" + data.start + "/" + data.end,
		  success: function(result){
		  	$("#percentage_container").show();
		  	$("#overall_container").hide();
		  	$("#bed").html(result.sleepTime);
		  	$("#sedentary").html(result.sedentary);
		  	$("#light").html(result.lightly);
		  	$("#fairly").html(result.fairly);
		  	$("#very").html(result.veryActive);
		  },
		  dataType: "json"
		});
	});
	$("#overall").trigger("click");
});
