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
        if (statusChat == 'bot') {
            //fetch API by Axios
            axios.get("http://127.0.0.1:5000" + "/get?msg=" + rawText).then((response) => {
                let botHtml = '<p class="botText"><span>' + response.data + '</span></p>';
                document.getElementById("chatbox").innerHTML += botHtml;
                document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
            });
        }
        else if (statusChat == 'manager') {
            axios.get("http://127.0.0.1:5000" + "/getuserresponse?msg=" + rawText).then((response) => { });
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
        if (String(managerText) != "undefined" && String(managerText) != "") {
            let managerHtml = '<p class="botText"><span>' + managerText + '</span></p>';
            document.getElementById("chatbox").innerHTML += managerHtml;
        }
        document.getElementById('userInput').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
}