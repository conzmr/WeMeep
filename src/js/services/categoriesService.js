angular.module('wetopiaApp')
.service('categoriesDataService', function($http) {

  this.categories = {
    art : {
      name: 'Art',
      banner: '/static/img/CAT_IMAGES/Art_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/ART_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/ART_ICON.svg'
    },
    design : {
      name: 'Design',
      banner: '/static/img/CAT_IMAGES/Design_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/DESIGN_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/DESIGN_ICON.svg'
    }
    ,
    ecological : {
      name: 'Ecological',
      banner: '/static/img/CAT_IMAGES/Eco_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/ECO_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/ECO_ICON.svg'
    },
    education : {
      name: 'Education',
      banner: '/static/img/CAT_IMAGES/Edu_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/EDU_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/EDU_ICON.svg'
    },
    fashion : {
      name: 'Fashion',
      banner: '/static/img/CAT_IMAGES/Fashion_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/FASH_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/FASH_ICON.svg'
    },
    film: {
      name: 'Film & Fotography',
      banner: '/static/img/CAT_IMAGES/Film_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/FILM_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/FILM_ICON.svg'
    },
    economics : {
      name: 'Finances',
      banner: '/static/img/CAT_IMAGES/Finances_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/FINAN_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/FINAN_ICON.svg'
    },
    food : {
      name: 'Food',
      banner: '/static/img/CAT_IMAGES/Food_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/FOOD_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/FOOD_ICON.svg'
    },
    games : {
      name: 'Games',
      banner: '/static/img/CAT_IMAGES/Games_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/GAMES_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/GAMES_ICON.svg'
    },
    handcraft : {
      name: 'Hand Craft',
      banner: '/static/img/CAT_IMAGES/Handcraft_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/HC_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/HC_ICON.svg'
    },
    health : {
      name: 'Health',
      banner: '/static/img/CAT_IMAGES/Health_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/HEALTH_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/HEALTH_ICON.svg'
    },
    social : {
      name: 'Social',
      banner: '/static/img/CAT_IMAGES/Social_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/SOCIAL_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/SOCIAL_ICON.svg'
    },
    technology : {
      name: 'Technological',
      banner: '/static/img/CAT_IMAGES/Tech_IMG.svg',
      cover: '/static/img/CATEGORIES_ICONS/TECH_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/TECH_ICON.svg'
    },
    others: {
      name: 'Others',
      banner: '/static/img/Image_default.svg',
      cover: '/static/img/CATEGORIES_ICONS/OTHERS_ICON.svg',
      hover:'/static/img/CATEGORIES_ICONS/HOVER/OTHERS_ICON.svg'
    }
  }

  this.getCategories = function (callback, errorCallback) {
    return $http.get(window.HOST + '/api/tags')
    .then(callback, errorCallback)
  }

  this.getRecommendedCategories = function (callback, errorCallback) {
    return $http.get(window.HOST + '/api/categories/recommended')
    .then(callback, errorCallback)
  }

})
