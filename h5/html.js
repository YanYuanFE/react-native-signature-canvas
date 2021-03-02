const content = script =>
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Signature Pad demo</title>
  <meta name="description" content="Signature Pad - HTML5 canvas based smooth signature drawing using variable width spline interpolation.">

  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">

  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">

  <style>
    body {
      font-family: Helvetica, Sans-Serif;
    
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      margin:0;
      overflow:hidden;
    }
    body,html {
      width: 100%;
      height: 300px;
    }
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    
    .rotated-true {
      transform: rotate(90deg);
      transform-origin:bottom left;
      
      position:absolute;
      top: -100vw;
      left: 0;
      
      height:100vw;
      width:100vh;
      
      overflow:auto;
    }
    .rotated-false {
      width: 100%;
      height: 100%;
    }
    .m-signature-pad {
      font-size: 10px;
      width: 100%;
      height: 100%;
      border: 1px solid #e8e8e8;
      background-color: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
    }
    
    .m-signature-pad--body {
      position: relative;
      height: 100%;
      border: 1px solid #f4f4f4;
    }
    
    .m-signature-pad--body
      canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.02) inset;
      }
    
    .m-signature-pad--footer {
      padding: 0px 20px;
      margin-top: 10px;
      position: relative;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .m-signature-pad--footer
      .description {
        color: #C3C3C3;
        text-align: center;
        font-size: 1.2em;
      }
    
    .m-signature-pad--footer
      .button {
        background-color: #3F99F7;
        height: 32px;
        padding: 0 20px;
        line-height: 32px;
        text-align: center;
        color: #FFF;
        border: 1px solid transparent;
        border-radius: 4px;
        outline: none;
        box-shadow: none;
      }
    
    .m-signature-pad--footer
      .button.clear {
      }
    
    .m-signature-pad--footer
      .button.save {
      }
    
    @media screen and (max-width: 1024px) {
      .m-signature-pad {
        width: 100%;
        height: 100%;
      }
      #github {
        display: none;
      }
    }
    
    @media screen and (min-device-width: 768px) and (max-device-width: 1024px) {
      .m-signature-pad {
        margin: 10%;
      }
    }
    
    @media screen and (max-height: 320px) {
      .m-signature-pad--body {
        left: 0;
        right: 0;
        top: 0;
        bottom: 32px;
      }
      .m-signature-pad--footer {
        left: 20px;
        right: 20px;
        bottom: 4px;
        height: 28px;
      }
      .m-signature-pad--footer
        .description {
          font-size: 1em;
          margin-top: 1em;
        }
    }
    <%style%>
    </style>
</head>
<body onselectstart="return false">
<div class="rotated-<%orientation%>">
    <div id="signature-pad" class="m-signature-pad">
      <div class="m-signature-pad--body">
        <canvas></canvas>
      </div>
      <div class="m-signature-pad--footer">
        <button type="button" class="button clear" data-action="clear"><%clear%></button>
        <div class="description"><%description%></div>
        <button type="button" class="button save" data-action="save"><%confirm%></button>
      </div>
    </div>
  </div>

  <script>
    ${script}
  </script>
</body>
</html>`;

export default content;
