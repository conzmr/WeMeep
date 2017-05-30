angular.module('wetopiaApp')
.service('categoriesDataService', function($http) {

  this.categories = {
    art : {
      banner: 'static/img/CAT_IMAGES/Art_IMG.svg'
    },
    design : {
      banner: 'static/img/CAT_IMAGES/Design_IMG.svg'
    }
    ,
    ecological : {
      banner: 'static/img/CAT_IMAGES/Eco_IMG.svg'
    },
    education : {
      banner: 'static/img/CAT_IMAGES/Edu_IMG.svg'
    },
    fashion : {
      banner: 'static/img/CAT_IMAGES/Fashion_IMG.svg'
    },
    film: {
      banner: 'static/img/CAT_IMAGES/Film_IMG.svg'
    },
    finances : {
      banner: 'static/img/CAT_IMAGES/Finances_IMG.svg'
    },
    food : {
      banner: 'static/img/CAT_IMAGES/Food_IMG.svg'
    },
    games : {
      banner: 'static/img/CAT_IMAGES/Games_IMG.svg'
    },
    handcraft : {
      banner: 'static/img/CAT_IMAGES/Handcraft_IMG.svg'
    },
    health : {
      banner: 'static/img/CAT_IMAGES/Health_IMG.svg'
    },
    social : {
      banner: 'static/img/CAT_IMAGES/Social_IMG.svg'
    },
    technology : {
      banner: 'static/img/CAT_IMAGES/Tech_IMG.svg'
    },
    others: {
      banner: 'static/img/Image_default.svg'
    }
  }


  this.getCategories = function (callback, errorCallback) {
    return $http.get(window.HOST + '/api/tags')
    .then(callback, errorCallback)
  }

})
