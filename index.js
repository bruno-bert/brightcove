require('dotenv').config()
//const videosArray = require ('./videos.example.json')
const videosArray = require ('./videos.json')

const axios = require('axios');
const format = require('string-format')
let index = 7;


const run = async()=>{


  const getSourceToken = async () => {

    return new Promise(( resolve, reject) =>{
      axios.post(process.env.SOURCE_URL_TOKEN,{},{auth: {
        username: process.env.SOURCE_CLIENT_ID,
        password: process.env.SOURCE_CLIENT_SECRET
      }})
      .then(response => {
       resolve(response.data.access_token);
      }).catch(err =>{
        reject(err);
      })
    });
  
  }


  const getTargetToken = async () => {

    return new Promise(( resolve, reject) =>{
      axios.post(process.env.TARGET_URL_TOKEN,{},{auth: {
        username: process.env.TARGET_CLIENT_ID,
        password: process.env.TARGET_CLIENT_SECRET
      }})
      .then(response => {
       resolve(response.data.access_token);
      }).catch(err =>{
        reject(err);
      })
    });
  
  }

  let sourceToken = await getSourceToken();
  let targetToken = await getTargetToken();
  

  const getVideos = async ()=>{
    
      
    const uploadVideo = async (sourceId, newId, src) =>{
                  
      return new Promise((resolve, reject) =>{

        let body = {master: {url: src}}

        let config = {
          headers: { authorization: `Bearer ${targetToken}` }
        }


        axios.post(format(process.env.TARGET_URL_UPLOAD,newId), body,  config)
        .then( response => {
          resolve(true)
        }).catch(err=>{
          console.log(`${sourceId}|${newId}|could not upload video on target`)
          resolve(true);
        });

      });

     }



    const createVideoId = async (title) =>{
                  
      return new Promise((resolve, reject) =>{

        let body = { name: title }

        let config = {
          headers: { authorization: `Bearer ${targetToken}` }
        }

        axios.post(process.env.TARGET_URL_VIDEOID, body, config)
        .then( response => {
          resolve(response.data.id)
        }).catch(err=>{
          console.log(`${video.id}|could not create video Id on target`)
          reject(err);
        });

      });

     }

     
   


    //loops the list of videos and adds the url into a new array with video object
    const getSource = async (id)=>{
      
      return new Promise((resolve, reject) =>{

        axios.get(format(process.env.SOURCE_URL_VIDEOSRC, id),{
          headers: { authorization: `Bearer ${sourceToken}` }
        })  .then(response => {
    
          if (response.data) {
            
            resolvido = false
            for (item of response.data) {
              
              if (item.container) {
                if (item.container == 'MP4' || item.container == 'FLV') {
                  resolve(item.src)
                  resolvido = true
                } else {
                  console.log(`${id}|format not uploadable`)
                  resolve(null)
                  resolvido = true
                }
              }

            }

            if (!resolvido) {
              console.log(`${id}|could not get valid source - key container not available: ${item.container}`)
              resolve(null)
            }
           


          } else {
            console.log($`${id}|nothing returned from api source`)
            resolve(null)
          }
        })
        .catch(error => {
          resolve(null)
          console.log(`${id}|on trying to get source url -  ${error}`);
        });

      });
    }

    for(video of videosArray){
      //video = videosArray[index]; 
      let src = await getSource(video.id);

      if (src) {

        let newVideoId = await createVideoId(video.title);
        if (newVideoId){
          let uploadResult = await uploadVideo(video.id, newVideoId, src);
          console.log(`${video.id}|${newVideoId}|upload completed`)
        }

      }
        
    }
    
    
  }




  await getVideos();

    

  
}


run();



