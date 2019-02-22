$(document).ready(function() {
    jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 2000  // 2 seconds
  });

  $(document).ready(function(){
    $('.header-navbar_hamburger').on('click' , function () {
      $(this).toggleClass('active');
      $('.header-navbar_list').toggleClass('active');
    });
  });