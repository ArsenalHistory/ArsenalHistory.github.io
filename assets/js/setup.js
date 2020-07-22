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
if(document.querySelectorAll('.lazy:not([data-lazy-function])').length > 0) {
    var ll = new LazyLoad({unobserve_entered: true});
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(function () { console.log("Service Worker Registered"); });
}

