export default `
    // Enhanced error handling and validation
    var wrapper = document.getElementById("signature-pad"),
        clearButton = wrapper && wrapper.querySelector("[data-action=clear]"),
        saveButton = wrapper && wrapper.querySelector("[data-action=save]"),
        canvas = wrapper && wrapper.querySelector("canvas"),
        signaturePad;
        
    if (!wrapper || !canvas) {
        console.error('Required DOM elements not found');
    }
    
    // Enhanced canvas resize with debouncing
    function debounce(func, wait) {
        var timeout;
        return function executedFunction() {
            var later = function() {
                clearTimeout(timeout);
                func.apply(this, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function resizeCanvas() {
        if (!canvas || !canvas.getContext) {
            console.warn('Canvas not available for resize');
            return;
        }
        
        try {
            var context = canvas.getContext("2d");
            var imgData = signaturePad ? signaturePad.toData() : null;
            var ratio = Math.max(window.devicePixelRatio || 1, 1);
            
            canvas.width = canvas.offsetWidth * ratio;
            canvas.height = canvas.offsetHeight * ratio;
            context.scale(ratio, ratio);
            
            if (imgData && signaturePad) {
                signaturePad.fromData(imgData);
            }
        } catch (error) {
            console.error('Error resizing canvas:', error);
        }
    }
    
    // Use debounced resize handler
    var debouncedResize = debounce(resizeCanvas, 100);
    window.addEventListener('resize', debouncedResize);
    resizeCanvas();
    
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

    function clearSignature () {
        signaturePad.clear();
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
            console.warn('SignaturePad not initialized');
            return;
        }
        
        signaturePad.penColor = color;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage("CHANGE_PEN");
    }

    function changePenSize(minW, maxW) {
        if (!signaturePad) {
            console.warn('SignaturePad not initialized');
            return;
        }
        
        // Validate numeric values
        if (typeof minW !== 'number' || typeof maxW !== 'number' || minW < 0 || maxW < minW) {
            console.warn('Invalid pen size values:', minW, maxW);
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
            window.ReactNativeWebView.postMessage(removeImageBlanks(myImage)); //Will return cropped image data
        }
        myImage.src = url;

        //-----------------------------------------//
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
                    // many images contain noise, as the white is not a pure #fff white
                    return !rgb.opacity || (rgb.red > 200 && rgb.green > 200 && rgb.blue > 200);
                },
                        scanY = function (fromTop) {
                var offset = fromTop ? 1 : -1;

                // loop through each row
                for(var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

                    // loop through each column
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
                return null; // all image is white
            },
            scanX = function (fromLeft) {
                var offset = fromLeft? 1 : -1;

                // loop through each column
                for(var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

                    // loop through each row
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

    function readSignature() {
        if (!signaturePad) {
            console.warn('SignaturePad not initialized');
            return;
        }
        
        try {
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
        } catch (error) {
            console.error('Error reading signature:', error);
        }
    }

    var autoClear = <%autoClear%>;
    
    var trimWhitespace = <%trimWhitespace%>;

    var dataURL = '<%dataURL%>';

    if (dataURL) signaturePad.fromDataURL(dataURL);

    if (clearButton) {
        clearButton.addEventListener("click", clearSignature);
    }

    // Prevent race conditions by sequencing operations
    if (saveButton) {
        saveButton.addEventListener("click", function() {
            try {
                readSignature();
                // Small delay to prevent race condition
                setTimeout(function() {
                    getData();
                }, 10);
            } catch (error) {
                console.error('Error in save button click:', error);
            }
        });
    }
`;
