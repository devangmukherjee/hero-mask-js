const landmark = async() => {
  //await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  
  const image = document.querySelector('.face');
  const canvas = faceapi.createCanvasFromMedia(image);
  const detection = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

  const rightEye=detection[0].landmarks.getRightEye()
  const leftEye=detection[0].landmarks.getLeftEye()
  const jawline=detection[0].landmarks.getJawOutline()
  const eyebrow=detection[0].landmarks.getLeftEyeBrow()
  const nose = detection[0].landmarks.getNose()

  

  const jawLeft = jawline[0]
  const jawRight = jawline[16]
  const adjacent = jawRight.x - jawLeft.x
  const opposite = jawRight.y - jawLeft.y
  const jawLength = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))
  const jawangle=(opposite/adjacent)*100
  const right_x_avg=(rightEye[0].x+rightEye[1].x+rightEye[3].x+rightEye[4].x+rightEye[5].x+rightEye[2].x)/6
  const right_y_avg=(rightEye[0].y+rightEye[1].y+rightEye[3].y+rightEye[4].y+rightEye[5].y+rightEye[2].y)/6
  const left_x_avg=(leftEye[0].x+leftEye[1].x+leftEye[3].x+leftEye[4].x+leftEye[5].x+leftEye[2].x)/6
  const left_y_avg=(leftEye[0].y+leftEye[1].y+leftEye[3].y+leftEye[4].y+leftEye[5].y+leftEye[2].y)/6
  
  const dist = right_x_avg-left_x_avg
  const eyedist = Math.sqrt(Math.pow(right_x_avg-left_x_avg, 2) + Math.pow(right_y_avg-left_y_avg, 2))


  const mask_by_eye=0.45
  const eyebrow_by_eye=0.467
  const leftMask_by_leftEye=0.25

  const h=(left_y_avg-eyebrow[2].y)/eyebrow_by_eye
  
  
  const angle=(left_y_avg-right_y_avg)/(left_x_avg-right_x_avg)
  const leftOffset= left_x_avg-(leftMask_by_leftEye*(eyedist/mask_by_eye));
  const topOffset= eyebrow[2].y;

  const dimensions = {
    width: image.width,
    height: image.height
};

  const resizedDimensions = faceapi.resizeResults(detection, dimensions);
  document.body.append(canvas);

  faceapi.draw.drawFaceLandmarks(canvas, resizedDimensions);
 
  const item = document.querySelector(".grid-item")


  const overlay = document.createElement("img") 
  overlay.src = document.querySelector(".mask").src;
  overlay.alt = "mask overlay."
  overlay.style.cssText = `
    position: absolute;
    left: ${leftOffset}px;
    top: ${topOffset}px;
    width: ${eyedist/mask_by_eye}px;
    transform: rotate(${jawangle}deg);
    z-index:1;
  `
  //console.log(document.querySelector(".mask"))

  item.appendChild(overlay)
}
landmark()

