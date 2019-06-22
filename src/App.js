import React from 'react';
import logo from './logo.svg';
import './App.css';
import AgoraRTC from 'agora-rtc-sdk'
function App() {
 
  var client = AgoraRTC.createClient({mode: 'live', codec: "h264"});
  client.init('2f025f741ae04920b0be07aed80a88d7', function () {
    console.log("AgoraRTC client initialized");
  
  }, function (err) {
    console.log("AgoraRTC client init failed", err);
  });

  

  client.join(null, 'test', null, function(uid) {
    console.log("User " + uid + " join channel successfully");
   

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

  // client.publish(localStream, function (err) {
  //   console.log("Publish local stream error: " + err);
  // });
  
  // client.on('stream-published', function (evt) {
  //   console.log("Publish local stream successfully");
  // });


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div id={"me"} className={"me"}></div>
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
