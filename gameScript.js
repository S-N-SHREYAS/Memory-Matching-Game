var em = ["💐","🌹","🌻","🏵️","🌺","🌴","🌈","🍓","🍒","🍎","🍉","🍊","🥭","🍍","🍋","🍏","🍐","🥝","🍇","🥥","🍅","🌶️","🍄","🧅","🥦","🥑","🍔","🍕","🧁","🎂","🍬","🍩","🍫","🎈"];
//Shuffling above array
var tmp, c, p = em.length;
if(p) while(--p) {
   c = Math.floor(Math.random() * (p + 1));
   tmp = em[c];
   em[c] = em[p];
   em[p] = tmp;
}

//Variables
var pre="", pID, ppID=0, turn=0, t="transform", flip="rotateY(180deg)", flipBack="rotateY(0deg)", time, mode;

//Resizing Screen
window.onresize = init;
function init() {
   W = innerWidth;
   H = innerHeight;
   $('body').height(H+"px");
   $('#ol').height(H+"px");
}

//Showing instructions
window.onload = function() {
    $("#ol").html(`<center><div id="inst"><h3>Welcome !</h3>Instructions For Game<br/><br/><li>Make pairs of similiar blocks by flipping them.</li><li>To flip a block you can click on it.</li><li>If two blocks you clicked are not similar, they will be flipped back.</li><p style="font-size:18px;">Click one of the following mode to start the game.</p></div><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></center>`);
}

//Starting the game
function start(r,l) {
    //Timer and moves
    min=0, sec=0, moves=0;
    let timeElapsed=0;
    let timeLimit = 100;
    if(r==3 && l==4){
        timeLimit = 100;
    }else if(r==4 && l==4){
        timeLimit = 150;
    }else if(r==4 && l==5){
        timeLimit = 200;
    }else if(r==5 && l==6){
        timeLimit = 250;
    }else if(r==6 && l==6){
        timeLimit = 310;
    }
    
    let minLim = timeLimit/60;
    let secLim = timeLimit%60;
    $("#timeElapsed").html("Time Elapsed: 00:00");
    $("#moves").html("Moves: 0");
    $("#timeLimit").html("Time Limit: 0"+Math.floor(timeLimit/60)+":"+timeLimit%60);
    time = setInterval(function() {
        timeElapsed++;
      sec++;
      if(sec==60) {
          min++; sec=0;
      }
      if(sec<10) 
          $("#timeElapsed").html("\t\tTime Elapsed: 0"+min+":0"+sec);
      else 
        $("#timeElapsed").html("\t\tTime Elapsed: 0"+min+":"+sec);
      if(timeElapsed==timeLimit){
        clearInterval(time);
        setTimeout(function() {
            // $("#start").html(`<center><div id="iol"><h2>Game Over!</h2><p style="font-size:23px;padding:10px;">Time's up! You did not complete the game in the time limit of 5 minutes.</p><p>Play Again ?</p><button onclick="start()">START!</button></div></center>`);
            // $("#start").fadeIn(750);
            // $("#time").html("Time: 00:00");
            $("#ol").html(`<center><div id="iol"><h2>Game Over!</h2><p style="font-size:23px;padding:10px;">Time limit exeeded</p><p>Play Again ?</p><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></div></center>`);
            $("#ol").fadeIn(750);
            if(sec<10) 
                $("#time").html("Time: 0"+min+":0"+sec);
            else 
                $("#time").html("Time: 0"+min+":"+sec);
          }, 1500);
      }  
    }, 1000);
    rem=r*l/2, noItems=rem;
    //rem=Number of items remaining to be flipped
    mode = r+"x"+l;
    //Generating item array and shuffling it
    var items = [];
    for (var i=0;i<noItems;i++)
        items.push(em[i]);
    for (var i=0;i<noItems;i++)
        items.push(em[i]);
    var tmp, c, p = items.length;
    if(p) while(--p) {
        c = Math.floor(Math.random() * (p + 1));
        tmp = items[c];
        items[c] = items[p];
        items[p] = tmp;
    }
    
    //Creating table
    $("table").html("");
    var n=1;
    for (var i = 1;i<=r;i++) {
        $("table").append("<tr>");
        for (var j = 1;j<=l;j++) {
           $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n-1]}</p></div></div></td>`);
           n++;
         }
         $("table").append("</tr>");
    }
    
    //Hiding instructions screen
    $("#ol").fadeOut(500);
}

//Function for flipping blocks
function change(x) {
  //Variables
  let i = "#"+x+" .inner";
  let f = "#"+x+" .inner .front";
  let b = "#"+x+" .inner .back";
  
  //Dont flip for these conditions
  if (turn==2 || $(i).attr("flip")=="block" || ppID==x) {}
  
  //Flip
  else {
    $(i).css(t, flip);
    if (turn==1) {
      //This value will prevent spam clicking
      turn=2;
      
      //If both flipped blocks are not same
      if (pre!=$(b).text()) {
         setTimeout(function() {
            $(pID).css(t, flipBack);
            $(i).css(t, flipBack);
            ppID=0;
         },1000);
      }
      
      //If blocks flipped are same
      else {
          rem--;
          $(i).attr("flip", "block");
          $(pID).attr("flip", "block");
      }
      
      setTimeout(function() {
         turn=0;
         //Increase moves
         moves++;
         $("#moves").html("Moves: "+moves);
      },1150);
      
    }
    else {
      pre = $(b).text();
      ppID = x;
      pID = "#"+x+" .inner";
      turn=1;
    }
    
    //If all pairs are matched
    if (rem==0) {
          clearInterval(time);
          if (min==0) {
              time = `${sec} seconds`;
          }
          else {
              time = `${min} minute(s) and ${sec} second(s)`;
          }
          setTimeout(function() {
              $("#ol").html(`<center><div id="iol"><h2>Congrats!</h2><p style="font-size:23px;padding:10px;">You completed the ${mode} mode in ${moves} moves. It took you ${time}.</p><p style="font-size:18px">Play Again ?</p><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></div></center>`);
              $("#ol").fadeIn(750);
          }, 1500);
    }
  }
}