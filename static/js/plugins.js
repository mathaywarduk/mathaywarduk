var screenw = $(window).width();
var breakpoints = [481, 767, 1200, 1500];
var hires = (screenw >= breakpoints[1]);

$(document).ready( function() {
    

    // Scroll top
    $("[data-scroll-to-target]").on('click', function(e) {
        e.preventDefault();
        var $target = $($(this).attr("href"));
        var top = $target.offset().top;

        $("body, html").animate({
            scrollTop: top
        }, 1000);
    });


    // Pop up windows for share links

    $(document).on('click', "[data-popup]", function(e) {
        e.preventDefault();
        var url = $(this).attr("href");
        var windowName = "popup";
        var windowSize = "width=" + $(this).attr("data-popup-width") + ",height=" + $(this).attr("data-popup-height") + ",scrollbars=no,resizable=no,toolbar=no" 
        window.open(url, windowName, windowSize);
    });

});


$(window).on('load', function() {
    // Initialise grid on load, so images are loaded
    hiresImages();

    // change blockquotes to tweet intents
    blockquoteTweets();

    $("body").removeClass("no-js");
});



$(window).on('resize', function() {
    screenw = $(window).width();
    hires = (screenw >= breakpoints[1]);
    hiresImages();
});

// Change height of images to fit rows in grid
function sizePhotoGrid() {

    if (screenw >= breakpoints[1]) {

        var baseHeight = 250;

        $("[data-grid-row]").each( function() {
            var desiredWidth = screenw - 15 - ( 5 * $(this).children().length ) - 5; // window width - body padding left - right padding of each item - row padding
            var $imgs = $(this).find('img');
            var baseWidth = 0;

            $imgs.each( function() {
                var $img = $(this);

                // get ratio
                var ratio = $img.height()/$img.width();

                // calculate base width and add to var
                baseWidth += baseHeight / ratio;

                // reset that image 
                $(this).removeAttr("style");
            });


            // calculate new height, base on desired row width
            var newHeight = baseHeight * (desiredWidth / baseWidth);
            $imgs.height(newHeight);

            // check all widths don't exceed desiredwidth
            var w = 0;
            $imgs.each( function() {
                // set width = width if hires images are going to be replaced
                if (hires) {
                    $(this).width($(this).width());
                }

                // add width to var
                w += $(this).width();
            });

            // tweak last image width if row is too short/long
            if (w != desiredWidth) {
                var $lastimg = $(this).find("img:last");
                var tweakWidth = $lastimg.width() + (desiredWidth - w);
                $lastimg.width(tweakWidth);
            }


        });

    }
}

function hiresImages() {

    if (hires) {

        $("[data-hires]").each( function() {
            var $img = $(this);
            var hiresImg = $(this).attr("data-hires");
            $("<img/>").attr("src", hiresImg).on('load', function() {
                $img.attr("src", hiresImg).removeAttr("data-hires");
            });
        });

        // only sort the photo grid after the larger images have loaded
        sizePhotoGrid();
    } else {
        // if mobile, reset
        $("[data-grid-row] img").removeAttr("style");
    }

}

function blockquoteTweets() {
    $(".post__content blockquote").each( function() {
        var content = $(this).find("p").text();
        var url = "http://mathayward.com" + window.location.pathname;
        var tweetUrl = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&related=mathaywarduk&text=%E2%80%9C" + content.replace(/ /g, "+") + "%E2%80%9D";
        var $anchor = $("<a/>").attr({
            'data-popup'          : '',
            'data-popup-width'    : '685',
            'data-popup-height'   : '500',
            'href'                : tweetUrl,
            'title'               : 'Tweet this'
        }).text(content).addClass("inline-tweet");

        $(this).find("p").html($anchor);
        console.log($anchor);
        // <blockquote><p><a href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fmathayward.com/a-rant-about-seo&amp;related=mathaywarduk&amp;text=%E2%80%9CHow+do+you+convince+the+search+engines+that+your+page+is+the+best+result?+Start+by+being+the+best+result.%E2%80%9D" class="inline-tweet" title="Tweet this" data-popup data-popup-width="685" data-popup-height="500">How do you convince the search engines that your page is the best result? Start by being the best result.</a></p></blockquote>
    });
}