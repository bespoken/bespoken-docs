$( function() {
    $( ".accordion-button" ).click(function () {
        var clickedId = "#" + $(this).attr('data-target');
        if ($(clickedId).is(":visible")) {
            $(clickedId).hide("slow");
        } else {
            $(clickedId).show("slow");
        }       
    });

    // Hide all accordions by default on load
    $( ".accordion" ).hide();
} );