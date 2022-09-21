 
let options = {
    // Pass your App ID here.
    appId: "8b5f82bf812a46489a7da10dfdf5c774",
    // Set the channel name.
    channel: "testing",
    // Pass your temp token here.
    token: "007eJxTYEituHjC68u595vUZx2LcS1Z8vQEe3tT/He/fqOTG2ckyL1SYDBKtEwxNk9MSrNMMTFJMTOzSDNIMzYwTTQ0NUg0TzMzv7pIKzngi3ZylEwJCyMDBIL47AwlqcUlmXnpDAwAqjAkpQ==",
    // Set the user ID.
    uid: null,
  };
  
  let rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };
  
  const btnCam = document.getElementById("btnCam");
  const btnMic = document.getElementById("btnMic");
  const me = document.getElementById("me");
  const remote = document.getElementById("remote");
  
  const join = async () => {
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    return await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      null
    );
  };
  
  async function startBasicCall() {
    join().then(() => {
      startVideo();
      startAudio();
  
      rtc.client.on("user-published", async (user, mediaType) => {
        if (rtc.client._users.length > 1) {
          roomFull();
        }
  
        await rtc.client.subscribe(user, mediaType);
        remote.classList.remove("waiting");
  
        if (mediaType === "video") {
          const remoteVideoTrack = user.videoTrack;
          remoteVideoTrack.play("remote");
        }
  
        if (mediaType === "audio") {
          const remoteAudioTrack = user.audioTrack;
          remoteAudioTrack.play();
        }
      });
    });
    $('#btnStart').addClass('hidden')
    $('#btnStop').removeClass('hidden')
  }

  const leave = () => {
    stopVideo();
    stopAudio();
    rtc.client.leave();
    $('#btnStart').removeClass('hidden')
    $('#btnStop').addClass('hidden')
  };

  $('#btnStop').click(function(){
    leave();
  })

  $('#btnStart').click(function(){
    startBasicCall();
  })

  btnCam.addEventListener("click", () => {
    btnCam.classList.contains("active") ? stopVideo() : startVideo();
  });
  btnMic.addEventListener("click", () => {
    btnMic.classList.contains("active") ? stopAudio() : startAudio();
  });
  
  const roomFull = () => {
    leave();
    remote.classList.add("full");
  };
  
  
  
  const stopAudio = () => {
    rtc.localAudioTrack.close();
    rtc.client.unpublish(rtc.localAudioTrack);
    btnMic.classList.remove("active");
    $('#btnMic').css('background-color','rgb(247, 0, 0)');
  };
  
  const startAudio = async () => {
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtc.client.publish(rtc.localAudioTrack);
    btnMic.classList.add("active");
    $('#btnMic').css('background-color','rgb(69, 69, 69)');
  };
  
  const stopVideo = () => {
    rtc.localVideoTrack.close();
    rtc.client.unpublish(rtc.localVideoTrack);
    btnCam.classList.remove("active");
    $('#btnCam').css('background-color','rgb(247, 0, 0)');
  };
  const startVideo = async () => {
    me.classList.add("connecting");
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    rtc.client.publish(rtc.localVideoTrack);
    me.classList.remove("connecting");
    rtc.localVideoTrack.play("me");
    btnCam.classList.add("active");
    $('#btnCam').css('background-color','rgb(69, 69, 69)');
  };