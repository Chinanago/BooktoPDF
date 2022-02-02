window.onload = function () {
        var URL = window.URL || window.webkitURL;
        var isError = true;
        var selectedFrame = 0;
        var timeStamp = new Array();
            /**
             * 動画選択時に再生する
             */
            playSelectedFile = function playSelectedFileInit(event) {
                var file = event.target.files[0];
                var videoNode = document.querySelector('video');
                isError = (videoNode.canPlayType(file.type) === '' ? true : false);
                if (isError) {
                    return;
                }
                videoNode.src = URL.createObjectURL(file); // inputで選択した動画を再生する
            };
            inputNode = document.querySelector('input');

        if (!URL) {
            alert("Error! Your browser is not supported.");
            return;
        }
        inputNode.addEventListener('change', playSelectedFile, false);

        function capture() {
            if(!isError){
                var cEle = document.createElement('canvas');
                var cCtx = cEle.getContext('2d');
                var vEle = document.querySelector('video');
                
                cEle.id = String(vEle.currentTime);
                cEle.style = "width:60px; height: 40px;"; //実際の表示サイズ
                cEle.width = vEle.videoWidth; // canvasの幅と高さを、動画の幅と高さに合わせる
                cEle.height = vEle.videoHeight;
    
                timeStamp.push(cEle.id);
                
                cEle.addEventListener('click', {time: parseFloat(cEle.id), handleEvent: select}, false);
                cEle.addEventListener('click', {id: cEle.id, handleEvent: setBorder}, false);
                cCtx.drawImage(vEle, 0, 0); // canvasに関数実行時の動画のフレームを描画
    
                var galary = document.getElementById('galary');// galaryエリアに新しく画像を追加
                if(selectedFrame != 0){
                    currentFrame = document.getElementById(selectedFrame);
                    galary.insertBefore(cEle, currentFrame);
                    bye();
                }else{
                    galary.appendChild(cEle);
                }
            }
        }

        function select(){
            var vEle = document.querySelector('video');
            vEle.currentTime = this.time;
            selectedFrame = this.time;
        }
        function setBorder(){
            var selectedImg = document.getElementById(this.id);
            if(selectedImg.style.borderWidth == "3px"){
                selectedImg.style.borderWidth = "0px";
            }else{
                selectedImg.style.border = "blue solid 3px";
            };
        }
        function imgDownload(){
            var canvas = document.getElementById(timeStamp.slice(-1)[0]);
            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpg");
            a.download = timeStamp.slice(-1)[0]+".jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        function bye(){
            selectedCanvas = document.getElementById(String(selectedFrame));
            selectedCanvas.remove();
            selectedFrame = 0;
        }
        var captureButton = document.getElementById('capture');
        var downloadButton = document.getElementById('download');
        var removeButton = document.getElementById('remove');
        captureButton.addEventListener('click', capture, false);
        downloadButton.addEventListener('click', imgDownload, false);
        removeButton.addEventListener('click', bye, false);
};
