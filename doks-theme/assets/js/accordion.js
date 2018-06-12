$( function() {
    $( ".accordion-button" ).click(function () {
        var clickedId = "#" + $(this).attr('data-target');
        if ($(clickedId).is(":visible")) {
            $(clickedId).hide();
        } else {
            $(clickedId).show();
        }       
    });

    // Hide all accordions by default on load
    $( ".accordion" ).hide();
} );