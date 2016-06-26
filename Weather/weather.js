function getLocation() {
	$.get('http://ip-api.com/json', function(loc){
		$('#location').text(loc.city + ', ' +  loc.countryCode);
	    getWeather(loc.city);
	});
}

function addIcon(city) {
  $('div.' + city).removeClass('hide');
}

function IconGen(city) {
  var city = city.toLowerCase();
  switch (city) {
    case 'dizzle':
      addIcon('clouds');
      $('#location').css('color', '#777');
      break;
    case 'clouds':
      addIcon(city);
      $('#location').css('color', '#0cf');
      break;
    case 'rain':
      addIcon('sun-shower');
      $('#location').css('color', '#27ae60');
      break;
    case 'snow':
      addIcon('sun-shower');
      break;
    case 'clear':
      addIcon(city);
      $('#location').css('color', '#f39c12');
      break;
    case 'thunderstorm':
      addIcon(city);
      $('#location').css('color', '#0cf');
      break;
    default:
	  $('div.clear').removeClass('hide');
	}
}

function getWeather(city) {
	var api_key = '42fa49e8699223fffae757c757daebf2';
	$.get('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + api_key, function(weather){
		var weather_c = Math.round(weather.main.temp - 273.15);
		$('#temp').html(weather_c);
		$('#des').text(weather.weather[0].main.toLowerCase());
		IconGen(weather.weather[0].main);
	});
}

$(document).ready(function(){
  getLocation();
  $('#transfer').click(function(){
	  var unit = $('#transfer').text();
	  var currentTemp;
	  var newTemp;
	  switch (unit) {
		  case 'F':
		  	$('#transfer').text('C');
		  	currentTemp = $('#temp').text();
		  	newTemp = Math.round((currentTemp - 32) / 1.8);
		  	$('#temp').text(newTemp);
		  	break;
		  case 'C':
		  	$('#transfer').text('F');
		  	currentTemp = $('#temp').text();
		  	newTemp = Math.round(currentTemp * 1.8 + 32);
		  	$('#temp').text(newTemp);
		  	break;
	  }
  });
});

