/*
jQuery get element from point
Plugin adapted from: http://www.zehnet.de/2010/11/19/document-elementfrompoint-a-jquery-solution/
More info: http://www.quirksmode.org/dom/w3c_cssom.html
*/
(function ($){
  var check=false; isRelative=true;

  $.fn.extend({
	  elementFromPoint : function(x,y)
	  {
		if(!document.elementFromPoint) return null;
	
		if(!check)
		{
		  var sl;
		  if((sl = $(document).scrollTop()) >0)
		  {
		   isRelative = (document.elementFromPoint(0, sl + $(window).height() -1) == null);
		  }
		  else if((sl = $(document).scrollLeft()) >0)
		  {
		   isRelative = (document.elementFromPoint(sl + $(window).width() -1, 0) == null);
		  }
		  check = (sl>0);
		}
	
		if(!isRelative)
		{
		  x += $(document).scrollLeft();
		  y += $(document).scrollTop();
		}
	
		return document.elementFromPoint(x,y);
	  }	
  })
})(jQuery);