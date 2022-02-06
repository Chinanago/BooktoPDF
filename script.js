window.onload = function () {
        var isError = true;
        var selected = -1; //-1 means unselected
        var timeStamp = new Array(); //time stamp is controled by this array. id of canvas tag is Int.

        function popupInit(){
            var popup = document.getElementById('js-popup');
            if(!popup) return;
            popup.classList.add('is-show');
          
            var blackBg = document.getElementById('js-black-bg');

            closePopUp(blackBg);

            function closePopUp(elem) {
              if(!elem) return;
              elem.addEventListener('click', function() {
                if(isError != true){
                    popup.classList.remove('is-show');
                }
              })
            }
        }

        function videoInputAndplayInit(){
            var URL = window.URL || window.webkitURL;
            var filearea = document.getElementById('dropArea');
            var fileInput = document.getElementById('file_upload');

            filearea.addEventListener('dragover', function(e){
                e.preventDefault();
                filearea.classList.add('dragover');
            });
            filearea.addEventListener('dragleave', function(e){
                e.preventDefault();
                filearea.classList.remove('dragover');
            });
            filearea.addEventListener('drop', function(e){
                e.preventDefault();
                filearea.classList.remove('dragover');

                var files = e.dataTransfer.files;
                fileInput.files = files;
            });
            inputNode = document.querySelector('input');

            inputNode.addEventListener('change', function(e){
                var file = e.target.files[0];
                var videoNode = document.querySelector('video');
                var popup = document.getElementById('js-popup');
                //再生可能か判定
                isError = (videoNode.canPlayType(file.type) === '' ? true : false);
                if(isError) return;
                videoNode.src = URL.createObjectURL(file); // inputで選択した動画
                videoNode.pause();
                popup.classList.remove('is-show');
            }, false);
            if(!URL){
                alert("Error! Your browser is not supported.");
                return;
            }
        }

        popupInit();
        videoInputAndplayInit();

        function capture() {
            console.log(timeStamp);
            if(!isError){
                /* 
                次のようなhtmlを追加する
                    <div class="thumblock" id="連番の整数値">
                        <canvas class="thumbnail" style="width: 60px; height: 40px;">
                        <p>"id+1の整数番号"</p>
                    </div>
                */
                var blockElement = document.createElement('div');
                var flagElement = document.createDocumentFragment();

                var gallery = document.querySelector('.gallery'); // galleryエリアに新しく画像を追加
                var picElement = document.createElement('canvas');
                var picContext = picElement.getContext('2d');
                var videoElement = document.querySelector('video');
                var time = videoElement.currentTime;

                var captionElement = document.createElement('p');

                captionElement.classList.add('caption');
                blockElement.classList.add('thumblock');

                picElement.style = "width:60px; height: 40px;"; //実際の表示サイズ
                picElement.width = videoElement.videoWidth; // canvasの幅と高さを、動画の幅と高さに合わせる
                picElement.height = videoElement.videoHeight;
                picElement.classList.add('thumbnail');

                picElement.addEventListener('click', (function(){
                    for(let i=0;i<timeStamp.length;i++){
                        var tempCanvas = document.getElementById(String(i)).firstChild;
                        tempCanvas.classList.remove('selected');
                    };
                    if(selected == parseInt(blockElement.id)){
                        selected = -1;
                    }else{
                        selected = parseInt(blockElement.id);
                        videoElement.currentTime = timeStamp[selected];
                        picElement.classList.add('selected');
                    };
                }), false);

                picContext.drawImage(videoElement,0,0);     
                if(selected == -1){
                    picElement.classList.remove('selected');
                    blockElement.id = String(timeStamp.length); //Arrayの先頭のindex
                    captionElement.append(document.createTextNode(String(timeStamp.length+1)));
                    timeStamp.push(time);

                    flagElement.append(picElement);
                    flagElement.append(captionElement);
                    blockElement.appendChild(flagElement);
                    gallery.appendChild(blockElement);
                }else{
                    blockElement.id = String(selected); //選ばれている要素の肩代わり
                    picElement.classList.add('selected');
                    var selectedBlock = document.getElementById(String(selected));
                    captionElement.append(document.createTextNode(String(selected+1)));                    
                    picContext.drawImage(videoElement, 0, 0); // canvasに関数実行時の動画のフレームを描画

                    flagElement.append(picElement);
                    flagElement.append(captionElement);
                    blockElement.appendChild(flagElement);
                    gallery.insertBefore(blockElement,selectedBlock);
                    selectedBlock.remove();
                    timeStamp[selected] = time;
                }
            }
        }
        function imgDownload(){
            if(selected != -1){
                var block = document.getElementById(String(selected));
                var a = document.createElement('a');
                a.href = block.firstChild.toDataURL("image/jpg");
                a.download = timeStamp.slice(-1)[0]+".jpg";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }else{
                alert('画像を選んでください');
            }
        }
        function imgRemove(){
            if(selected != -1){
                var targetBlock = document.getElementById(String(selected));
                targetBlock.remove();
                timeStamp.splice(selected,1);
                allBlock = document.querySelectorAll('.thumblock');
                allCaption = document.querySelectorAll('.caption');
                for(let i=0;i<timeStamp.length;i++){
                    allBlock[i].id = String(i);
                    allCaption[i].innerText = String(i+1);
                }
                var selectedBlock = document.getElementById(String(selected));
                var videoElement = document.querySelectorAll('video');
                videoElement.currentTime = timeStamp[selected];
                selectedBlock.firstChild.classList.add('selected');
            // selected = -1;
            }
        }
        function imgProcess(){
            if(selected!=-1){
                canvas = du
            }
        }
        var captureButton = document.getElementById('capture');
        var downloadButton = document.getElementById('download');
        var removeButton = document.getElementById('remove');
        captureButton.addEventListener('click', capture, false);
        downloadButton.addEventListener('click', imgDownload, false);
        removeButton.addEventListener('click', imgRemove, false);
};
