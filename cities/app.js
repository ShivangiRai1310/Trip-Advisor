var swiper1 = new Swiper('#city-animation', {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 30,
    stretch: 0,
    depth: 500,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: '.swiper-pagination',
  },
});

$("#about-varanasi").hide();
$("#varanasi").click(function(){
  $("#about-varanasi").show();
  $("#about-kolkata").hide();
});

$("#about-kolkata").hide();
$("#kolkata").click(function(){
  $("#about-kolkata").show();
  $("#about-varanasi").hide();
});
