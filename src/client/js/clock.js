const clock = document.querySelector(".clock");

function currentTime() {
    let date = new Date(); 
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    let session = "오전";
  
    if(h == 0){
        h = 12;
    }
    if(h > 12){
        h = h - 12;
        session = "오후";
    }
  
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    let time = session + " " + h + ":" + m + ":" + s;
    
    clock.innerHTML = time;
    setTimeout(function(){ currentTime() }, 1000);
}

if(clock)
    currentTime();