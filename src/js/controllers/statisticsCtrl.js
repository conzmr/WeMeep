angular.module("musementApp")
    /*
    .config(['ChartJsProvider', function(ChartJsProvider) {

            ChartJsProvider.setOptions({
                innerRadius: "90%"
            });
            // Quite labels, bigger inner radius, quite separation lines
        }])*/
    .controller("statisticsCtrl", ['$scope', '$timeout', function($scope, $timeout) {

        $scope.labels = ["¡Me encanta, lo necesito ya!", "¡Me encanta!, mas no es lo mío",
            "Me gusta, pero aún le falta algo", "No me agrada"
        ];
        $scope.data = [25, 9, 11, 15];
        $scope.colors = ["#8DC63F", "#EF4136", "#FBC326", "#00A9CD"];
        var images = ["like 4_1_single.svg", "like 3_1_single.svg", "like 2_single.svg", "like 1_1_single.svg"];
        var max = 0;
        var total = $scope.data[0];
        (function() {
            var i = 1;
            for (; i < $scope.data.length; i++) {
                if ($scope.data[i] > $scope.data[max]) {
                    max = i;
                }
                total += $scope.data[i];
            }
        })();
        $scope.percentage = Math.floor($scope.data[max] * 100 / total);
        $scope.likeImg = images[max];
        $scope.likeLabel = $scope.labels[max];
        $scope.likeColor = $scope.colors[max];

    }]);
