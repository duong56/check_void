$(document).ready(() => {
  var text;

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var question = [
    "Câu 1: Về nội dung, cấu trúc của học phần: (độ khó; sự cần thiết; phân phối thời gian , …)",
    "Câu 2: Về giáo trình, tài liệu phục vụ học phần (có đầy đủ, rõ ràng, phù hợp không; có dễ dàng tìm thấy trong thư viện hoặc từ nguồn khác không; có kịp thời cho việc chuẩn bị, ôn tập không,...)",
    "Câu 3: Về hoạt động giảng dạy của giảng viên (sự hấp dẫn, rõ ràng trong truyền đạt; sự hợp lý, công bằng trong kiểm tra, đánh giá; sự nhiệt tình và thân thiện; ưu điểm nổi bật của giảng viên,....)",
    "Câu 4: Về cơ sở vật chất phục vụ dạy và học (điều kiện phòng học; chất lượng trang thiết bị trong phòng; hiệu quả đáp ứng của cán bộ phục vụ,…)",
  ]
  var count = 0

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
    text = e.results[0][0].transcript;

    console.log(text)

    $(".pause-button").addClass("class-hidden");
    
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioURL;
    audio.className = "post post-user";
    displayMess.append(audio);
    $scrollDown();

    setTimeout(botTyping, 720);


  };

  //End Audio

  function botTyping() {
    document.getElementById("typing").style.visibility = "visible";
    getBotResponse();
  }

  function getBotResponse() {
    $.get("/get", { msg: text }).done(function (data) {
      var botHtml =
        '<p class="post post-bot"><img src="/static/hp.png" width="64" height="64" align="left" style="margin: 3px;">' +
        data +
        "</p>";
        $("#botTypingHtml").remove();
      $("#message-board").append(botHtml);
      botQuestion(count);
    });
  }
  $("#message").keypress(function (e) {
    if (e.which == 13) {
      text = $("#message").val();
      $("#message").val("");
      var userHtml = '<p class="userText"><span>' + text + "</span></p>";
      $("#message-board").append(userHtml);
      setTimeout(botTyping, 750);
    }
  });

  function botTyping() {
    $("#message-board").append(botTypingHtml);
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
      const html = `<div class="post post-bot">Chào mừng tới ứng dụng !!!</div>`;
      $("#botTypingHtml").remove();
      $("#message-board").append(html);
      botQuestion(count)
      $scrollDown();
    }, 1000);
  }
  postBotWelcome();

  function botQuestion(index){
    $("#message-board").append(botTypingHtml);
    setTimeout(() => {
      if(index <=5){
        const htmlQuestion = `<div class="post post-bot">${question[index]}</div>`;
        $("#message-board").append(htmlQuestion);
        count++;
      } else {
        const htmlQuestion = `<div class="post post-bot">Kết Thúc ^^</div>`;
        $("#message-board").append(htmlQuestion);
      }
      $("#botTypingHtml").remove();
      $scrollDown();
    }, 1000);
  }

});
