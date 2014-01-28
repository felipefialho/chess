(function($) {

//
// Variables
// --------------------------------------------------
     
// General
// --------------------------------------------------

var winHeight = $(window).height();
var sizeWindow = 0;
var heightWindow = 0;
var widthWindow = 0;
var mediaquery = { 
    phone: 520,
    mobile: 767,
    tablet: 1079
};

// Sounds
// --------------------------------------------------

// var notes = {
//   'horse': new Howl({
//       urls: ['assets/midia/horse.mp3']
//   }),
//   'bishop': new Howl({
//       urls: ['assets/midia/bishop.mp3']
//   }),
//   'rook': new Howl({
//       urls: ['assets/midia/rook.mp3']
//   }),
//   'pawn': new Howl({
//       urls: ['assets/midia/pawn.mp3']
//   })
// }; 

//
// Functions
// --------------------------------------------------
 
function isPhone() {
    return (sizeWindow <= mediaquery.phone);
}

function isMobile() {
    return (sizeWindow <= mediaquery.mobile);
}

function isTablet() {
    return (sizeWindow <= mediaquery.tablet);
}

function isDesktop() {
    return (sizeWindow > mediaquery.tablet);
}

//
// Events
// --------------------------------------------------

// Resize Document
$(window).resize(function() {

	// Window size
    heightWindow = $(window).height();
    widthWindow = $(window).width();

    // Define a confortable margin of window
    sizeMargin = 50;

    // Set sizes of Chess
    if(widthWindow < heightWindow){
        $('.chess').width(widthWindow-sizeMargin);
        $('.chess').height(widthWindow-sizeMargin);
    } else{
        $('.chess').width(heightWindow-sizeMargin);
        $('.chess').height(heightWindow-sizeMargin);
    }

    // Set font size
    var fontSize = $(".chess-cl").width() * 0.80; // 80% of container width
    $('.piece').css('font-size', fontSize);
 
});

// Run the function on resize and when the page loads!
// Set height of content 
$(window).resize();


//
// Global
// --------------------------------------------------

// Prevent Default
//---------------------------------------------------

$('a[href="#"]').click( function(e) {
      e.preventDefault();
});

// Collapse
// --------------------------------------------------
$('[data-toggle="collapse"]').click(function(){
    $(this).children('span').toggleClass("icon-arrow-up");
});
 
// Highlight Input
// --------------------------------------------------
$("[placeholder]").highlight();

// Popover - Pieces Out
// --------------------------------------------------
$('.user-pieces').popover({
    trigger: 'hover',
    html: true,
    placement: 'bottom'
});   
 
})(jQuery);

