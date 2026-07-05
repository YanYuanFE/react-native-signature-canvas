export default `
    var wrapper = document.getElementById("signature-pad"),
        clearButton = wrapper && wrapper.querySelector("[data-action=clear]"),
        saveButton = wrapper && wrapper.querySelector("[data-action=save]"),
        canvas = wrapper && wrapper.querySelector("canvas"),
        signaturePad;

    // Single bridge entry point. Guards the rare window where the RN WebView
    // bridge is missing (injection race / WebView torn down) and surfaces the
    // dropped message instead of swallowing it.
    function postMessage(data) {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(data);
        } else {
            console.warn("[signature-canvas] RN bridge unavailable, dropped message: " + data);
        }
    }

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
        onBegin: () => postMessage("BEGIN"),
        onEnd: () => postMessage("END"),
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
        postMessage("CLEAR");
    }

    function undo() {
        signaturePad.undo();
        postMessage("UNDO");
    }

    function redo() {
        signaturePad.redo();
        postMessage("REDO");
      }

    function changePenColor(color) {
        if (!signaturePad) {
            return;
        }
        signaturePad.penColor = color;
        postMessage("CHANGE_PEN");
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
        postMessage("CHANGE_PEN_SIZE");
    }

    function getData () {
        var data = signaturePad.toData();
        postMessage(JSON.stringify(data));
    }

    function fromData (pointGroups, suppressClear) {
        signaturePad.fromData(pointGroups, suppressClear);
        postMessage(JSON.stringify(pointGroups));
    }

    function draw() {
      signaturePad.draw();
      postMessage("DRAW");
    }

    function erase() {
      signaturePad.erase();
      postMessage("ERASE");
    }

    function cropWhitespace(url) {
        var myImage = new Image();
        myImage.crossOrigin = "Anonymous";
        myImage.onload = function(){
            postMessage(removeImageBlanks(myImage));
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
            postMessage("EMPTY");
        } else {
            var imageType = '<%imageType%>' || 'image/png';
            var url = signaturePad.toDataURL(imageType);

            if (trimWhitespace === true) {
                cropWhitespace(url);
            } else {
                postMessage(url);
            }

            if (autoClear === true && signaturePad) {
                signaturePad.clear();
            }
        }
    }

    var autoClear = <%autoClear%>;

    var trimWhitespace = <%trimWhitespace%>;

    // <%dataURL%> is injected as an already-quoted JSON string literal
    var dataURL = <%dataURL%>;

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
