
    var model;
async function loadModel(){
    model = await tf.loadGraphModel('TFJS/model.json')
    // const ts = tf.tensor(input)
    // const result = model.predict(ts).argMax(-1)
    // // const data = await result.data()
    // result.print()


  }

  async function predictImage(){
    let image = cv.imread(canvas)

    cv.cvtColor(image,image,cv.COLOR_RGBA2GRAY,0)
    cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    let cnt = contours.get(0)
    let rect = cv.boundingRect(cnt)
    let croppedImage = image.roi(rect);

    // Determine the current height and width of the cropped image
    var height = croppedImage.rows;
    var width = croppedImage.cols;

    let scaleFactor;
    if (height > width) {
        scaleFactor = height / 20;
        height = 20;
        width = Math.round(width / scaleFactor);
    } else {
        scaleFactor = width / 20;
        width = 20;
        height = Math.round(height / scaleFactor);
    }

    // Resize the image to the target size
    let dsize = new cv.Size(width, height);
    cv.resize(croppedImage, croppedImage, dsize, 0, 0, cv.INTER_AREA);

    // Calculate the padding to center the resized image in a 20x20 box
    const TOP = Math.ceil(4 + (20 - height) / 2);
    const BOTTOM = Math.floor(4 + (20 - height) / 2);
    const LEFT = Math.ceil(4 + (20 - width) / 2);
    const RIGHT = Math.floor(4 + (20 - width) / 2);

    // Create a scalar for the border color (black in this case)
    let s = new cv.Scalar(0, 0, 0, 255);

    // Add a border to the resized image
    cv.copyMakeBorder(croppedImage, croppedImage, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, s);


    //Center of Mass
    cv.findContours(croppedImage, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0)
    const Moment = cv.moments(cnt,false)
    const cx = Moment.m10/Moment.m00
    const cy = Moment.m01/Moment.m00

    const X_SHIFT = Math.round(croppedImage.cols/2 - cx)
    const Y_SHIFT = Math.round(croppedImage.rows/2 -cy)


    let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    dsize = new cv.Size(croppedImage.cols,croppedImage.rows)
    cv.warpAffine(croppedImage, croppedImage, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, s);

    let pixelValue = Float32Array.from(croppedImage.data)
    pixelValue = pixelValue.map((val)=>val/255.0);

    const inputTensor = tf.tensor([pixelValue])
    
    const result = model.predict(inputTensor).argMax(-1)
    const pred = await result.data()
    
    // const testCanvas = document.createElement('canvas')
    // cv.imshow(testCanvas,croppedImage)
    // document.body.appendChild(testCanvas)



    //cleaning
    image.delete()
    contours.delete()
    cnt.delete()
    hierarchy.delete()
    M.delete()
    inputTensor.dispose()
    result.dispose()

    return pred[0]
  }