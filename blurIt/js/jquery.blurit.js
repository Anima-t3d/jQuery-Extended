 /*!
 * blurIt Plugin for jQuery
 *
 * @author Brecht Missotten
 * @date 15/06/2011
 *
 * Description:
 * create a blur effect on image
 * 
 * Usage:
 * create blur version from original image in photoshop/the gimp and save it with a suffix, default:"_blur"
 * so original.jpg and original_blur.jpg
 * just call blurit $(element).blurIt(options);
 * example: $('#myid').blurIt({"blurIt":67}); 
 * 
 * 
 */
 
 
(function ($){		
	$.fn.extend({
		blurIt : function (options) {
			var defaults = {
				blurIt:100,
				suffix:"_blur"
			};
			var settings = $.extend(defaults,options);
			var opacity = settings.blurIt/100;
			var imageUrl;
			var urlFromImg = false;
			if($('img', this).size() > 0){
				$(this).css({"position":"relative"});
				imageUrl = $("img",this).attr("src");
				urlFromImg = true;
			}else{
				imageUrl = $(this).css("background-image");
				var patt=/\"|\'|\)|\(|url/g;
				imageUrl = imageUrl.replace(patt,'');
			}
			var imageParts = imageUrl.split('.');
			var imageExt = imageParts[1];
			var imagePathName = imageParts[0];
			imageUrl= imagePathName+settings.suffix+"."+imageExt;
			if($(".blurIt",this).size()>0){
				$(".blurIt",this).css({opacity:settings.blurIt/100});
			}else{
				if(urlFromImg){
					this.append('<div class="blurIt" style="background-image:url('+imageUrl+');opacity:'+opacity+';width:'+$("img",this).width()+'px;height:'+$("img",this).height()+'px;margin:0;padding:0;position:absolute;top:0;"></div>');
				}else{
					this.append('<div class="blurIt" style="background-image:url('+imageUrl+');opacity:'+opacity+';width:100%;height:'+$(this).height()+'px;margin:0;padding:0;"></div>');
				}
			}
		}
	})
})(jQuery);