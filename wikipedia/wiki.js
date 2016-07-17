$(document).ready(function(){
	$(".hand").mouseover(function(){
		$(this).removeClass("fa-hand-paper-o");
		$(this).addClass("fa-hand-spock-o");
	});
	$(".hand").mouseout(function(){
		$(this).removeClass("fa-hand-spock-o");
		$(this).addClass("fa-hand-paper-o");
	});
	
	$("#search").keydown(function(e){
		if(e.which == 13){
			// enter key press
			search();
		}
	});
	$("#search").keydown(function(e){
		if(e.which == 8){
			// delete key press
			$("#results").append(html);
		}
	});
});

var arrResults = [];
var html = "";

function Result(title, snippet){
	this.title = title;
	this.snippet = snippet;
}

function search(){
	$.ajax({
		url: "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=" + $("#search").val(),
		dataType: "jsonp",
		type: "POST",
		headers: {
			"Api-User-Agent": "Example/1.0"
		},
		success: function(data) {
			// first clean the previous results
			$("#results").empty();
			
			// also clean up the array with results
			arrResults.length = 0;
			
			var resArr = data.query.search;
			
			// for each result, generate the html data and append to div
			for (var result in resArr) {
				arrResults.push(new Result(resArr[result].title, resArr[result].snippet));
				html = "<div class='mywell'><a href='https://en.wikipedia.org/wiki/" + resArr[result].title + 
				"' target='_blank'><h4>" + resArr[result].title + "</h4><p>" + resArr[result].snippet + "</p></a></div>";

				// displays the elements to the page
				$("#results").append(html);
			}
		}
	});
}