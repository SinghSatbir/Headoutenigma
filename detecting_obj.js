const angVis = (Math.PI/180)*75;
const angV = (Math.PI/180)*75;

let cal = (el,wi,he) => {
    let th = Math.atan(Math.tan(angVis/2)/(1-(el.rectangle.x + (0.5*(el.rectangle.w))/wi)))*(180/Math.PI);
    let st;
    if(th>0){
        th=xx(th);
        if(th==0){
            st = `The ${el.object} is in front`
        }else {
            st = `The ${el.object} is to right by ${th} degree`;
        }
        
    } else{
        th=xx(th);
        if(th==0){
            st = `The ${el.object} is in front`
        }else{
         st = `The ${el.object} is to left by ${th} degree`;
        }
    }

    let th1 = Math.atan(Math.tan(angVis/2)/(1-(el.rectangle.y + (0.5*(el.rectangle.h))/he)))*(180/Math.PI);
    if(th1>0){
        th1=xx(th1);
        if(th1==0 && th==0){
            st = `the ${el.object} is exactly in front`
        } else if(th1!=0){
            st = st + `, above by ${th1} degree`;
        }else{
            st = st + ", it is at eye level";
        }
       
    } else{
        th1=xx(th1);
        if(th1==0 && th==0){
            st = `the ${el.object} is exactly in front`
        } else  if(th1!=0){
            st = st + ` ,  below by ${th1} degree`;
        }else{
            st = st + ", it is at eye level";
        }
        
    }

    return st;
}

let xx = tt => {
    let mm;
    if(tt<15){
        mm=0;
    }else if(tt<45){
        mm=30;
    }else{
        mm=60;
    }
    return mm;
}

module.exports = cal;