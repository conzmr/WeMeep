angular.module("wetopiaApp")

.controller("landingCtrl", function($scope, $document, $window, $state, $stateParams, $location, $timeout, $interval, invitationDataService, $translate, localStorageService, signupDataService, Upload, loginDataService, jwtHelper) {
    $scope.join = false;
    $scope.login = false;
    $scope.request = false;
    $scope.movilMenu = false;
    $scope.scrolled = 0;
    $scope.fadeInOn=true;
    $scope.fadeOutOn=false;
    $scope.h = $window.innerHeight;
    $scope.showParagraph=false;
    $scope.experts = 0;
    $scope.mailRequestError="";
    $scope.footerRequestError="";
    $scope.thanks = false
    $scope.errorHeader=false;
    $scope.errorFooter=false;
    $scope.emailError=false;
    $scope.emailMessageError="";
    $scope.passwordError=false;
    $scope.passwordMessageError="";
    $scope.nameMessageError="";
    $scope.nameError=false;
    $scope.lastnameMessageError="";
    $scope.lastnameError=false;
    $scope.usernameMessageError="";
    $scope.usernameError=false;
    $scope.user={};
    var newUser = signupDataService.user;
    $scope.graphImg={
      Mario : '/static/img/GRAPH/test-grafica_mario.png',
      Constanza : '/static/img/GRAPH/test-grafica_cons.png',
      Luis : '/static/img/GRAPH/test-grafica_luis.png',
      Ilse : '/static/img/GRAPH/test-grafica_ilse.png',
      Pedro : '/static/img/GRAPH/test-grafica_pedro.png',
      All: '/static/img/GRAPH/test-grafica_todos.png'
    }
    var actionParam = $stateParams.actionParam;

    if(actionParam){
      if(actionParam == 'in'){
        $scope.login = true;
      }
      else if(actionParam == 'up'){
        $scope.join = true;
      }
    }

    function isLogged(){
      if(localStorageService.get('username')){
        $state.go('home');
      }
    }

    $scope.selectedMember = 'All';
    $scope.graph=$scope.graphImg[$scope.selectedMember];

    $scope.changeGraph = function(name){
      if($scope.selectedMember == name){
        $scope.selectedMember = 'All';
      }
      else{
        $scope.selectedMember = name;
      }
      $scope.graph=$scope.graphImg[$scope.selectedMember];
      // if($scope.graph == $scope.graphImg[name]){
      //   $scope.graph = $scope.graphImg['All'];
      // }
      // else{
      //   $scope.graph = $scope.graphImg[name];
      // }
    }

    //mails id
    $scope.enMail = '8e523446-ee22-43be-9d98-fe872989fc47';
    $scope.esMail = '3284a8f2-977a-4b4c-a98b-77bfd62f7090';

      $scope.titleWords=[$translate.instant('RANDCREATE'), $translate.instant('RANDJOIN'), $translate.instant('RANDHELP')];
      $scope.subtitles=[[$translate.instant('WORLD'),$translate.instant('INFLUENTIAL'),
      $translate.instant('IMPACT'),$translate.instant('MILLIONARE'),
      $translate.instant('CHALLENGE'),$translate.instant('BUILD_ZERO'),$translate.instant('SHAPE')],
      [$translate.instant('EXPERIENCE'),$translate.instant('SOMETHING'),
      $translate.instant('GROWTH'),$translate.instant('FLEXIBILITY'),
     $translate.instant('COMMON'),$translate.instant('HELP_CREATE')],
      [$translate.instant('EXPAND_NETWORK'), $translate.instant('HELP_BUILD'), $translate.instant('BECOME_EXPERT'),
      $translate.instant('PASSION'),$translate.instant('UPDATED'),$translate.instant('SOMETHING')]];

      $scope.expertsInfo = [{
        photo:'/static/img/IMG_COMMUNITY_PEDRO-min.png',
        quote: $translate.instant('QUOTE_GEPPE'),
        sign: $translate.instant('SIGN_GEPPE'),
        qualitative: $translate.instant('ENTREPRENEUR'),
        logo: '/static/img/Wetopia_LogoBK.svg'
      },
      {
        photo:'/static/img/IMG_COMMUNITY_LUIS-min.png',
        quote: $translate.instant('QUOTE_NISHI'),
        sign: $translate.instant('SIGN_NISHI'),
        qualitative: $translate.instant('ENTREPRENEUR'),
        logo: '/static/img/LOGOS/OhMy_LOGO-min.png'
      },{
        photo:'/static/img/RubenV_IMG-min.png',
        quote: $translate.instant('QUOTE_RUBEN'),
        sign: $translate.instant('SIGN_RUBEN'),
        qualitative: $translate.instant('EXPERT'),
        logo: '/static/img/LOGOS/Logo ChocolatUX.png'
      },{
        photo:'/static/img/AxelG_IMG-min.png',
        quote: $translate.instant('QUOTE_FOO'),
        sign: $translate.instant('SIGN_FOO'),
        qualitative: $translate.instant('ENTREPRENEUR'),
        logo: '/static/img/LOGOS/Feeder.png'
      }
    ]

    $timeout(function() {
        $scope.fadeOutOn=true;
    }, 9500);
    var counter = 0;
    var titlesCounter = 0;
    $scope.wordTitle=$scope.titleWords[counter];
    $scope.sentenceSubtitle=$scope.subtitles[titlesCounter][counter];

    $interval(function(){
      $scope.fadeInOn=true;
      $scope.fadeOutOn=false;
      titlesCounter=(titlesCounter+1)%$scope.titleWords.length;
      counter++;
      $timeout(function() {
          $scope.fadeInOn=false;
      }, 600);

      $timeout(function() {
          $scope.fadeOutOn=true;
      }, 9500);
      $scope.wordTitle=$scope.titleWords[titlesCounter];
      $scope.sentenceSubtitle=$scope.subtitles[titlesCounter][counter%$scope.subtitles[titlesCounter].length];
    }, 10000);

    $timeout(function() {
        $scope.fadeOutExpert=true;
    }, 11500);

    $interval( function(){
      $scope.fadeInExpert=true;
      $scope.fadeOutExpert=false;
      $timeout(function() {
          $scope.fadeInExpert=false;
      }, 600);
      $timeout(function() {
          $scope.fadeOutExpert=true;
      }, 11600);
      $scope.experts=($scope.experts+1)%4;
    }, 12000);


    $scope.clearErrors = function(){
      $scope.emailError=false;
      $scope.mailMessageError="";
      $scope.passwordError=false;
      $scope.passwordMessageError="";
      $scope.nameMessageError="";
      $scope.nameError=false;
      $scope.lastnameMessageError="";
      $scope.lastnameError=false;
      $scope.usernameMessageError="";
      $scope.usernameError=false;
    }

    $scope.closeLogin = function() {
        $scope.login = false;
        $scope.user.email="";
        $scope.user.password="";
        $scope.clearErrors();
    }

    $scope.openSignup = function(){
      $scope.closeLogin();
      $scope.join = true;
      $scope.movilMenu = false;
    }

    $scope.openLogin= function() {
        $scope.closeSignup();
        $scope.login = true;
        $scope.movilMenu = false;
    }

    $scope.closeSignup = function(){
      $scope.join=false;
      $scope.user.email="";
      $scope.user.password="";
      $scope.user.name="";
      $scope.user.lastname="";
      $scope.clearErrors();
    }



  $scope.getPosition = function($event){
  var pos =$event.pageY;
  console.log(pos);

}

$timeout(function(){
   $scope.showParagraph=true;
   $scope.visibility=true;
 }, 1000);

    $document.on('scroll', function() {
        $scope.$apply(function() {
            $scope.scrolled = $window.scrollY;
        })
    });

  $scope.clearRequest = function(){
      $scope.errorFooter=false;
      $scope.errorHeader=false;
      $scope.error=false;
      $scope.userEmail = "";
      $scope.guestEmail = "";
      $scope.mailRequestError="";
      $scope.footerRequestError="";
    }

    $scope.closeRequestModal = function(){
      $scope.request=false;
      $scope.clearRequest();
    }


    $scope.submit = function(email, position) {
      $scope.clearRequest();
      if (email != null) {
        let invitationInfo = {}
        invitationInfo.email = email
        invitationInfo.lang = $translate.proposedLanguage() == 'es' ? $scope.esMail : $scope.enMail
        JSON.stringify(invitationInfo);
        invitationDataService.invitation(invitationInfo, function(res) {
            if (res.status == 201){
              $scope.message = $translate.instant('VALID_EMAIL');
              $scope.clearRequest();
              $scope.thanks = true;
            analytics.track('Invitation:success', {
                location: 'header'
              });
          }
      },function(res) { //error callback
        switch (res.status) {
          case 400:
          $scope.message = $translate.instant('INVALID_EMAIL');
          $scope.mailRequestError="Email already registered.  ";
          if(position=='footer'){
            $scope.errorFooter=true;
          }else if (position =='modal'){
            $scope.error=true;
          }
          else{
            $scope.errorHeader=true;
          }
            analytics.track('Invitation:failed', {
            location: 'header',
            status: 'already-registered',
            type: 'button'
          });

          break;

          case 500:
          $scope.message = $translate.instant('INVALID_EMAIL');
          $scope.mailRequestError="Please enter a valid email address. ";
          if(position=='footer'){
            $scope.errorFooter=true;
          }else if(position=='modal'){
            $scope.error=true;
          }else{
            $scope.errorHeader=true;
          }
        }
      }
    );
    } else{
      $scope.mailRequestError="Please enter a valid email address. ";
      if(position=='footer'){
        $scope.errorFooter=true;
      }else if(position=='modal'){
        $scope.error=true;
      }else{
        $scope.errorHeader=true;
      }
  }
}

$scope.signUp = function (invalidEmail) {
  $scope.clearErrors();
  if(!$scope.user.name){
    $scope.nameMessageError="Please enter your name. ";
    $scope.nameError=true;
  }
  if(!$scope.user.lastname){
    $scope.lastnameMessageError="Please enter your lastname. ";
    $scope.lastnameError=true;
  }
  if(!$scope.user.newEmail){
    $scope.emailMessageError="Please enter an email address. ";
    $scope.emailError = true;
  }
  if(!$scope.user.username){
    $scope.usernameMessageError="Please enter a username. ";
    $scope.usernameError = true;
  }
  if(invalidEmail){
    $scope.emailMessageError="Please enter a valid email address. ";
    $scope.emailError = true;
  }
  if(!$scope.user.newPassword){
    $scope.passwordMessageError="Please enter a password. ";
    $scope.passwordError=true;
  }
  if($scope.user.name&&$scope.user.lastname&&$scope.user.newEmail&&$scope.user.newPassword&&$scope.user.username){
  let userData = {}
  userData.name = $scope.user.name;
  userData.lastname = $scope.user.lastname;
  userData.email = $scope.user.newEmail.toLowerCase(); //IMPORTANT
  userData.username =  $scope.user.username;
  userData.password = $scope.user.newPassword;

  signupDataService.signup(userData, function (res) {
    if (res.status == 200) {
      //Set localStorage keys
      localStorageService.clearAll();
      localStorageService.set('token', res.data.token);
      localStorageService.set('username', res.data.username);
      localStorageService.set('email', res.data.email);
      localStorageService.set('user_id', res.data._id);
      localStorageService.set('name', res.data.name);
      $scope.join=false;
      newUser.isNew = true;
      $state.go("home");
    }
  }, function(res) {
    switch (res.status) {
      case 400:
      $scope.emailError=true;
      $scope.emailMessageError = "Email already registered."
      break;

      case 401:
      $scope.usernameError=true;
      $scope.usernameMessageError = "Username already on use."
      break;

      case 402:
      $scope.usernameError=true;
      $scope.usernameMessageError = "Username already on use."
      $scope.emailError=true;
      $scope.emailMessageError = "Email already registered."
      break;

      case 500:
      $scope.emailError=true;
      $scope.emailMessageError = "Please enter a valid email address."
      break;
    }
}
);
}
}

$scope.signIn = function() {
  var toLogUser= {}
  $scope.clearErrors();
  if(!$scope.user.email){
    $scope.emailMessageError="Please enter your username or email. ";
    $scope.emailError = true;
  }
  if(!$scope.user.password){
    $scope.passwordMessageError="Please enter your password. ";
    $scope.passwordError=true;
  }
  if($scope.user.email&&$scope.user.password){
    toLogUser.password = $scope.user.password;
    toLogUser.username = $scope.user.email;
    toLogUser.email = $scope.user.email;
    loginDataService.authenticate(toLogUser,
    function(res) {
    localStorageService.clearAll();
    localStorageService.set('token', res.data.token);
    localStorageService.set('username', res.data.username);
    localStorageService.set('email', res.data.email);
    localStorageService.set('user_id', res.data._id);
    localStorageService.set('image', res.data.image);
    localStorageService.set('name', res.data.name);
    $state.go('home');
  },
  function(res) { //error callback
    switch (res.status) {
      case 401:
      $scope.emailError=true;
      $scope.emailMessageError = "Wrong username, email or password."
      $scope.passwordMessageError="Wrong username, email or password. ";
      $scope.passwordError=true;
      break;
      case 500:
      $scope.emailError=true;
      $scope.emailMessageError = "Wrong username, email or password."
      $scope.passwordMessageError="Wrong username, email or password. ";
      $scope.passwordError=true;
      break;
      case 400:
      $scope.emailMessageError="Please enter your username or email. ";
      $scope.emailError = true;
        break;
      default:
        alert('We have some troubles, please try again later!')
    }
  })
}
}

$scope.animateHowItWorks = function($element) {
		$element.addClass('visible');
};

})
