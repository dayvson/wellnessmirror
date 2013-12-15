$(function(){
	var now = new Date();
	$(".datep").datepicker({format: 'yyyy-mm-dd'}).on('changeDate', function(ev) {
				 $(this).datepicker('hide');
	}).val(now.getFullYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate() <= 9 ? "0"+ now.getDate() : now.getDate()));
	now.setDate(now.getDate()-1);
	$("#dataPickerField").val(now.getFullYear() + "-" + (now.getMonth()+1) + "-" + (now.getDate() <= 9 ? "0"+ now.getDate() : now.getDate()));
	$("#overall").on("click", function(elem){
		var data = {"date": $("#dataPickerField").val()};
		$("#percentage").removeClass("highlight");
		$(this).addClass("highlight");
		
	    $.ajax({
		  type: "POST",
		  url: apphost + "/sleep/date/select",
		  data: data,
		  success: function(data){
		  	$("#stateResult").html(data.sleep.toUpperCase() + " " + data.hours + ":" + data.minutes +  "h AND " + data.step.toUpperCase());
		  	$("#percentage_container").hide();
		  	$("#overall_container").show();
		  },
		  dataType: "json"
		});
	});
	$("#percentage").on("click", function(elem){
		var data = {"date": $("#dataPickerField").val()};
		$("#overall").removeClass("highlight");
		$(this).addClass("highlight");
		
	    $.ajax({
		  type: "GET",
		  url: apphost + "/activities/date/select/" + data["date"],
		  success: function(data){
		  	$("#percentage_container").show();
		  	$("#overall_container").hide();
		  	$("#bed").html(data.sleepTime);
		  	$("#sedentary").html(data.sedentary);
		  	$("#light").html(data.lightly);
		  	$("#fairly").html(data.fairly);
		  	$("#very").html(data.veryActive);
		  	$("#stateResult").empty().append(ul);
		  },
		  dataType: "json"
		});
	});
	$("#overall").trigger("click");
});
