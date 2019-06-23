import React from 'react';
import logo from './logo.svg';
import './App.css';
import './w3.css';
import AgoraRTC from 'agora-rtc-sdk'
import * as posenet from '@tensorflow-models/posenet';


// import Amplify from 'aws-amplify';
import Amplify, { XR } from 'aws-amplify';
import aws_exports from './aws-exports';


import { SumerianScene } from 'aws-amplify-react';
import scene_config from './sumerian_exports';

import AWS from 'aws-sdk'








function App() {

  const Polly = new AWS.Polly({ signatureVersion: 'v4', region: 'us-east-1' })

  Amplify.configure(aws_exports);
XR.configure({ // XR category configuration
  SumerianProvider: { // Sumerian-specific configuration
    region: 'us-east-1', // Sumerian scene region
    scenes: {
      "SumerianAmplify2": {   // Friendly scene name
          sceneConfig: scene_config // Scene JSON configuration
        },
    }
  }
});
  
  // // Load scene with sceneName: "scene1" into dom element id: "sumerian-scene-dom-id"
  // const fetchData = async () => {
  //   console.log("123")
  //   await XR.loadScene("SumerianAmplify", "sumerian-scene-dom-id");
  //   XR.start("SumerianAmplify");
  //   console.log("456")
  // }
  

  var local_video=document.getElementById('video'+0);


 
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


function getpose(local_video){

  posenet.load().then(function(net) {
    
    console.log("pose","pose",local_video);
    const poses = net.estimatePoses(local_video, {
      decodingMethod: 'single-person'
    });
    const pose = poses[0];
    return pose;
  }).then(function(pose){
    console.log(pose,"pose",local_video);
   
   
  })
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
    local_video=document.getElementById('video'+uid);
        
    if(local_video !=null){
      local_video.width=100;
      local_video.height=100;
    }

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
     
     getpose(local_video);
    //  fetchData();
    
      
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

    
    <div className="App, w3-container, w3-margin-top">
      <header className="App-header">
      <div className="w3-col">
        <div className="w3-row" style={{width:'35%', display:'none'}}>
          hello
        </div>
        <div className="w3-row, w3-right" style={{width:'65%'}}>
          <div id={"me"} className={"me, w3-panel, w3-bottombar, w3-topbar, w3-leftbar, w3-rightbar"} style={{width:'400px',height:'300px'}}></div>
        </div>
      </div>
      <br></br>

      <div className="w3-col">
        <div className="w3-row" style={{width:'20%', display:'none'}}>
          hello
        </div>
        <div className="w3-row, w3-right" style={{width:'80%'}}>
          <div id={"remote-container"} style={{width:'800px',height:'600px'}}></div>
        </div>
      </div>




        

        <div id={"sumerian-scene-dom-id"} style={{width:'270px',height:'400px',display:'inline-block'}}></div>

        {/* <div style={{width:'270px',height:'400px',display:'inline-block'}}>
        <SumerianScene sceneName="scene2" />
        </div> */}
        <div style={{zIndex: '-3'}}>
        <div style={{height: '600px'}}>  
          <SumerianScene sceneName='SumerianAmplify2' />
        </div>
        </div>
       
      </header>
    </div>
  );
}

export default App;
