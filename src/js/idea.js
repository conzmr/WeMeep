var openPivButton = document.getElementById('openPivModal');
var pivModal = document.getElementById('Pivotear-modal');
var closePivModal = document.getElementById('piv-modal-cancel');
var newPivBtn = document.getElementById('new-piv-btn');

openPivButton.onclick = function() {
    pivModal.style.display = 'block';
}

window.onclick = function(event) {
    if (event.target == pivModal || event.target == closePivModal || event.target == newPivBtn) {
        pivModal.style.display = "none";
    }
}
