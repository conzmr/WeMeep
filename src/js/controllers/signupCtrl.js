'user strict';
angular.module('musementApp')
.controller('signupCtrl', function($scope, signupDataService, localStorageService, $state, $window, Upload, momentDataService) {

  $scope.user = {};
  //OUR FUNCTIONS
  $scope.next = true;
  $scope.submit = true;
  $scope.submitted = false;


  var validateInfo = function (newVal) {
    if (newVal.length > 0) {
        // Check to make sure that all of them have content
        for (var i = 0, l = newVal.length; i < l; i++) {
            if (newVal[i] === undefined || newVal[i] === '') {
                return false;
            }
        }
        // We didn't find invalid data, let's move on
        return true;
    }
    return false;
};

// Initialize the disabled "Next" buttons
$scope.firstValidation = false;
$scope.secondValidation = false;

// Watch a multiple items in a form, if ALL are filled in we will let them proceed
// Note that the order in this array is the order the newVal will be,
// So further validation for formData.number would be on newVal[1]
$scope.$watchGroup(['user.email', 'user.password', 'user.confirm_password'], function (newVal) {
    $scope.firstValidation = validateInfo(newVal);
});
$scope.$watchGroup(['user.name', 'user.surname'], function (newVal) {
    $scope.secondValidation = validateInfo(newVal);
});

  $scope.submit = function() {
    // Set the 'submitted' flag to true
    $scope.submitted = true;

    if (this.user.password === this.user.confirm_password)
        $scope.next()
  }


  $scope.random = function () {
    // console.log(1 - Math.random())
    return 1 - Math.random()
  }

  $scope.next = function() {
    if (this.user.email && this.user.password ) {
        $scope.next = false
    } else {
      // console.log('no...')
    }
  }

  $scope.signUp = function() {
    if (this.user.image == undefined) {
       $scope.sign("/static/img/photo_Login.svg")
    }else if (this.user.image.type) {
      $scope.upload(this.user.image)
    }

  }

  $scope.upload = function(file){
    if (!file) { //If user doesnt want to upload a photo, set the gravatar one
        $scope.sign(); //Send no image
    } else {
      Upload.upload({url: window.HOST + '/api/upload', data:{ file: file }})
      .then(function (res) { //upload function returns a promise
            $scope.sign('/static/uploads/' + res.data.file_name);
        }, function (errRes) { //catch error
            $window.alert('Error status: ' + errRes.status);
      });
    }
  }

  $scope.sign = function (image) {

    let signupInfo = {}
    // console.log(this.user.username);
    signupInfo.username = this.user.username.toLowerCase(); //IMPORTANT
    signupInfo.email = this.user.email.toLowerCase(); //IMPORTANT
    signupInfo.password = this.user.password;
    signupInfo.surname = this.user.surname;
    signupInfo.name = this.user.name;
    signupInfo.image = image


    signupDataService.signup(signupInfo, function (res) {
      if (res.status == 200) {
        //Set localStorage keys
        localStorageService.clearAll()
        localStorageService.set('token', res.data.token)
        localStorageService.set('username', res.data.username)
        localStorageService.set('user_id', res.data._id)
        $state.go('home')
      }
    }, function(res) {
      console.log('Err in signup', res);
      $window.alert('Error')
    })

  }
})
