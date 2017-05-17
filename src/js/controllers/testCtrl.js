angular.module('musementApp')
    .controller('testCtrl', function($scope, $state) {

        $scope.notification = false;
        $scope.showNotifications = false;
        $scope.showUserMenu = false;
        $scope.questionNumber = 0;
        $scope.answers = [];
        $scope.multipleAnswer = [];
        $scope.scalePercentage = 0;
        $scope.wantToSave = false;

        $scope.showWantToSave = function() {
            $scope.wantToSave = true;
        }

        $scope.changeShowNotifications = function() {
            $scope.showNotifications = !$scope.showNotifications;
        }

        $scope.saveTest = function() {
            $scope.wantToSave = false;
            $state.go('myProfile');
        }

        $scope.changeShowMenu = function() {
            $scope.showUserMenu = !$scope.showUserMenu;
        }

        $scope.answerQuestion = function(answer, index) {
            $scope.answers[index] = answer;
            $scope.questionNumber++;
            $scope.scalePercentage = Math.round(($scope.questionNumber - 1) * 100 / $scope.questions.length);
            $scope.multipleAnswer = [];
            console.log($scope.answers);
        }

        $scope.beginTest = function() {
            $scope.questionNumber++;
        }

        $scope.goPrevious = function() {
            $scope.questionNumber--;
            $scope.scalePercentage = Math.round(($scope.questionNumber - 1) * 100 / $scope.questions.length);
        }

        $scope.questions = [{
            question: "I like to think in new and original solutions or ideas.",
            type: "scale"
        }, {
            question: "I feel comfortable explaining what needs to be done and \
            distributing the work between team members depending on their capabilities.",
            type: "scale"
        }, {
            question: "I get frustrated by delays before the start of a project\
            and just want to start immediately.",
            type: "scale"
        }, {
            question: "When in a group meeting, what is your typical contribution?",
            type: "multiple",
            answers: [
                "I bring creative solutions and ideas to the table.",
                "I take notes and make sure the focus on the meeting isn't lost.",
                "I propose ways to start working sooner, so we don't lose time.",
                "I share knowledge and info that I have learned from my contacts.",
                "I ensure that we have enough time to complete the project and have time\
              to test quality control.",
                "I give realistic solutions to problems or solutions that arise.",
                "I give technical aspects of the project that should be kept in mind.",
                "I try to keep a positive point of view on the discussions.",
                "I make sure everyone is heard and have equal opportunity to participate."
            ]
        }]

        $scope.select = function(item) {
            $scope.selected = item;
        };

        $scope.isActive = function(item) {
            return $scope.selected === item;
        };

        $scope.colors = [{
            backgroundColor: "#f48465",
            pointBackgroundColor: "rgba(250,109,33,0)",
            pointHoverBackgroundColor: "rgba(250,109,33,0)",
            borderColor: "#f48465",
            pointBorderColor: "rgba(250,109,33,0)",
            pointHoverBorderColor: "rgba(250,109,33,0)"
        }, "rgba(250,109,33,0)", "#9a9a9a", "rgb(233,177,69)"];

        $scope.options = {
            tooltips: {
                enabled: false
            },

            scale: {
                gridLines: {
                    color: '#9B9B9B',
                    lineWidth: 1,
                    zeroLineWidth: 30,
                    zeroLineColor: '#8DC63F'
                },
                ticks: {
                    beginAtZero: !0,
                    display: !1
                },
                pointLabels: {
                    fontSize: 15,
                    fontColor: '#9B9B9B'
                },
                angleLines: {
                    display: false
                },
            }
        }

        Chart.defaults.global.responsive = true;
        Chart.defaults.global.defaultFontColor = "#9B9B9B";
        Chart.defaults.global.defaultFontFamily = "Museo_700";
        Chart.defaults.global.defaultFontSize = "16";

        $scope.labels = ["Specialist", "Creative", "Coordinator", "Manager", "Networker", "Researcher", "Support", "Analyzer", "Perfectionist"];

        $scope.data = [
            [65, 59, 90, 81, 56, 55, 40, 30, 12]
        ];

    })
