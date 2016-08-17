var minutes;
var seconds;
var minutes_dis;
var seconds_dis;
var tol_fill_tm;
var fill_tm;
var per;
var flg = 0;
var show_flg = 0;
var color = '#99CC00';
var new_time;
var pause = true;

function timer(){
	var myVar = setInterval(function(){
    	if(seconds==0 && minutes==0){
        	flg++;
			if(flg%2 == 1){
				minutes = $('#break').text();
				$('#timer_header').text('Break!');
				color = '#FF4444';
				$('#timer').css("borderColor","#FF4444");
			}else{
				minutes = $('#session').text();
				$('#timer_header').text('Session');
				color = '#99CC00';
				$('#timer').css("borderColor","#99CC00");
			}
			seconds = 0;
			tol_fill_tm = minutes*60;
			show_flg = 1;
			fill_tm = 0;
			per=0;
		}
      
		if(show_flg){
        	new_time = minutes;
			show_flg = 0;
		}else{
			if(seconds == 0){
				minutes--;
				seconds = 60;
			}
			seconds--;
			seconds_dis = seconds;
			minutes_dis = minutes;
			if(seconds.toString().length < 2){
				seconds_dis = '0' + seconds_dis;
    		}
			if(minutes.toString().length < 2){
				minutes_dis = '0' + minutes_dis;
    		}
			new_time = minutes_dis + ':' + seconds_dis;
			fill_tm++;
			per = 1.0 * fill_tm / tol_fill_tm * 100;
    	}
      
		$('#time').text(new_time);
		if(fill_tm <= tol_fill_tm){
        	$('#timer_bg').css({background: "linear-gradient(to top,"+color+ " "+per+"%,transparent "+per+"%,transparent 100%)"});
    	}
		if(pause){
        	clearInterval(myVar);
      	}
    }, 1000);
}

$(document).ready(function(){
	var break_val = $('#break').text();
	var sess_val = $('#session').text();
	
	$('#break_plus').click(function(){
		break_val++;
		$('#break').text(break_val);
	});

	$('#break_minus').click(function(){
    	break_val--;
		if(break_val < 1){
			break_val = 1;
    	}
		$('#break').text(break_val);
	});
  
	$('#sess_plus').click(function(){
    	sess_val++;
		$('#session').text(sess_val);
		$('#time').text(sess_val);
		minutes = sess_val;
		tol_fill_tm = minutes*60;
	});
	
	$('#sess_minus').click(function(){
    	sess_val = $('#session').text();
		sess_val--;
		if(sess_val < 1){
			sess_val = 1;
    	}
		$('#session').text(sess_val);
		$('#time').text(sess_val);
		minutes = sess_val;
		tol_fill_tm = minutes*60;
	});
  
	minutes = sess_val;
	seconds = 0;
	tol_fill_tm = minutes*60;
	fill_tm = 0;
	per=0;
  
	$('#timer').click(function(){
    	pause = !pause;
		if(!pause){
			timer();
    	}
	});
});