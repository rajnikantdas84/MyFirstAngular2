function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}
$(document).ready(function () {
    $("#toggle_button").click(function () {
        $("#toggle_div").slideToggle('slow');
    });	
    $("#jq_span").click(function () {
        $("#jq_menu").slideToggle();
    });	
    $("#nav_button").click(function () {
        $("#jq_nav").slideToggle();
    });	
    var i=186;
    $('#js-heightControl').css('min-height', $(window).height() - i+'px');
});