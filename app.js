var app = require('express')();
var request = require('request');
var bodyParser  = require("body-parser");
var calc = require("./detecting_obj");


app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.post('/image', (req, res, next) => {
    let bbb = req.body;
    if(IsEm(bbb)){
        console.log("error");
        res.status(500).send("please try again");
    }else{
    let img = Buffer.from(bbb.img, "base64");

        var options = {
            url: "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/describe?language=en",
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": "ea5448d599e24046a51296ff0bf58cba",
                "Content-Type": "application/octet-stream"
            },
            body: img
        };
        res.status(200);
        request(options ,(err, res1, body) => {
            if(err) {
            }else {
                let bb = JSON.parse(body);
                let captions;
                if(bb.description.captions.length>0){
                    captions = bb.description.captions[0].text + ". ";
                }else {
                    captions = "some things"+ ". ";
                }
                
                let height = bb.metadata.height;
                let width = bb.metadata.width;
                request({
                    url: "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/detect",
                    method: "POST",
                    headers: {
                        "Ocp-Apim-Subscription-Key": "b216acf7e9c64ba7a26f6ce2b4a20d80",
                        "Content-Type": "application/octet-stream"
                    },
                    body: img
                }, (err1, res2, body1)=> {
                    let bd = JSON.parse(body1);
                    let objs = bd.objects;
                    let tt="";
                    objs.forEach(el => {
                            tt=tt+calc(el,width,height) + ". ";
                    });
                    console.log(tt);
                    let reee = captions + ". " + tt;
                    res.status(200).send(reee);
                })
                
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