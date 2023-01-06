$(document).ready(() => {
  var rawText;

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  const synth = window.speechSynthesis;
  recognition.lang = "vi-VI";
  recognition.continuous = false;

  let mediaRecorder,
  chunks = [],
  audioURL = "";

  //Audio

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
          console.log(e)
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          chunks = [];
          audioURL = window.URL.createObjectURL(blob);
          document.querySelector("audio").src = audioURL;
        };
      })
      .catch((error) => {
        console.log("Following error has occured : ", error);
      });
  } 

  const displayMess = document.querySelector("#message-board");

  let botTypingHtml =
    '<p id="botTypingHtml" class="post post-bot"><img src="/static/hp.png" class="rounded-circle shadow-4" style="width: 40px; margin-right: 10px" alt="Avatar"/><span><img src="/static/typingnow.gif" style="height: 60px"/></span></p>';

  $("#recButton").addClass("notRec");

  $("#recButton").click(function () {
    if ($(".pause-button").hasClass("class-hidden")) {
      $(".pause-button").removeClass("class-hidden");
      recognition.start();
      mediaRecorder.start();
    }
  });

  recognition.onspeechend = () => {
    recognition.stop();
    mediaRecorder.stop();
  };

  recognition.onerror = (err) => {
    console.error(err);
  };

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;

    $(".pause-button").addClass("class-hidden");
    
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioURL;
    audio.className = "post post-user";
    displayMess.append(audio);
    $scrollDown();

    console.log(text)
  };

  //End Audio

  function botTyping() {
    document.getElementById("typing").style.visibility = "visible";
    getBotResponse();
  }

  function getBotResponse() {
    $.get("/get", { msg: rawText }).done(function (data) {
      var botHtml =
        '<p class="botText post post-bot"><img src="/static/hp.png" width="64" height="64" align="left" style="margin: 3px;"><span>' +
        data +
        "</span></p>";
      document.getElementById("typing").style.visibility = "hidden";
      $("#message-board").append(botHtml);
      document
        .getElementById("userInput")
        .scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }
  $("#message").keypress(function (e) {
    if (e.which == 13) {
      rawText = $("#message").val();
      $("#message").val("");
      var userHtml = '<p class="userText"><span>' + rawText + "</span></p>";
      $("#message-board").append(userHtml);
      setTimeout(botTyping, 750);
    }
  });

  function botTyping() {
    document.getElementById("typing").style.visibility = "visible";
    getBotResponse();
  }

  function $postMessage() {
    $("#message").find("br").remove();
    let $message = $("#message").html().trim(); // get text from text box
    $message = $message
      .replace(/<div>/, "<br>")
      .replace(/<div>/g, "")
      .replace(/<\/div>/g, "<br>")
      .replace(/<br>/g, " ")
      .trim();
    if ($message) {
      // if text is not empty
      const html = `<div class="post post-user">${
        $message + timeStamp()
      }</span></div>`; // convert post to html
      $("#message-board").append(html); // add post to board
      $scrollDown(); // stay at bottom of chat
      setTimeout(botTyping, 750);
    }
    $("#message").empty();
  }

  function timeStamp() {
    const timestamp = new Date();
    const hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    const html = `<span class="timestamp">${hours}:${minutes}</span>`;
    return html;
  }

  function $scrollDown() {
    const $container = $("#message-board");
    const $maxHeight = $container.height();
    const $scrollHeight = $container[0].scrollHeight;
    if ($scrollHeight > $maxHeight) $container.scrollTop($scrollHeight);
  }

  $("#send").on("click", $postMessage);

  function postBotWelcome() {
    $("#message-board").append(botTypingHtml);
    setTimeout(() => {
      const html = `<div class="post post-bot">Welcome to my app !!!</div>`;
      const htmlQuestion = `<div class="post post-bot">How do you feel about Math?</div>`;
      $("#botTypingHtml").remove();
      $("#message-board").append(html);
      $("#message-board").append(htmlQuestion);
      $scrollDown();
    }, 1000);
  }
  postBotWelcome();
});
