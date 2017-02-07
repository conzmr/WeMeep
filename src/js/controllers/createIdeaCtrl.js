angular.module('musementApp')
    .controller('createIdeaCtrl', function($scope) {
        $scope.mySwitch = false;
        $scope.inputTeamMembers = false;
    })
    /*
    function getMemberName() {
        var input, filter, ul, li, p, i;
        input = document.getElementById("name-member-input");
        filter = input.value.toUpperCase();
        ul = document.getElementById("members-list");
        li = ul.getElementsByTagName("li");
        for (i = 0; i < li.length; i++) {
            p = li[i].getElementsByTagName("p")[0].innerHTML + li[i].getElementsByTagName("p")[1].innerHTML;
            if (p.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";

            }
        }
    }
    */
