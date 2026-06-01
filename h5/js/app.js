export default `
    var wrapper = document.getElementById("signature-pad"),
        clearButton = wrapper && wrapper.querySelector("[data-action=clear]"),
        saveButton = wrapper && wrapper.querySelector("[data-action=save]"),
        canvas = wrapper && wrapper.querySelector("canvas"),
        signaturePad;

    function resizeCanvas() {
        if (!canvas || !canvas.getContext || !signaturePad) {
            return;
        }

        var context = canvas.getContext("2d");
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // Save current signature data before resizing
        var imgData = signaturePad.toData();
        var hasDrawnContent = imgData && imgData.length > 0;

        // Use canvas client dimensions
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        // Resize canvas (this clears the canvas)
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.scale(ratio, ratio);

        // Restore signature content
        if (hasDrawnContent) {
            signaturePad.fromData(imgData);
        } else if (dataURL) {
            signaturePad.fromDataURL(dataURL);
        }
    }

    signaturePad = new SignaturePad(canvas, {
        onBegin: () => window.ReactNativeWebView.postMessage("BEGIN"),
        onEnd: () => window.ReactNativeWebView.postMessage("END"),
        penColor: '<%penColor%>',
        backgroundColor: '<%backgroundColor%>',
        dotSize: <%dotSize%>,
        minWidth: <%minWidth%>,
        maxWidth: <%maxWidth%>,
        minDistance: <%minDistance%>,
    });

    // Initial canvas setup
    const observer = new ResizeObserver(() => {
        resizeCanvas();
    });
    
    observer.observe(canvas);

    function clearSignature () {
        signaturePad.clear();
        dataURL='';
        window.ReactNativeWebView.postMessage("CLEAR");
    }

    function undo() {
        signaturePad.undo();
        window.ReactNativeWebView.postMessage("UNDO");
    }

    function redo() {
        signaturePad.redo();
        window.ReactNativeWebView.postMessage("REDO");
      }

    function changePenColor(color) {
        if (!signaturePad) {
            return;
        }
        signaturePad.penColor = color;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage("CHANGE_PEN");
    }

    function changePenSize(minW, maxW) {
        if (!signaturePad) {
            return;
        }
        if (typeof minW !== 'number' || typeof maxW !== 'number' || minW < 0 || maxW < minW) {
            return;
        }
        signaturePad.minWidth = minW;
        signaturePad.maxWidth = maxW;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage("CHANGE_PEN_SIZE");
    }

    function getData () {
        var data = signaturePad.toData();
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }

    function fromData (pointGroups) {
        signaturePad.fromData(pointGroups);
        window.ReactNativeWebView.postMessage(JSON.stringify(pointGroups));
    }

    function draw() {
      signaturePad.draw();
      window.ReactNativeWebView.postMessage("DRAW");
    }

    function erase() {
      signaturePad.erase();
      window.ReactNativeWebView.postMessage("ERASE");
    }

    function cropWhitespace(url) {
        var myImage = new Image();
        myImage.crossOrigin = "Anonymous";
        myImage.onload = function(){
            window.ReactNativeWebView.postMessage(removeImageBlanks(myImage));
        }
        myImage.src = url;

        function removeImageBlanks(imageObject) {
            var imgWidth = imageObject.width;
            var imgHeight = imageObject.height;
            var canvas = document.createElement('canvas');
            canvas.setAttribute("width", imgWidth);
            canvas.setAttribute("height", imgHeight);
            var context = canvas.getContext('2d');
            context.drawImage(imageObject, 0, 0);

            var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
                data = imageData.data,
                getRGB = function(x, y) {
                    if (x < 0 || x >= imgWidth || y < 0 || y >= imgHeight) {
                        return { red: 255, green: 255, blue: 255, opacity: 255 };
                    }
                    var offset = imgWidth * y + x;
                    return {
                        red:     data[offset * 4],
                        green:   data[offset * 4 + 1],
                        blue:    data[offset * 4 + 2],
                        opacity: data[offset * 4 + 3]
                    };
                },
                isWhite = function (rgb) {
                    return !rgb.opacity || (rgb.red > 200 && rgb.green > 200 && rgb.blue > 200);
                },
                scanY = function (fromTop) {
                    var offset = fromTop ? 1 : -1;
                    for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {
                        for(var x = 0; x < imgWidth; x++) {
                            var rgb = getRGB(x, y);
                            if (!isWhite(rgb)) {
                                if (fromTop) {
                                    return y;
                                } else {
                                    return Math.min(y + 1, imgHeight);
                                }
                            }
                        }
                    }
                    return null;
                },
                scanX = function (fromLeft) {
                    var offset = fromLeft? 1 : -1;
                    for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {
                        for(var y = 0; y < imgHeight; y++) {
                            var rgb = getRGB(x, y);
                            if (!isWhite(rgb)) {
                                if (fromLeft) {
                                    return x;
                                } else {
                                    return Math.min(x + 1, imgWidth);
                                }
                            }
                        }
                    }
                    return null;
                };

            var cropTop = scanY(true),
                cropBottom = scanY(false),
                cropLeft = scanX(true),
                cropRight = scanX(false),
                cropWidth = cropRight - cropLeft,
                cropHeight = cropBottom - cropTop;

            canvas.setAttribute("width", cropWidth);
            canvas.setAttribute("height", cropHeight);
            canvas.getContext("2d").drawImage(imageObject,
                cropLeft, cropTop, cropWidth, cropHeight,
                0, 0, cropWidth, cropHeight);

            return canvas.toDataURL('<%imageType%>');
        }
    }

    function readSignature() {
        if (!signaturePad) {
            return;
        }

        if (signaturePad.isEmpty()) {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage("EMPTY");
        } else {
            var imageType = '<%imageType%>' || 'image/png';
            var url = signaturePad.toDataURL(imageType);

            if (trimWhitespace === true) {
                cropWhitespace(url);
            } else {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(url);
            }

            if (autoClear === true && signaturePad) {
                signaturePad.clear();
            }
        }
    }

    var autoClear = <%autoClear%>;

    var trimWhitespace = <%trimWhitespace%>;

    var dataURL = '<%dataURL%>';

    if (dataURL) signaturePad.fromDataURL(dataURL);

    if (clearButton) {
        clearButton.addEventListener("click", clearSignature);
    }

    if (saveButton) {
        saveButton.addEventListener("click", function() {
            readSignature();
            setTimeout(function() {
                getData();
            }, 10);
        });
    }
`;
