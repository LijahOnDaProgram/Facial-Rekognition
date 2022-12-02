//import * as AWS from "aws-sdk"
import pkg from '@aws-sdk/client-rekognition';
const { RekognitionClient, CreateCollectionCommand} = pkg;


const client = new RekognitionClient({ 
        region: "us-east-1",
        accessKeyId: "",
        secretAccessKey: "",  
});

var params = {
    CollectionId: "face_Recognition"

    };

const command = new CreateCollectionCommand(params)    

try {
    const data = await client.send(command).then(data => {
        console.log(data)
    });
    // process data.
  } catch (error) {
    console.log(error)
  } finally {
    // finally.
  }

//console.log(client)

function create(){
    // const rekognition =  AWS.Rekognition({
    //     region: "us-east-1",
    //      
    // });

    

    CreateCollection(params, function(err, data) {
         if (err) console.log(err, err.stack); // an error occurred
         else     console.log(data);           // successful response
    })
}


//create()
