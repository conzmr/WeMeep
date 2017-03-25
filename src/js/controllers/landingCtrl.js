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
    $scope.mailRequestError="";
    $scope.thanks = false
    $scope.error=false;

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

    $scope.guest={};

  $scope.clearRequest = function(){
      $scope.request = false;
      $scope.error = false;
      $scope.guest.name = "";
      $scope.guest.email = "";
      $scope.mailRequestError="";
    }


    $scope.submit = function(guest) {
    if (guest != null) {
        let invitationInfo = {};
        invitationInfo.email = this.guest.email;
        invitationInfo.name = this.guest.name;
        JSON.stringify(invitationInfo);
        invitationDataService.invitation(invitationInfo, function(res) {
            if (res.status == 201){
            $scope.error = false;
            $scope.message = $translate.instant('VALID_EMAIL');
            $scope.clearRequest();
            $scope.thanks = true;
          }
      },function(res) { //error callback
        switch (res.status) {
          case 400:
          $scope.error=true;
          $scope.message = $translate.instant('INVALID_EMAIL');
          $scope.mailRequestError="Email already registered.  ";
          break;
          case 500:
          $scope.error=true;
          $scope.message = $translate.instant('INVALID_EMAIL');
          $scope.mailRequestError="Please enter a valid email address. ";

        }
      }
    );
    } else{
      $scope.error=true;
    $scope.mailRequestError="Please enter a valid email address.";
    $scope.message = $translate.instant('INVALID_EMAIL');

  }
}

window.Object.defineProperty( Element.prototype, 'documentOffsetTop', {
    get: function () {
        return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop : 0 );
    }
} );

$scope.infoScroll1 = document.getElementById( 'info-1' ).documentOffsetTop-$scope.h;
$scope.infoScroll2 = document.getElementById( 'info-2' ).documentOffsetTop-$scope.h+$scope.infoScroll1;
$scope.infoScroll3 = $scope.infoScroll2+$scope.h;
$scope.infoScroll4 = $scope.infoScroll3+$scope.h;

function elmYPosition(eID) {
    var elm = document.getElementById(eID);
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent != document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    } return y;
}

})
