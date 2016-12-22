$(window).load(function(){
  var i =0;
  var backgroundImg = ["../imgLog/Login_bac_0.jpg", "../imgLog/Login_bac_1.jpg", "../imgLog/Login_bac_2.jpg"];
  var background = $('.hexagon-background');
  background.css('background', 'url('+backgroundImg[0]+') no-repeat center center fixed');
  background.css('background-size','cover');
  setInterval(function(){
    background.css('background', 'url('+backgroundImg[i++%backgroundImg.length]+') no-repeat center center fixed');
    background.css('background-size','cover');
  },500);
});
