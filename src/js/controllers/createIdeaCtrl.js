angular.module('musementApp')
    .controller('createIdeaCtrl', function($scope, $rootScope, $stateParams, createIdeaDataService, localStorageService, $http, Upload, $state) {

        let user_id = localStorageService.get('user_id');

        $scope.idea = createIdeaDataService.idea;
        $scope.mySwitch = false;
        $scope.inputTeamMembers = false;
        $scope.tags = [];
        $scope.members = [];
        $scope.categorySelected = "";
        $scope.showCategories = false;
        loadTags();
        $scope.errorTitle = false;
        $scope.errorTitleMessage = "";
        $scope.errorCategory = false;
        $scope.errorCategoryMessage = "";
        $scope.errorDescription = false;
        $scope.errorDescriptionMessage = "";
        $scope.errorSolution = false;
        $scope.errorSolutionMessage = "";
        $scope.errorOtherCategory = false;

        $scope.selectCategory = function(category) {
            $scope.clearErrors();
            $scope.categorySelected = category;
            $scope.showCategories = false;
        }

        $scope.changeShowCategories = function() {
            $scope.showCategories = !$scope.showCategories;
        }


        if ($scope.idea.banner == undefined) {
            $scope.idea.banner = "/static/img/Image_default.svg";
        }

        // Load members when creating a project
        $scope.loadMembers = function($query) {
            return $http.get(HOST + '/api/members/' + user_id, {
                cache: true
            }).then(function(response) {
                var members = response.data;
                console.log(members);
                return members.filter(function(member) {
                    return members.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
                });
            });
        }

        // Load categories when creating a moment
        function loadTags($query) {
            return $http.get(HOST + '/api/tags', {
                cache: true
            }).then(function(response) {
                var tags = response.data;
                $scope.categories = [];
                for (var i = 0; i < tags.length; i++) {
                    $scope.categories[i] = tags[i].name;
                }
            })
        }

        $scope.createIdea = function() {
            if (this.idea.banner == undefined) {
                $scope.sumbitIdea("/static/img/cover_Login.svg") //Modificar
            } else if (this.idea.banner.type) {
                $scope.upload(this.idea.banner)
            }

        }

        $scope.clearErrors = function() {
            $scope.errorTitle = false;
            $scope.errorTitleMessage = "";
            $scope.errorCategory = false;
            $scope.errorCategoryMessage = "";
            $scope.errorDescription = false;
            $scope.errorDescriptionMessage = "";
            $scope.errorSolution = false;
            $scope.errorOtherCategory = false;
            $scope.errorSolutionMessage = "";
        }

        $scope.goNext = function() {
            $scope.clearErrors();
            if (!$scope.idea.name) {
                $scope.errorTitleMessage = "Please enter a title for your idea. ";
                $scope.errorTitle = true;
            }
            if (!$scope.idea.description) {
                $scope.errorDescriptionMessage = "Please enter a description for your idea.";
                $scope.errorDescription = true;
            }
            if (!$scope.categorySelected) {
                $scope.errorCategoryMessage = "Please select a category for your idea. ";
                $scope.errorCategory = true;
            }
            if ($scope.categorySelected == 'Others' && ($scope.otherCategory == "" || $scope.otherCategory == undefined)) {
                $scope.errorCategoryMessage = "Please enter what's your project about.";
                $scope.errorOtherCategory = true;
            }
            if ($scope.idea.name && $scope.idea.description && $scope.categorySelected && ($scope.categorySelected != 'Others' || $scope.otherCategory)) {
                $state.go('createIdea.second');
            }
        }

        $scope.upload = function(file) {
            if (!file) { //If user doesnt want to upload a photo, set the gravatar one
                $scope.submitIdea(); //Send no image
            } else {
                Upload.upload({
                        url: window.HOST + '/api/upload',
                        data: {
                            file: file
                        }
                    })
                    .then(function(res) { //upload function returns a promise
                        $scope.submitIdea('/static/uploads/' + res.data.file_name);
                    }, function(errRes) { //catch error
                        $window.alert('Error status: ' + errRes.status);
                    });
            }
        }

        $scope.submitIdea = function(banner) {
            console.log("sumbitIdea Execute");

            if ($scope.categorySelected == 'Others') {
                $scope.idea.categories = $scope.otherCategory;
            } else {
                $scope.idea.categories = $scope.categorySelected;
            }
            $scope.idea.banner = banner;

            createIdeaDataService.setIdea(user_id, function(res) {
                if (res.status == 201) {
                    // $scope.this_user.ideas.push(res.data.idea)
                    $state.go('showIdea');
                }
            });

        }

    })
