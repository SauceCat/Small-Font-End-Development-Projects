var channels = ["freecodecamp", "storbeck","terakilobyte","habathcx","RobotCaleb","thomasballinger","noobs2ninjas","beohoff","brunofin",
"comster404","test_channel","cretetion","sheevergaming","TR7K","OgamingSC2","ESL_SC2"];

function getChannelInfo() {
	channels.forEach(function(channel){
		function makeURL(type, name) {
			return "https://api.twitch.tv/kraken/" + type + "/" + name + "?callback=?";
		};
		
		$.getJSON(makeURL("streams", channel), function(data){
			var game;
			var status;
			
			if(data.stream === null) {
				game = "Offline";
				status = "offline";
			} else if (data.stream == undefined) {
				game = "Account Closed";
				status = "closed";
			} else {
				game = data.stream.game;
				status = "online";
			};
			
			$.getJSON(makeURL("channels", channel), function(data){
				var logo, name, description, url, html;
				if(data.logo === null) {
					logo = "https://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F";	
				} else {
					logo = data.logo;
				};
				
				if(data.display_name === null) {
					name = channel;
				} else {
					name = data.display_name;	
				};
				
				if(data.game === null) {
					description = "";
				} else {
					description = status + " : " + data.status;	
				};
				
				if(data.url === null) {
					url = "";
				} else {
					url = data.url;
				}
				
				html = html = "<div class='items row " + status + "'>" + 
				"<div class='col-sm-3 '><img class='logo' src='" + logo + "' /></div>" +
				"<div id='name' class='col-sm-3'><a href='" + url + "'>" + name + "</a></div>" +
				"<div id='des' class='col-sm-6'><p>" + description + "</p></div>" +
				"</div>";
				
				if (status == "online") {
					$("#content").prepend(html);
				} else if (status == "offline") {
					$("#content").append(html);
				};
			});
		});
	});
};

$(document).ready(function(){
	getChannelInfo();
	$("#selector li").click(function(){
    	$("#selector li").removeClass("active");
		$("#selector li").addClass("inactive");
		$(this).removeClass("inactive");
		$(this).addClass("active");
	});
	$("#on").click(function(){
    	$(".online").removeClass("hidden");
		$(".offline").addClass("hidden");
	});
	$("#off").click(function(){
    	$(".offline").removeClass("hidden");
		$(".online").addClass("hidden");
	});
	$("#all").click(function(){
    	$(".offline").removeClass("hidden");
		$(".online").removeClass("hidden");
	});
});

