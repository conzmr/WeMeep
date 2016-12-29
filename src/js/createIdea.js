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

function changeVisibility(itemId) {
    var element = document.getElementById(itemId);
    var display = document.defaultView.getComputedStyle(element, "null")["display"];
    if (display == "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

function changeMarginTop() {
    var element = document.getElementById("describeIdea-form");
    var marginTop = document.defaultView.getComputedStyle(element, "null")["margin-top"];
    if (marginTop == "0px") {
        element.style.marginTop = "3%";
    } else {
        element.style.marginTop = "0px";
    }
}

function switchVisibility() {
    changeVisibility('show-problem');
    changeMarginTop();
}
