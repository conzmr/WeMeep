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
    $scope.footerRequestError="";
    $scope.thanks = false
    $scope.errorHeader=false;
    $scope.errorFooter=false;

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

  $scope.clearRequest = function(){
      $scope.errorFooter=false;
      $scope.errorHeader=false;
      $scope.userEmail = "";
      $scope.guestEmail = "";
      $scope.mailRequestError="";
      $scope.footerRequestError="";
    }


    $scope.submit = function(email, position) {
      $scope.clearRequest();
    if (email != null) {
        let invitationInfo = {};
        invitationInfo.email = email;
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
          if(position=='footer'){
            $scope.errorFooter=true;
            $scope.footerRequestError = "Email already registered.  ";
          }else{
            $scope.errorHeader=true;
              $scope.mailRequestError="Email already registered.  ";
          }
            analytics.track('Invitation:', {
            location: 'header',
            status: 'already-registered',
            type: 'button'
          });

          break;

          case 500:
          $scope.message = $translate.instant('INVALID_EMAIL');
          if(position=='footer'){
            $scope.errorFooter=true;
            $scope.footerRequestError = "Please enter a valid email address. ";
          }else{
            $scope.errorHeader=true;
              $scope.mailRequestError="Please enter a valid email address. ";
          }
        }
      }
    );
    } else{
      if(position=='footer'){
        $scope.errorFooter=true;
        $scope.footerRequestError = "Please enter a valid email address. ";
      }else{
          $scope.errorHeader=true;
          $scope.mailRequestError="Please enter a valid email address. ";
      }
  }
}

})
