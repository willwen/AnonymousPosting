window.onload = function() {
    setLocalStorageID()
    document.getElementById("enterPostButton").onclick = function() {

        sendPOSTXMLReq("/addPost", document.getElementById("postTextField").value)
        document.getElementById("postTextField").value = ""

    };

    sendGETXMLReq("/getPosts");
}


function sendPOSTXMLReq(path, postText) {
    httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert("Giving up :( Cannot create an XMLHTTP instance");
        return false;
    }

    httpRequest.onreadystatechange = alertContents;
    httpRequest.open("POST", path);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var id = localStorage.getItem('id');
    var currentdate = new Date();
    //console.log(currentdate.toString())
    var reqData = [postText, id, currentdate.toString()]
    httpRequest.send(JSON.stringify(reqData));
}

function sendGETXMLReq(path) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert("Giving up :( Cannot create an XMLHTTP instance");
        return false;
    }
    //alert("query word is "+ value);
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open("GET", path);
    httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpRequest.send();

}


function alertContents() {
    try {
        //debugger;
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var posts = JSON.parse(httpRequest.responseText)
                    //localStorage.setItem('posts', httpRequest.responseText);
                reBuildPostsList(posts);
            } else {
                alert("There was a problem with the request.");
            }
        }
    } catch (e) {
        alert("Caught Exception: " + e.message);
    }
}

function reBuildPostsList(postsList) {
    var postsDiv = document.getElementById("posts");
    while (postsDiv.hasChildNodes()) {
        postsDiv.removeChild(postsDiv.lastChild);
    }
    var i, toAppendString = "";

    for (i = 0; i < postsList.length; i++) {

        /**
        <div class="media">
          <a class="pull-left" href="#">
              <img class="media-object" src="http://placehold.it/64x64" alt="">
          </a>
          <div class="media-body">
              <h4 class="media-heading">Start Bootstrap
                  <small>August 25, 2014 at 9:30 PM</small>
              </h4>
              Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
          </div>
      </div>    
        */
        toAppendString += "<div class = 'media'>" +
            "<a class = 'pull-left' href = '#'>"+
              "<img class='media-object' src='http://placehold.it/64x64' alt=''>" +
            "</a>" +
            "<div class = 'media-body'>" +
              "<h4 class = 'media-heading'>" + "User: " + postsList[i][1] +
                  "<small>  "+postsList[i][2]+"</small>"+
              "</h4>" + 
              "Message: " + postsList[i][0] +
            "</div>" + 
          "</div>";
    }

    postsDiv.innerHTML += toAppendString;
}

function setLocalStorageID() {
    if (localStorage && localStorage.getItem('id')) {
        var id = localStorage.getItem('id')
        console.log("this user's id is " + id)
    } else {
        var id = getRandomArbitrary(1, 9999);
        console.log("assigning a new user id:" + id)
        localStorage.setItem('id', id);

    }
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}