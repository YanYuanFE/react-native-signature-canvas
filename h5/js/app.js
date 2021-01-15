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
        var context = canvas.getContext("2d"); //context.getImageData(0,0,canvas.width,canvas.height)
        var imgData = signaturePad ? signaturePad.toData() : null;
        var ratio =  Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        context.scale(ratio, ratio);
        // context.putImageData(imgData,0,0);
        imgData && signaturePad.fromData(imgData);
    }
    
    window.onresize = resizeCanvas;
    resizeCanvas();
    
    signaturePad = new SignaturePad(canvas, {
        onBegin: () => window.ReactNativeWebView.postMessage("BEGIN"),
        onEnd: () => window.ReactNativeWebView.postMessage("END"),
        penColor: '<%penColor%>',
        backgroundColor: '<%backgroundColor%>',
        dotSize: <%dotSize%>,
        minWidth: <%minWidth%>,
    });

    function clearSignature (event) {
        signaturePad.clear();
        window.ReactNativeWebView.postMessage("CLEAR");
    }

    clearButton.addEventListener("click", clearSignature );

    var autoClear = <%autoClear%>;
    
    var trimWhitespace = <%trimWhitespace%>;

    var dataURL = '<%dataURL%>';

    if (dataURL) {
        signaturePad.fromDataURL(dataURL);
    }

    function cropWhitespace(url) {

        var myImage = new Image();
        myImage.crossOrigin = "Anonymous";
        myImage.onload = function(){
            window.ReactNativeWebView.postMessage(removeImageBlanks(myImage)); //Will return cropped image data
        }
        myImage.src = url;

        //-----------------------------------------//
        function removeImageBlanks(imageObject) {
            imgWidth = imageObject.width;
            imgHeight = imageObject.height;
            var canvas = document.createElement('canvas');
            canvas.setAttribute("width", imgWidth);
            canvas.setAttribute("height", imgHeight);
            var context = canvas.getContext('2d');
            context.drawImage(imageObject, 0, 0);

            var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
                data = imageData.data,
                getRBG = function(x, y) {
                    var offset = imgWidth * y + x;
                    return {
                        red:     data[offset * 4],
                        green:   data[offset * 4 + 1],
                        blue:    data[offset * 4 + 2],
                        opacity: data[offset * 4 + 3]
                    };
                },
                isWhite = function (rgb) {
                    // many images contain noise, as the white is not a pure #fff white
                    return !rgb.opacity || (rgb.red > 200 && rgb.green > 200 && rgb.blue > 200);
                },
                        scanY = function (fromTop) {
                var offset = fromTop ? 1 : -1;

                // loop through each row
                for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                    // loop through each column
                    for(var x = 0; x < imgWidth; x++) {
                        var rgb = getRBG(x, y);
                        if (!isWhite(rgb)) {
                            if (fromTop) {
                                return y;
                            } else {
                                return Math.min(y + 1, imgHeight);
                            }
                        }
                    }
                }
                return null; // all image is white
            },
            scanX = function (fromLeft) {
                var offset = fromLeft? 1 : -1;

                // loop through each column
                for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                    // loop through each row
                    for(var y = 0; y < imgHeight; y++) {
                        var rgb = getRBG(x, y);
                        if (!isWhite(rgb)) {
                            if (fromLeft) {
                                return x;
                            } else {
                                return Math.min(x + 1, imgWidth);
                            }
                        }      
                    }
                }
                return null; // all image is white
            };

            var cropTop = scanY(true),
                cropBottom = scanY(false),
                cropLeft = scanX(true),
                cropRight = scanX(false),
                cropWidth = cropRight - cropLeft,
                cropHeight = cropBottom - cropTop;

            canvas.setAttribute("width", cropWidth);
            canvas.setAttribute("height", cropHeight);
            // finally crop the guy
            canvas.getContext("2d").drawImage(imageObject,
                cropLeft, cropTop, cropWidth, cropHeight,
                0, 0, cropWidth, cropHeight);

            return canvas.toDataURL('<%imageType%>');
        }
    }

    function readSignature()  {
        if (signaturePad.isEmpty()) {
            window.ReactNativeWebView.postMessage("EMPTY");
        } else {
            var url = signaturePad.toDataURL('<%imageType%>');
            trimWhitespace? cropWhitespace(url): window.ReactNativeWebView.postMessage(url);
            if (autoClear) {
                signaturePad.clear();
            }
        }
    }

    saveButton.addEventListener("click", readSignature);
`;

export default content;