import React from 'react';
import logo from './logo.svg';
import './App.css';
import AgoraRTC from 'agora-rtc-sdk'
function App() {

// Queries the container in which the remote feeds belong
var remoteContainer= document.getElementById("remote-container");

/**
 * @name addVideoStream
 * @param streamId
 * @description Helper function to add the video stream to "remote-container"
 */
// function addVideoStream(streamId){
//     let streamDiv=document.createElement("div"); // Create a new div for every stream
//     streamDiv.id=streamId;                       // Assigning id to div
//     streamDiv.style.transform="rotateY(180deg)"; // Takes care of lateral inversion (mirror image)
//     remoteContainer.appendChild(streamDiv);      // Add new div to container
// }
/**
 * @name removeVideoStream
 * @param evt - Remove event
 * @description Helper function to remove the video stream from "remote-container"
 */
function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv=document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
    console.log("Remote stream is removed " + stream.getId());
}




 
  var client = AgoraRTC.createClient({mode: 'live', codec: "h264"});
  client.init('2f025f741ae04920b0be07aed80a88d7', function () {
    console.log("AgoraRTC client initialized");
  
  }, function (err) {
    console.log("AgoraRTC client init failed", err);
  });

  

  client.join(null, 'test', null, function(uid) {
    console.log("User " + uid + " join channel successfully");
    remoteContainer= document.getElementById("remote-container");

    let localStream = AgoraRTC.createStream({
      streamID: uid,
      audio: true,
      video: true,
      screen: false}
    );

    localStream.init(function() {
      console.log("getUserMedia successfully");
      localStream.play('me');
  
      client.publish(localStream, handleFail);
    
    }, function (err) {
      console.log("getUserMedia failed", err);
    });


  
  }, function(err) {
    console.log("Join channel failed", err);
  });



  

  

 
  let handleFail = function(err){
    console.log("Error : ", err);
};

//When a stream is added to a channel
client.on('stream-added', function (evt) {
  client.subscribe(evt.stream, handleFail);
});
//When you subscribe to a stream
client.on('stream-subscribed', function (evt) {
  let stream = evt.stream;
  // addVideoStream(stream.getId());
  stream.play("remote-container");
});
// //When a person is removed from the stream
// client.on('stream-removed',removeVideoStream);
// client.on('peer-leave',removeVideoStream);


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div id={"me"} className={"me"}></div>
        <div id={"remote-container"}>

</div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

       
      </header>
    </div>
  );
}

export default App;
