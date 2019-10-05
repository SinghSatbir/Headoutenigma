var app = require('express')();
var request = require('request');
var bodyParser  = require("body-parser");
var btoa = require('btoa');
var fs = require('fs');
var calc = require("./detecting_obj");


app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.post('/image', (req, res, next) => {
   // console.log(req);
    console.log("accept");
    let bbb = req.body;
    //console.log(req.body);
    if(IsEm(bbb)){
        console.log("error");
        res.status(500).send("please try again");
    }else{
      //console.log(bbb.tp);  
    let img = Buffer.from(bbb.img, "base64");
    // let img = bbb;

        var options = {
            url: "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/describe?language=en",
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": "ea5448d599e24046a51296ff0bf58cba",
                "Content-Type": "application/octet-stream"
            },
            body: img
        };
        //console.log(options);
        res.status(200);
        request(options ,(err, res1, body) => {
            if(err) {
               // console.log(err);
            }else {
                //console.log(body);
                let bb = JSON.parse(body);
                console.log(bb);
                let captions;
                if(bb.description.captions.length>0){
                    captions = bb.description.captions[0].text + ". ";
                }else {
                    captions = "some things"+ ". ";
                }
                
                let height = bb.metadata.height;
                let width = bb.metadata.width;
                console.log(captions);
                request({
                    url: "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/detect",
                    method: "POST",
                    headers: {
                        "Ocp-Apim-Subscription-Key": "b216acf7e9c64ba7a26f6ce2b4a20d80",
                        "Content-Type": "application/octet-stream"
                    },
                    body: img
                }, (err1, res2, body1)=> {
                    //console.log(body1);
                    let bd = JSON.parse(body1);
                    console.log(bd);
                    let objs = bd.objects;
                    let tt="";
                    objs.forEach(el => {
                        // if(captions.includes(el.object)){
                            tt=tt+calc(el,width,height) + ". ";
                        // }
                    });
                    console.log(tt);
                    let reee = captions + ". " + tt;
                    res.status(200).send(reee);
                })
                // console.log(typeof(captions));
                // console.log("sdf  "+captions);
                // let username = "apikey";
                // let password = "1yHvWupnIVMBlefOnUgs2Vg8HSEor7yiBd6fHBr3Z4JE";
                // let basic = btoa(username + ":" + password);
                // var options1 = {
                //     method: "POST",
                //     url: "https://gateway-lon.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=en-US_AllisonVoice",
                //     headers: {
                //         "Authorization": `Basic ${basic}`,
                //         "Content-Type": "application/json",
                //         "Accept": "audio/wav"
                //     },
                //     body: {
                //         "text": captions
                //     }, 
                //     json: true
                // }
                // console.log(options1);
                // request(options1, (errr, ress, body1) => {
                //     // console.log(body1);
                //     fs.writeFile("./output.wav", body1, (err)=> {
                //         if(err) console.log(err);
                //         console.log("saved");
                //     })
                //     res.send("yes");
                // })
            }    
    })
}
    



});

app.listen(8080, function(){
    console.log("The YelpCamp Server Has Started! on port 8080");
 });


 var IsEm = (el) => {
     for(var key in el){
        if(el.hasOwnProperty(key)) {
            return false;
          }
     }

     return JSON.stringify(el) === JSON.stringify({});
 }