
const video = document.getElementById('video');
const videoDiv = document.querySelector('.videoDiv');
let decide = 1;

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(streamVideo)

function streamVideo() {

    if (decide == 1) {
        navigator.getUserMedia(
            { video: {} },
            stream => video.srcObject = stream,
            err => console.error(err)
        )
    }
}

video.addEventListener('play', () => {
    console.log("playing")
    const canvas = faceapi.createCanvasFromMedia(video)
    canvas.style.marginLeft = "27vw";
    canvas.style.marginTop = "-79.3vh";
    document.body.append(canvas);
    const displaySize = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        console.log(detections)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections);
        console.log('drawn')
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        console.log('face-landmarks')
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        console.log('face-expressions')
    }, 100)
})

