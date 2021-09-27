require('dotenv').config()
module.exports = async () => {
    const fs = require('fs')
    const xlsx = require('node-xlsx');

    //let obj = xlsx.parse(__dirname + '/' + process.env.FILENAME); // parses a file

    //__dirname + 
    const data = xlsx.parse(fs.readFileSync('./' + process.env.FILENAME)); // parses a buffer

    
    const videosArray = []
    let i = 0
    for (item of data[0].data) {

        
if (i>0) {
    if (String(item[0]).length > 0)
    videosArray.push({
        id: String(item[1]).trim(),
        title: String(item[0]).trim()
    });

}
        
        i+=1;
        

    }

    return videosArray

}
