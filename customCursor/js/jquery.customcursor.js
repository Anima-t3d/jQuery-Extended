 /*!
 * customcursor Plugin for jQuery
 *
 * @author Brecht Missotten
 * @link http://jquery.kidsil.net
 * @version 0.02
 * @date 10/06/2011
 *
 * Description:
 * create a custom cursor for any element, no more .cur files needed that may or may not work!
 * 
 * Usage:
 * just call customcursor $('body').customcursor(options);
 * example: $('body').customcursor({"body":"images/3d_black.cur","#outer":"images/3d_black_Link_Select.cur","#inner":"images/squared_cursor.jpg"}); where "element":"path/to/image.jpg"
 * 
 * Important footnote: this is adapted from Asaf Zamir's plugin @ http://jquery.kidsil.net
 * 
 * Update:
 * Made proper jquery plugin
 * Fixed z-index issue
 * Changed name to jquery.customcursor.js (name conventions)
 * Multi cursor support
 */
 
 
 /*TODO:
 - screensize no scrolling when near edge // partialy working when flipping = true
 - selector caching
 - color blanks for different elements
 - support for png spritely animation
 - trailoriented rotation for cursor
 - different offsets for each cursorimg (to enable accurate pointer click)
 */
(function ($){		
	var timer = false;

	$.fn.extend({
		customcursor : function (options) {
			var defaults = {
				defaultCursor:"3d_black.cur",
				imagefolder:"images/",
				safeOffset:10,
				normalOffset:1,
				flipping:true
			};
			var settings = $.extend(defaults,options);
			//find non settings related options:
			var passedCursors = new Object();
			$.each(settings,function(key,value){
				if(key!="defaultCursor" && key!="imagefolder" && key!="safeOffset" && key!="normalOffset" && key!="flipping"){
					//adds support to use "body,a":"path/to/image.jpg"
					var keys = key.split(",");
					var ii = 0;
					if(keys.length>1){
						var keysValue = value;
						$.each(keys,function(key,value){
							passedCursors[keys[ii]]= keysValue;
							ii++;
						});
					}else{
						passedCursors[key]=value;
					}
				}
			});

			//------------ CACHING -------------
			//var $myCursor = $("#mycursor"); /* seems to break hiding and updating etc */
			/* preloading requires binarykitten's jquery.preloader.js plugin so only preload if needed file is included */
			if(jQuery.preLoadImages){console.log(passedCursors);
				// Do something when jquery.preloader.js is loaded
				var cachedImages = new Array();
				var ii = 0;
				$.each(passedCursors,function(key,value){
						cachedImages[ii]= value;
						ii++;
				});console.log(cachedImages);
				$.preLoadImages(
					 cachedImages,function(){
						  //alert('All Passed Images Loaded');
					 }
				);
			}
			
			//------------ SETUP -------------
			/*Check and serve a blank cursor file for the right browser*/
			var blankImg;
			if($.browser.webkit){
				//Webkit shows a black square with the size of the 100%transparent image, hence using a colored transparent gif
				blankImg=settings.imagefolder+"blank.gif";
			}else{
				blankImg=settings.imagefolder+"blank.cur";
				settings.safeOffset = settings.normalOffset;
			}
			//replace default cursor with blank
			$("body,:active,:link,:hover,:visited").css('cursor','url('+blankImg+'), default');
			//if not exists already, create custom cursor
			if (!$("#mycursor").length) {
					this.append('<img style="position:absolute;display:none;cursor:none;z-index:999999999;" id="mycursor" src="'+settings.imagefolder+settings.defaultCursor+'" />');
					//for spritely png animation needs div with css background-image instead of img element
					/*
					//http://stackoverflow.com/questions/5106243/how-do-i-get-background-image-size-in-jquery
					var url = $('#myDiv').css('background-image').replace('url(', '').replace(')', '').replace("'", '').replace('"', '');
					var bgImg = $('<img />');
					bgImg.hide();
					bgImg.bind('load', function()
					{
						var height = $(this).height();
						alert(height);
					});
					$('#myDiv').append(bgImg);
					bgImg.attr('src', url);

					this.append('<div style="position:absolute;display:none;cursor:none;z-index:999999999;background:url('+settings.imagefolder+settings.defaultCursor+') left top no-repeat" id="mycursor"></div>');
					*/
					$("#mycursor").css({"transform":'rotate(0deg)'});
				}
			
			//------------ SIMULATION -------------
			//simulate cursor by moving image when mouse moves
			$(this).mousemove(function(e){
				var position = $("#mycursor").position();
				var cursorWidth = $("#mycursor").width();
				var cursorHeight = $("#mycursor").height();
				var safeOffset = settings.safeOffset;
				var normalOffset = settings.normalOffset;
				var flipped = false;
				if(settings.flipping){
					if(position.left +  cursorWidth*3> $(window).width()){
						flipped = true;
					}else if(position.top + cursorHeight*3> $(window).height()){
						flipped=true;
					}
				}
				/*
				//get rotation, needs css transform plugin
				var rotation =$("#mycursor").css('transform');
				//get numeric value from rotation
				rotation = rotation.split("(");
				rotation = parseInt(rotation[1],10);
				rotation+=1;
				$("#mycursor").css({"transform":"rotate("+rotation+"deg)"});
				*/
				//clear any timer to prevent stacking of timers
				clearTimeout(timer);
				//while moving keep a distance for non firefox browsers to prevent default cursor to appear
				if(flipped && settings.flipping){
					$("#mycursor").css({"transform":"rotate(180deg)"});
					$("#mycursor").css({'left': e.clientX-cursorWidth-safeOffset,'top': e.clientY-cursorHeight-safeOffset});				
				}else{
					$("#mycursor").css({"transform":"rotate(0deg)"});
					$("#mycursor").css({'left': e.clientX+safeOffset,'top': e.clientY+safeOffset});	
				}
				//console.log("mx:"+e.clientX+" cl:"+$myCursor.css("left")+"my:"+e.clientY+" ct:"+$myCursor.css("top"));
				//find element under cursor magic needs elementFromPoint plugin
				$("#mycursor").hide();
				var element = $().elementFromPoint(e.clientX,e.clientY);
				var selector;
				if(element.id==""){
					selector = element.localName;
				}else{
					selector = "#"+element.id;
				}
				$("#mycursor").attr("src",passedCursors[selector]);
				$("#mycursor").show();
				//after moving put cursor near real cursor
				timer = setTimeout(function(){
					if(flipped){
						$("#mycursor").css({'left': e.clientX-cursorWidth,'top': e.clientY-cursorHeight});
					}else{
						$("#mycursor").css({'left': e.clientX+normalOffset,'top': e.clientY+normalOffset});
					}
				},40);
			});
		}
	});
})(jQuery);