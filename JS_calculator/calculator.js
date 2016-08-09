$(document).ready(function(){
  var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  var operators = ['/', '*', '-', '+', '.', '=', '&divide;', 'x'];
  
  var result = '';
  var results = '';
  var display = '';
  var figures = '';
  var entry = '';
  var equalFlag = 0;

  function clean(){
    result = '';
    results = '';
    display = '';
    figures = '';
    entry = '';
    equalFlag = 0;
  }
  
  $('button').click(function(){
    entry = $(this).val();

    if(entry == 'AC'){
      clean();
      $('#cal_result').html('0');
      $('#cal_process').html('0');
    }else if(entry == 'CE'){
      if(operators.indexOf(results.substr(-1, 1)) == -1){
        result = '0';
        var n = display.lastIndexOf(figures);
        var m = results.lastIndexOf(figures);
        display = display.substring(0, n);
        results = results.substring(0, m);
        figures = '';
      }
      $('#cal_result').html(result);
      if(display == ''){
        $('#cal_process').html('0');
      }else{
        $('#cal_process').html(display);
      }
    }else if(entry == '.' && figures.indexOf('.') >= 0){
      clean();
      $('#cal_result').html('0');
      $('#cal_process').html('Error');
    }else if(figures.length > 7){
      clean();
      $('#cal_result').html('0');
      $('#cal_process').html('Digit Limit Met');
    }else if(entry == '='){
      result = eval(results);
      display = display + '=' + result;
      $('#cal_result').html(result);
      $('#cal_process').html(display);
      results = result;
      display = result;
      figures = '';
      equalFlag = 1;
    }else if(equalFlag == 1){
      if(numbers.indexOf(entry) >= 0){
        clean();
      }
      results += entry;
      display += entry;
      figures = entry;
      equalFlag = 0;
    }else{
      if(results.length == 0 && operators.indexOf(entry) >= 0){
      }else{
        if(results.length > 0 && operators.indexOf(results.substr(-1, 1)) >= 0 && operators.indexOf(entry) >= 0){
          entry = display.substr(-1, 1);
        }else{
          results += entry;
          if(entry == '/'){
            display += '&divide;';
            entry = '&divide;';
          } else if (entry == '*') {
            display += 'x';
            entry = 'x';
          } else {
            display += entry;
          }
          if(numbers.indexOf(entry) >= 0 || entry == '.'){
            figures += entry;
          };
        };
      };
      
      if(results.length == 0){
        clean();
        $('#cal_result').html('0');
        $('#cal_process').html('0');
      }else{
        if(operators.indexOf(entry) == -1 || entry == '.'){
          result = figures;
        }else{
          result = entry;
          figures = '';
        };
        $('#cal_result').html(result);
        $('#cal_process').html(display);
      };
    }
  });
});