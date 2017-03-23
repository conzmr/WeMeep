angular.module("musementApp")

.controller("landingCtrl", function($scope, $document, $window,  $location, anchorSmoothScroll, $timeout, $interval, invitationDataService, $translate, localStorageService) {
    $scope.join = false;
    $scope.login = false;
    $scope.request = false;
    $scope.movilMenu = false;
    $scope.scrolled = 0;
    $scope.h = $window.innerHeight;
    $scope.showParagraph=false;
    $scope.experts = 0;

    $interval( function(){
      $scope.experts=($scope.experts+1)%2;
    }, 8000);


    $scope.closeLogin = function() {
        $scope.login = false;
        $scope.join = true;
    }

    $scope.closeSignup = function() {
        $scope.login = true;
        $scope.join = false;
    }

    $scope.gotoElement = function (eID){


    $location.hash(eID);

    anchorSmoothScroll.scrollTo(eID);
  }

  $scope.gotoElementMovilMenu = function (eID){


  $location.hash(eID);
  $scope.movilMenu = false;
  anchorSmoothScroll.scrollTo(eID);
}

  $scope.getPosition = function($event){
  var pos =$event.pageY;
  console.log(pos);

}

$timeout(function(){ $scope.showParagraph=true; }, 1000);

    $document.on('scroll', function() {
        $scope.$apply(function() {
            $scope.scrolled = $window.scrollY;
        })
    });


    $scope.submit = function(guest) {
    if (guest != null) {
        let invitationInfo = {};
        invitationInfo.email = this.guest.email;
        invitationInfo.name = this.guest.name;
        console.log(JSON.stringify(invitationInfo));
        invitationDataService.invitation(invitationInfo, function(res) {
            if (res.status == 201)
                $scope.message = $translate.instant('VALID_EMAIL');
            $window.alert("Revisa tu bandeja de correo. ");
            $scope.request=false;
        });
    } else
        $window.alert("Por favor, ingresa un correo válido. ");
    $scope.message = $translate.instant('INVALID_EMAIL');
}



})
