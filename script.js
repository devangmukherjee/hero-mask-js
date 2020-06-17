const landmark = async() => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('/models');
  
  const image = document.querySelector('.face');
  const canvas = faceapi.createCanvasFromMedia(image);
  const detection = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

  const rightEye=detection[0].landmarks.getRightEye()
  const leftEye=detection[0].landmarks.getLeftEye()

  const right_x_avg=(rightEye[0].x+rightEye[1].x+rightEye[3].x+rightEye[4].x+rightEye[5].x+rightEye[2].x)/6
  const right_y_avg=(rightEye[0].y+rightEye[1].y+rightEye[3].y+rightEye[4].y+rightEye[5].y+rightEye[2].y)/6
  const left_x_avg=(leftEye[0].x+leftEye[1].x+leftEye[3].x+leftEye[4].x+leftEye[5].x+leftEye[2].x)/6
  const left_y_avg=(leftEye[0].y+leftEye[1].y+leftEye[3].y+leftEye[4].y+leftEye[5].y+leftEye[2].y)/6
  
  const leftEyeCentroid = [left_x_avg, left_y_avg]
  const rightEyeCentroid = [right_x_avg, right_y_avg]
  const eyesCentroid = [(leftEyeCentroid[0] + rightEyeCentroid[0])/2, (leftEyeCentroid[1] + rightEyeCentroid[1])/2]

  const eyedist = Math.sqrt(Math.pow(right_x_avg-left_x_avg, 2) + Math.pow(right_y_avg-left_y_avg, 2))

  const mask_by_eye=0.45

  const width = eyedist/mask_by_eye
  const height = width * 480 / 1280
  const newOffsetTop = eyesCentroid[1] - height/2
  const newOffsetLeft = eyesCentroid[0] - width/2
  
  const angleEyes=Math.atan((left_y_avg-right_y_avg)/(left_x_avg-right_x_avg)) * 180 / Math.PI
 
  const item = document.querySelector(".grid-item")

  const overlay = document.createElement("img") 
  overlay.src = "./mask.png"
  overlay.alt = "mask overlay."
  overlay.style.cssText = `
    position: absolute;
    left: ${newOffsetLeft}px;
    top: ${newOffsetTop+77}px;
    width: ${eyedist/mask_by_eye}px;
    transform: rotate(${angleEyes}deg);
    z-index:1;
  `

  item.appendChild(overlay)
}
landmark()

