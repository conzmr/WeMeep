$( "#submit-button" ).on("click",function() {
  var email = $("#email-input").val();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var isemail = regex.test(email);
  if (isemail) {
    var data = {"email": email};
    $.post( "/api/invitation", data)
    .done(function( data ) {
      console.log("RESPONSE:");
      console.dir(data);
      $("#result").html( data );
    });
    $('.thanks-email').text('Thanks, check your email :)');
  }else{
    $('.thanks-email').text('Ops, your email is not valid :(');
  }
});

$( "#submit-button2" ).on("click",function() {
  var email = $("#email-input2").val();
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var isemail = regex.test(email);
  if (isemail) {
    var data = {"email": email};
    $.post( "/api/invitation", data)
    .done(function( data ) {
      console.log("RESPONSE:");
      console.dir(data);
      $("#result").html( data );
    });
    $('.thanks-email').text('Thanks, check your email :)');
  }else{
    $('.thanks-email').text('Ops, your email is not valid :(');
  }
});

$('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if(typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if(typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass+' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

    }, 'xml');

});
