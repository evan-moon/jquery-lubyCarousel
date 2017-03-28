/* ===========================================================
 *
 *  Name:          imageSlider.js
 *  Updated:       2016-06-10
 *  Version:       0.1.0
 *  Created by:    DART, Lubycon.co
 *
 *  Copyright (c) 2016 Lubycon.co
 *
 * =========================================================== */

(function($){
	$.fn.lubyImageSlider = function(option){
        var defaults = { 
            customClass : "",
            arrow : true,
            arrowLeftIcon : "fa-angle-left",
            arrowRightIcon : "fa-angle-right",
            enabledNavigator : true,
            enabledAnimation : true,
            animationSpeed : 500, //ms
            autoPlay : true,
            autoPlayInterval : 3000, //ms
            sliderWidth : "1000px",
            sliderHeight : "auto",
            gridWidth : 5
        },
        d = {},
        pac = {
            init: function (option) {
                return d = $.extend({}, defaults, option), this.each(function () {
                    if (!$(this).hasClass("lubyImageSlider")) $.error("THERE IS NO LUBY IMG SLIDER");
                    else {
                        var $this = $(this),
                            sliderviewer = $("<div/>",{ "class" : "img-slider-viewer"}),
                            sliderInnerWrapper = $("<div/>",{ "class" : "img-slider-item-wrapper"}),
                            listWrapper = $this.find("ul");
                        $this.addClass(d.customClass);
                        $this.css({
                            "width" : d.sliderWidth,
                            "height" : d.sliderHeight
                        });
                        $this.attr("data-autoplay",d.autoPlay);
                        $this.hover(function(){
                            $this.attr("data-autoplay",false);
                        },function(){
                            $this.attr("data-autoplay",true);
                        });

                        sliderInnerWrapper.appendTo(sliderviewer);
                        sliderviewer.prependTo($this);

                        listWrapper.addClass("img-slider-list-wrapper");
                        listWrapper.each(function(){ $(this).appendTo(sliderInnerWrapper) });

                        pac.setIndex.call(listWrapper);
                        listWrapper.each(function(){
                            var list = $(this).find("li");
                            pac.setIndex.call(list);
                        });

                        pac.setGrid.call($this);

                        if(d.enabledAnimation) sliderInnerWrapper.css("transition","left " + (d.animationSpeed/1000) + "s");
                        if(d.enabledNavigator) pac.initNavigator.call($this);
                        if(d.arrow) pac.initArrow.call($this);
                        if(d.autoPlay) func.initAutoPlay.call($this);
                    }
                })
            },
            initArrow: function(){
                    var $this = $(this),
                        arrow = $("<i/>",{ "class" : "img-slider-arrow fa" }).on("click",enableArrowAction),
                        leftArrow = arrow.clone(true).addClass(d.arrowLeftIcon).attr("data-value","left"),
                        rightArrow = arrow.clone(true).addClass(d.arrowRightIcon).attr("data-value","right");

                    leftArrow.appendTo($(this));
                    rightArrow.appendTo($(this));

                function enableArrowAction(){
                    var data = $(this).data("value");
                    if(data === "left") func.sliderMove($this,"left",-1);
                    else if(data === "right") func.sliderMove($this,"right",-1);
                    else return false;  
                }
            },
            initNavigator: function(){
                var $this = $(this),
                    items = $this.find(".img-slider-list-wrapper").length,
                    navWrapper = $("<div/>",{ "class" : "img-slider-nav" }),
                    navButton = $("<div/>",{ "class" : "img-slider-nav-bt btn radioType" })
                                .on("click",func.navigationAction)
                                .on("click",func.radioAction);

                    for(var i = 0; i < items; i++){
                        var button = navButton.clone(true);
                        if(i === 0) button.addClass("selected");
                        button.attr("data-target",i);
                        button.appendTo(navWrapper);
                    }
                    navWrapper.appendTo($this);
            },
            setIndex: function(){
                $(this).each(function(){ $(this).attr("data-index",$(this).index()) });
            },
            setGrid: function(){
                var gridSize = $(this).width() / d.gridWidth;
                $(this).find("li").css({
                    "width" : gridSize,
                    "height" : gridSize 
                });
            }
        },
        func = {
            currentPage: 0,
            sliderMove: function(selector,direction,index){
                var target = selector.find(".img-slider-item-wrapper"),
                    targetWidth = target.width(),
                    targetPadding = target.parents(".lubyImageSlider").css("padding").replace("px","") * 2,
                    currentPosition = target.css("left").replace("px","") * 1,
                    moveLength = targetWidth + targetPadding,
                    maxPosition = moveLength * (target.find(".img-slider-list-wrapper").length - 1) * -1; //2400
                    
                if(!Number.isInteger(currentPosition) || selector.css("display") == "none") return false;

                if(index === -1){
                    if(direction === "left") {
                        if(currentPosition === 0) {
                            target.css("left",maxPosition);
                            func.currentPage = target.find(".img-slider-list-wrapper").length - 1;
                        }
                        else {
                            target.css("left", currentPosition + moveLength);
                            func.currentPage--;
                        }
                    }
                    else if(direction === "right") {
                        if(currentPosition === maxPosition) {
                            target.css("left",0);
                            func.currentPage = 0;
                        }
                        else {
                            target.css("left", currentPosition - moveLength);
                            func.currentPage++;
                        }
                    }
                }
                else{
                    var targetPosition = moveLength * index * -1;
                    target.css("left",targetPosition);
                }

                setNavigator.call(target);
                function setNavigator(){
                    var parent = $(this).parents(".lubyImageSlider"),
                        buttons = parent.find(".img-slider-nav-bt"),
                        button = parent.find(".img-slider-nav-bt[data-target='" + func.currentPage + "']");
                    buttons.removeClass("selected");
                    button.addClass("selected");
                }
            },
            initAutoPlay: function(){
                var $this = $(this);
                setInterval(function(){
                    var bool = $this.attr("data-autoplay");
                    if(bool === "true") func.sliderMove($this,"right",-1);
                    else return false;
                },d.autoPlayInterval);
            },
            radioAction: function(){
                var $this = $(this),
                    bros = $this.siblings(".btn");
                bros.removeClass("selected");
                $this.addClass("selected");
            },
            navigationAction: function(){
                var $this = $(this);
                var wrapper = $this.parents(".lubyImageSlider");
                if(!$this.hasClass("selected")) action();

                function action(){
                    var data = $this.data("target"),
                        target = $this.parent().prev().find(".img-slider-item-wrapper");
                    func.sliderMove(wrapper,"right",data);
                }
            }
        },
        method = {
            destroy: function(){
                return this.each(function(){
                    var $this = $(this);
                    $this.remove();
                })
            },
            setImage: function(ulIndex,liIndex,src){
                return this.each(function(){
                    var $this = $(this);
                    var ul = $this.find("ul[data-index='" + ulIndex + "']"),
                        li = ul.find("li[data-index='" + liIndex + "']");
                    li.find("img").attr("src",src);
                })
            },
            getImage: function(ulIndex,liIndex){
                var $this = $(this);
                var ul = $this.find("ul[data-index='" + ulIndex + "']"),
                    li = ul.find("li[data-index='" + liIndex + "']");
                return li.find("img").attr("src");
            },
            setLink: function(ulIndex,liIndex,uri){
                return this.each(function(){
                    var $this = $(this);
                    var ul = $this.find("ul[data-index='" + ulIndex + "']"),
                        li = ul.find("li[data-index='" + liIndex + "']");
                    li.find("a").attr("href",uri);
                })
            },
            getLink: function(ulIndex,liIndex){
                var $this = $(this);
                var ul = $this.find("ul[data-index='" + ulIndex + "']"),
                    li = ul.find("li[data-index='" + liIndex + "']");
                return li.find("a").attr("href");
            }
        }
        return method[option] ? 
        method[option].apply(this, Array.prototype.slice.call(arguments, 1)) : 
        "object" != typeof option && option ? 
            ($.error('No such method "' + option + '" for the lubySelector instance'), void 0) : 
            pac.init.apply(this, arguments);
    };
})(jQuery);
