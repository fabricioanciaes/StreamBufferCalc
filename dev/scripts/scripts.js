    console.log("ready!");

    var trigger = document.querySelector("#calculate");
    var result = document.querySelector("#result");


    trigger.onclick = function() {
        var bitrate = document.querySelector("#bitrate").value;
        var fps = document.querySelector("#fps").value;
        var encode = document.querySelector("#encode").value;
        
        var calcResult = Math.ceil((bitrate/fps) * (encode - 1));

        result.classList.remove("hidden");
        
        result.innerHTML = '<span>Set your custom buffer size to:</span><h2>' + calcResult + '</h2>';
    }