const content = `
    var wrapper = document.getElementById("signature-pad"),
        clearButton = wrapper.querySelector("[data-action=clear]"),
        saveButton = wrapper.querySelector("[data-action=save]"),
        canvas = wrapper.querySelector("canvas"),
        signaturePad;
    
    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }
    
    window.onresize = resizeCanvas;
    resizeCanvas();
    
    signaturePad = new SignaturePad(canvas);
    
    // function awaitPostMessage() {
    //     var isReactNativePostMessageReady = !!window.originalPostMessage;
    //     var queue = [];
    //     var currentPostMessageFn = function store(message) {
    //         if (queue.length > 100) queue.shift();
    //         queue.push(message);
    //     };
    //     if (!isReactNativePostMessageReady) {
    //         var originalPostMessage = window.postMessage;
    //         Object.defineProperty(window, 'postMessage', {
    //             configurable: true,
    //             enumerable: true,
    //             get: function () {
    //                 return currentPostMessageFn;
    //             },
    //             set: function (fn) {
    //                 currentPostMessageFn = fn;
    //                 isReactNativePostMessageReady = true;
    //                 setTimeout(sendQueue, 0);
    //             }
    //         });
    //         window.postMessage.toString = function () {
    //             return String(originalPostMessage);
    //         };
    //     }
    //
    //     function sendQueue() {
    //         while (queue.length > 0) window.postMessage(queue.shift());
    //     }
    // };
    // awaitPostMessage();
    
    clearButton.addEventListener("click", function (event) {
        signaturePad.clear();
    });
    
    saveButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Please provide signature first.");
        } else {
            window.postMessage(signaturePad.toDataURL());
        }
    });
    
    window.onerror = function(message, url, line, column, error) {
        console.log(message);
        alert(JSON.stringify({error: error, message: message, url: url, line: line, column: column}));
    };
`;

export default content;
