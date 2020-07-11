//load youtube videos on click
var images = document.querySelectorAll('.activator');
var imagesLength = images.length;
for (var i = 0; i < imagesLength; i++) {
    var element = images[i];
    element.addEventListener("click", function (item) {
        var videoid = item.target.getAttribute("data-id");
        if (videoid !== null) {
            var frame = document.getElementById(videoid);
            var src = frame.getAttribute("src");
            if (src === undefined || src === null) {
                frame.setAttribute("src", frame.getAttribute("data-video"));
            }
        }

    });
}

//load images after page load
var elements = document.querySelectorAll('.responsive-img[data-src]');
var elementLength = elements.length;
for (var i = 0; i < elementLength; i++) {
    var element = elements[i];
    console.log(element.getAttribute("data-src"));
    element.setAttribute("src", element.getAttribute("data-src"));
}

var elems = document.querySelectorAll('.dropdown-trigger');
if (elems.length > 0) {
    var instances = M.Dropdown.init(elems);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function () { console.log("Service Worker Registered"); });
}

