//chatbot page function
function getBotResponse() {
    let rawText = String(document.getElementById("textInput").value);
    var userHtml = '<p class="userText"><span>' + rawText + '</span></p>';
    document.getElementById("textInput").value = "";
    document.getElementById("chatbox").innerHTML += userHtml;
    document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
    axios.get("http://127.0.0.1:5000/getstatuschat").then((response) => {
        let data = response.data;
        let statusChat = data[data.length - 1].status;
        console.log(statusChat);
        if (statusChat == 'bot') {
            //fetch API by Axios
            axios.get("http://127.0.0.1:5000" + "/get?msg=" + rawText).then((response) => {
                let botHtml = '<p class="botText"><span>' + response.data + '</span></p>';
                document.getElementById("chatbox").innerHTML += botHtml;
                document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
            });
        }
        else if (statusChat == 'manager') {
            axios.get("http://127.0.0.1:5000" + "/setuserresponse?msg=" + rawText).then((response) => {});
        }
    });
}

function page_load() {
    axios.get("http://127.0.0.1:5000/getstatuschat").then((response) => {
        let data = response.data;
        let statusChat = data[data.length - 1].status;
        if (statusChat == 'bot') {
            //fetch API by Axios
            axios.get("http://127.0.0.1:5000/getemotion").then((response) => {
                let data = response.data;
                renderMessage(data);
            });
        }
        else if (statusChat == 'manager') {
            axios.get("http://127.0.0.1:5000/getemotion").then((response) => {
                let data = response.data;
                renderMessage(data);
                axios.get("http://127.0.0.1:5000/getmessages").then((response) => {
                    let data = response.data;
                    renderMessage1(data);
                });
            });
        }
    });
}

//Manager Page Funtion
function getUserEmotion() {
    axios.get("http://127.0.0.1:5000/getstatuschat").then((response) => {
        let data = response.data;
        let statusChat = data[data.length - 1].status;
        if (statusChat == 'bot') {
            //fetch API by Axios
            axios.get("http://127.0.0.1:5000/getemotion").then((response) => {
                let data = response.data;
                renderMessage(data);
                emotionStatus(data);
            });
        }
        else if (statusChat == 'manager') {
            axios.get("http://127.0.0.1:5000/getemotion").then((response) => {
                document.getElementById("emotion-status").style.visibility = "hidden";
                document.getElementById("textInput").style.visibility = "visible";
                document.getElementById("buttonInput").style.visibility = "visible";
                let data = response.data;
                renderMessage(data);
                axios.get("http://127.0.0.1:5000/getmessages").then((response) => {
                    let data = response.data;
                    renderMessage1(data);
                });
            });
        }
    });
}

function emotionStatus(data) {
    emotion = String(data[data.length - 1].emotion);
    let content = `
    <h3 class="mt-3">User Emotion: <br/> </h3>
    <h3><b class="text-danger p-2">`+ emotion.toUpperCase() + `</b></h3>
    `
    if (emotion == 'anger' || emotion == "annoyance" || emotion == "disappointment" || emotion == "disapproval" || emotion == "disgust" || emotion == "grief" || emotion == "sadness") {
        content += `
        <img width="110px" height="110px" src="https://findicons.com/files/icons/1786/oxygen_refit/128/face_angry.png"/> <br/>
        <input type="button" value="Chat with user" class="btn btn-primary mt-2" onClick="chatWithUser()">
        `
        alert("The user emotion not good!!!");
    }
    else
        content += `<img width="110px" height="110px" src="https://findicons.com/files/icons/360/emoticons/128/satisfied.png"/>`
    document.getElementById("emotion-status").innerHTML = content;
}

function chatWithUser() {
    axios.get("http://127.0.0.1:5000/setstatuschat?msg=manager").then((response) => {
        location.reload();
    });
}

function getManagerResponse() {
    let rawText = String(document.getElementById("textInput").value);
    document.getElementById("textInput").value = "";
    let botHtml = '<p class="botText"><span>' + rawText + '</span></p>';
    document.getElementById("chatbox").innerHTML += botHtml;
    document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
    axios.get("http://127.0.0.1:5000" + "/setmanagerresponse?msg=" + rawText).then((response) => {});
}

//I don't want to hear any ads from you

//helper function
function renderMessage(data) {
    for (let i = 0; i < data.length; i++) {
        let rawText = data[i].user
        var userHtml = '<p class="userText"><span>' + rawText + '</span></p>';
        document.getElementById("chatbox").innerHTML += userHtml;
        let botText = data[i].bot
        let botHtml = '<p class="botText"><span>' + botText + '</span></p>';
        document.getElementById("chatbox").innerHTML += botHtml;
        document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}

function renderMessage1(data) {
    for (let i = 0; i < data.length; i++) {
        let rawText = data[i].user
        if (String(rawText) != "undefined" && String(rawText) != "") {
            var userHtml = '<p class="userText"><span>' + rawText + '</span></p>';
            document.getElementById("chatbox").innerHTML += userHtml;
        }
        let managerText = data[i].manager
        console.log(managerText);
        if (String(managerText) != "undefined" && String(managerText) != "") {
            let managerHtml = '<p class="botText"><span>' + managerText + '</span></p>';
            document.getElementById("chatbox").innerHTML += managerHtml;
        }
        document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}