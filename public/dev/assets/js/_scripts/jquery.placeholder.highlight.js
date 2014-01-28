/*! Placeholder Highlight v0.1.0 (c) 2013 
Luiz Felipe Tartarotti Fialho (http://www.felipefialho.com/) 
Thiago Genuino
*/

$.fn.highlight = function(className) {
  var me = this;
  className = className || 'p-highlight';

  me.focus(function() {
    $(this).addClass(className);
  });
  me.blur(function() {
    $(this).removeClass(className);
  });
  me.keyup(function() {
    if ($(this).val()){
      $(this).removeClass(className);
    }
    else{
       $(this).addClass(className);
    }
  });
};