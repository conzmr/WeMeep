angular.module("musementApp")

.controller("landingCtrl", function($scope, $document, $window,  $location, $timeout, $interval, invitationDataService, $translate, localStorageService) {
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
      $scope.experts=($scope.experts+1)%4;
    }, 12000);


    $scope.closeLogin = function() {
        $scope.login = false;
        $scope.join = true;
    }

    $scope.closeSignup = function() {
        $scope.login = true;
        $scope.join = false;
    }


  $scope.getPosition = function($event){
  var pos =$event.pageY;
  console.log(pos);

}

$timeout(function(){ $scope.showParagraph=true;
$scope.visibility=true;
 }, 1000);

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


    $scope.submit = function(guest, position) {
    if (guest != null) {
        let invitationInfo = {};
        invitationInfo.email = this.guest.email;
        JSON.stringify(invitationInfo);
        invitationDataService.invitation(invitationInfo, function(res) {
            if (res.status == 201){
              $scope.error = false;
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
          $scope.error=true;
          $scope.message = $translate.instant('INVALID_EMAIL');
          $scope.mailRequestError="Email already registered.  ";

          analytics.track('Invitation:already-registered', {
            location: 'header'
          });

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

})
