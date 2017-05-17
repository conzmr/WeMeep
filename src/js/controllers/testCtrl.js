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
        $scope.testResults = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

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

        $scope.checkMultiple = function($index) {
            if ($scope.multipleAnswer[$index] == 5) {
                $scope.multipleAnswer[$index] = 0;
            } else {
                $scope.multipleAnswer[$index] = 5;
            }
        }

        $scope.answerQuestion = function(answer, index) {
            $scope.answers[index] = answer;
            $scope.questionNumber++;
            $scope.scalePercentage = Math.round(($scope.questionNumber - 1) * 100 / $scope.questions.length);
            $scope.multipleAnswer = [];
            if (index == $scope.questions.length - 1) {
                $scope.testResults[0] = $scope.calculateTest();
            }
        }

        $scope.calculateTest = function() {
            var results = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            var i = 0;
            var j = 1;
            for (; i < 9; i++) {
                for (j = 1; j < 4; j++) {
                    if (i * j < 27) {
                        results[i] += $scope.answers[i * j];
                    }
                }
            }
            for (i = 27; i < $scope.answers.length; i++) {
                for (j = 0; j < $scope.answers[i].length; j++) {
                    if ($scope.answers[i][j] == 5) {
                        results[j] += 5;
                    }
                }
            }
            for (i = 0; i < 9; i++) {
                results[i] = (results[i] / 8).toFixed(1);
            }
            console.log(results);
            $scope.sortingResults(results);
            return results;
        }

        $scope.sortingResults = function(results) {
            var newList = [];
            for (var j = 0; j < 9; j++) {
                newList[j] = results[j];
            }
            newList.sort();
            console.log(newList);
            for (var i = 0; i < 9; i++) {
                console.log(results[i]);
                if (newList[0] == results[i] && $scope.oportunity1 == undefined) {
                    $scope.oportunity1 = i;
                } else if (newList[1] == results[i] && $scope.oportunity2 == undefined) {
                    $scope.oportunity2 = i;
                } else if (newList[7] == results[i] && $scope.strenght2 == undefined) {
                    $scope.strenght2 = i;
                } else if (newList[8] == results[i] && $scope.strenght1 == undefined) {
                    $scope.strenght1 = i;
                }
            }
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
            question: "I like to evaluate all the options and establish priorities.",
            type: "scale"
        }, {
            question: "I verify that decisions are made and ideas are put into practice.",
            type: "scale"
        }, {
            question: "I investigate outside the group and share information and ideas from other people.",
            type: "scale"
        }, {
            question: "I make sure that everyone is contributing to the discussions and that everyone is acknowledge.",
            type: "scale"
        }, {
            question: "Is better to take a longer time for research and make sure the decision is correct.",
            type: "scale"
        }, {
            question: "I get frustrated by delays before the start of a project\
            and just want to start immediately.",
            type: "scale"
        }, {
            question: "I verify how the plan will work and anticipate potential problems.",
            type: "scale"
        }, {
            question: "I analyze with detail the project and check that nothing goes unnoticed.",
            type: "scale"
        }, {
            question: "I'm often asked for technical or specific aspects of the project.",
            type: "scale"
        }, {
            question: "I like changing the status-quo and try new and creative approaches.",
            type: "scale"
        }, {
            question: "I look for new opportunities and validate how a new idea might work.",
            type: "scale"
        }, {
            question: "I feel comfortable explaining what needs to be done and distributing \
            the work between team members depending on their capabilities.",
            type: "scale"
        }, {
            question: "When there is a problem inside the team, I look for help outside and \
            think of people that might help us.",
            type: "scale"
        }, {
            question: "It's very important to me, that team members feel appreciated and valuable; \
            and will do what I can to make sure this is their experience.",
            type: "scale"
        }, {
            question: "It's easy for me to communicate ideas and explain things in an understandable way.",
            type: "scale"
        }, {
            question: "I question every idea, decision and argument before agreeing to anything.",
            type: "scale"
        }, {
            question: "I need to have the final review of the project before is handed in.",
            type: "scale"
        }, {
            question: "I like to focus in a particular field or technical aspect of the project.",
            type: "scale"
        }, {
            question: "I enjoy brainstorming sessions and to think on creative ideas/solutions.",
            type: "scale"
        }, {
            question: "I enjoy organizing activities and keeping the team together.",
            type: "scale"
        }, {
            question: "I get frustrated by delays before the start of a project and just want to start immediately.",
            type: "scale"
        }, {
            question: "I find it easy to envision the entire project and get other people excited about it.",
            type: "scale"
        }, {
            question: "In the team, I can sense when a conflict is growing and take the responsibility on myself, to cool down the differences. ",
            type: "scale"
        }, {
            question: "I don't like taking the lead role in the team, but I enjoy helping the other members.",
            type: "scale"
        }, {
            question: "I don't contribute with many ideas, but can evaluate in a rich way other people's. ",
            type: "scale"
        }, {
            question: "I take real pride in a job well done.",
            type: "scale"
        }, {
            question: "I don't like to lose concentration on my work or field of expertise.",
            type: "scale"
        }, {
            question: "When there is a disagreement on the team, I...",
            type: "multiple",
            answers: [
                "Consider the issues and suggest ideas, sometimes out-of-the-box, to get in the right direction for solving it.",
                "Keep the team focused on the common goal as members speak and decisions are made.",
                "Try to get members to take fast decisions to get back to work.",
                "Search for outside advice, to benefit the team.",
                "Try to keep everyone motivated and positive.",
                "Listen to all points of view and try to settle the problem.",
                "Analyze the reason of the disagreement and review the suggested options and/or solutions.",
                "Check that the decisions made aren't rushed and that don't affect quality of the project.",
                "Try to find a solution in my area of expertise and if not let the other team members decide."
            ]
        }, {
            question: "When I'm selected in a team, it's usually because...",
            type: "multiple",
            answers: [
                "I'm really good coming up with ideas and doing brainstorming sessions.",
                "I'm really well organized and love coordinating.",
                "I focus on the objective of the task and don't stop until it is done.",
                "I find the resources for the project and have a lot of contacts.",
                "I have the ability to keep the spirit up and encourage the team.",
                "I like to question everything and I'm not easily influenced by the opinions of others.",
                "I like to analyze and propose good, down-to-earth ideas.",
                "I get my job done without constat direction, I'm a good worker.",
                "I have a very specific knowledge necessary to get the job done."
            ]
        }, {
            question: "I contribute to my team by...",
            type: "multiple",
            answers: [
                "Letting my imagination run wild.",
                "Keeping everyone informed on the progress of the group.",
                "Doing my job and getting things going.",
                "Finding outside resources to help the group.",
                "Keeping the team in harmony and resolving conflict.",
                "Doing my job and helping others with their tasks.",
                "Playing the devil's advocate and remaining objective.",
                "Finding concrete solutions, and supervising quality.",
                "Keeping focus on my subject or particular work."
            ]
        }, {
            question: "When a new idea is proposed, but the project already started, how do you react?...",
            type: "multiple",
            answers: [
                "The new idea is probably mine, and if not, it will likely open a new train of thought for improvement.",
                "I think on realistic options to implement the new idea, and how it will fit with what's already done, how does this affect the outcome.",
                "I'm not happy with changing the course of action in the middle of the process.",
                "I start thinking on my contacts and resources in case we implement the new idea.",
                "I moderate the discussion, while solving the conflicts that arise.",
                "I'm excited by the idea and want everyone else motivated.",
                "I take notes and pay attention on the idea, making questions to have everything analyzed.",
                "I'm fine with the change, as long as it doesn't degrade the quality of our work.",
                "I give my specific point of view on how it will affect my work, and wait for the decision to be made."
            ]
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

        $scope.descriptions = [
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",
            "Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.",

        ];


    })
