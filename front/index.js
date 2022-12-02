const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")
const searchInput = document.querySelector("#searchInput")
const responseP = document.getElementById("reply")


//UPLOADING A IMAGE INTO THE S3 BUCKET FUNC 
imageForm.addEventListener("submit", async event => {
  event.preventDefault()
  const file = imageInput.files[0]

  // get secure url from our server
  const { url } = await fetch("http://127.0.0.1:5502/s3url").then(res => res.json())
  console.log("url" +url)
  console.log("name:" + document.getElementById('name'))

  // post the image direclty to the s3 bucket
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "image/*" ,
    },
    body: file,
  }).then(response=>response.json()).then((data)=>{
    res.data 
    }).catch(error => console.log(error))

  const imageUrl = url.split('?')[0]
  console.log(imageUrl)
  

  //post requst to our server to store any extra data
  // const img = document.createElement("img")
  // img.src = imageUrl
  // document.body.appendChild(img);
  responseP.innerHTML = "[ UPLOAD WAS SUCCESSFULL ] <br/> "
})


//FACIAL REKOGNIITION SEARCH FUNC
searhForm.addEventListener("submit", async event => {
  event.preventDefault()
  const searchInput = document.querySelector("#searchInput")
  const file = searchInput.files[0];

  const convertBlobToBase64 = async (blob) => { // blob data
    return await blobToBase64(blob);
  }
  
  const blobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base= reader.result
      resolve(base)
  };
    reader.onerror = error => reject(error);
    reader.readAsArrayBuffer(blob);
  });

  let base64String = await convertBlobToBase64(file)
  console.log(typeof base64String)

  myConfig = new AWS.Config({
    region: "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",  
  });

  const rekognition = new AWS.Rekognition({
    region: "us-east-1",
    accessKeyId: "",
    secretAccessKey: "",  
  });
  
  var params = {
    CollectionId: "face_collection", 
    FaceMatchThreshold: 25, 
    Image: {
     Bytes: base64String
    }, 
    MaxFaces: 5
   };


   // CALLING REKOGNITION TO SEARCH FOR A FACIAL MATCH 
  rekognition.searchFacesByImage(params, function(err, data) {
    //if a error occurred 
    if (err) {
      console.log(JSON.stringify(err) , err.stack); // an error occurred
      responseP.innerHTML = "A error occurred. Please check image format. "
    }
    //if there was NO match
    else if(data.FaceMatches.length == 0){
      console.log(data);    
      responseP.innerHTML = "No Found.. "
     }
    //if there was a facial match from
    else{    
      
      console.log(data);           // successful response
      responseP.innerHTML += "<br/> [ SEARCH RESULTS ] <br/> "+ data.FaceMatches.length + " Total Face Macthes Found: <br/> " +"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ <br/> <br/>"
      let index =1
      for(const i in data.FaceMatches){
        responseP.innerHTML += "{ Match "+ index +" } Similarity:  " + data.FaceMatches[i].Similarity + "% " + "<br/>"+ " FaceId:  " +  data.FaceMatches[i].Face.FaceId + "<br/>"+ "<br/>"
        index++
      }
      
     }
    });
})
