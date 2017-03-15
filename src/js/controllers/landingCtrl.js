angular.module("musementApp")

.controller("landingCtrl", function($scope, $document, $window) {
    $scope.join = false;
    $scope.scrolled = 0;
    $scope.h = $window.innerHeight;

    $scope.closeThis = function() {
        $scope.join = false;
    }

    $document.on('scroll', function() {
        $scope.$apply(function() {
            $scope.scrolled = $window.scrollY;
            /*
            if ($scope.scrolled >= 500) { // if the percentage is >= 50, scroll to top
                $window.scrollTo(0, 0);
            }*/
        })
    });

    /*
        var vm = this;
        vm.dx = 0;
        vm.dy = 0;
        var CARD = angular.element(document.querySelector('#land-up'));


        vm.styles = getStyles();

        vm.onMove = function(event) {
            var cardInfo = CARD.getBoundingClientRect();

            var halfW = cardInfo.width / 2;
            var halfH = cardInfo.height / 2;

            var x = event.pageX - cardInfo.left;
            var y = event.pageY - cardInfo.top;

            var sceneX = -(halfW - x)
            var sceneY = halfH - y;

            vm.dx = constrain(sceneX, -halfW, halfW);
            vm.dy = constrain(sceneY, -halfH, halfH);

            vm.styles = getStyles();
        };

        function getStyles() {
            var y = map(vm.dx, -100, 100, 100, -100);
            var x = map(vm.dy, -100, 100, 500, -500);
            var z = 0;

            return {
                transform: 'rotateX(' + x + 'deg) rotateY(' + y + 'deg) rotateZ(0deg)'
            };
        };

        function map(n, start1, stop1, start2, stop2) {
            return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        }

    })

    //pivotear=false when is clicked outside the modal window??
    start1)) * (stop2 - start2) + start2;
    } *
    /*/
})

//pivotear=false when is clicked outside the modal window??
