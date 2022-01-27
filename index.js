
//global vars
//colors
const backgroundcolor =  'rgb(217, 222, 200)';
const greycolor = "rgb(77, 79, 102)";
const redcolor = "rgb(178,51,81)";
const greencolor = "rgb(136,178,51)";
const lightgreen = "rgb(108, 120, 106)";
const yellowcolor = "rgb(217, 197, 141)"

//canvas
const canvas = document.querySelector('.myCanvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
ctx.fillStyle = backgroundcolor;
ctx.fillRect(0,0,width,height);
//grid
var gridx = 850;
var gridy = 550;


var nodeCount = 0;
var squaresize = 50;
const nodeList = [];
var startnode;
var endnode;


//class
class Node{
  constructor(x, y,id) {
    this.x = x;
    this.y = y;
    this.id;
    this.color = backgroundcolor;
    this.start = false;
    this.end = false;
    this.distance = -1;
  }
}

//call funcitons
creategrid();
randomStartEndNode();
document.addEventListener("click", colorMousePos);

function creategrid(){
  ctx.beginPath();
  var id = 0;
  for(var x=400; x<=gridx ;x+=squaresize+10){
    for(var y=100; y<=gridy;y+=squaresize+10){
      const n = new Node(x, y, id);
      id+=1;
      nodeList.push(n);
      nodeCount +=1;
      ctx.rect(x, y, squaresize, squaresize);
      ctx.stroke();
    }
  }
}


function colorMousePos(event) {
    var mousex = event.clientX; 
    var mousey = event.clientY;
    for (let item of nodeList) {
      if((item.x+squaresize > mousex) && (item.x-squaresize < mousex) && (item.y+squaresize > mousey) && (item.y-squaresize < mousey)){
        if(item.color === greycolor){
          item.color = backgroundcolor;
        }else if(item.color === backgroundcolor){
          item.color = greycolor;
        }
        colorNode(item);
        break;
      }
    } 
}

function randomStartEndNode(){
  var index = Math.floor(Math.random() * nodeCount);
  startnode = nodeList[index]  
  startnode.color = greencolor;
  startnode.start = true;
  colorNode(startnode);
  endnode = startnode;  
  while(endnode.start==true){
    index = Math.floor(Math.random() * nodeCount);
    endnode = nodeList[index]  
  }
  endnode.color = redcolor;
  endnode.end = true;
  colorNode(endnode);
}

function colorNode(n){
  ctx.fillStyle = n.color;
  ctx.fillRect(n.x, n.y, squaresize, squaresize);
  ctx.stroke();
}


function clearCanvas() {
  for (let n of nodeList) {
    if(n.start===false && n.end===false){
      n.color = backgroundcolor;
      colorNode(n);
    }
  }
}


function refreshCanvas() {
  for (let n of nodeList) {
    n.color = backgroundcolor;
    n.start = false;
    n.end = false;
    colorNode(n);
  }
  randomStartEndNode();
}

function startPath (){
  var pathlist = BFS();
  var i = 1;
  for (let p of pathlist) {
      //cause a delay
      setTimeout(function(){
        colorNode(p);
      }, 100*i);
      i+=1;
  }
  setTimeout(function(){
    tracePath(pathlist);
  }, 100*i);
}

function BFS(){
  const graphlist = [...nodeList]
  var pathlist = [];
  const queuelist = [];
  var dist = 0;
  var n = startnode;
  n.distance = dist;
  queuelist.push(startnode);
  while(queuelist.length > 0){
    n = queuelist[0]
    queuelist.shift();
    //add edges to queue 
    var distance = squaresize + 10;
    const edgecoords = [[n.x+distance, n.y], [n.x-distance, n.y],  //right left
      [n.x, n.y+distance], [n.x, n.y-distance]] //up down
    for(let e of edgecoords){
      for (let i=0;i!=graphlist.length;i++) {
        var m = graphlist[i];
        if(m.color != lightgreen){
          if(m.x === e[0] && m.y ===e[1]){
            if(m.end===true){
              m.distance = dist+=1;
              console.log("found it!"); 
              return pathlist;
            }
            if(m.color !== greycolor){
              m.color = lightgreen;
              if(m.start===false){
                queuelist.push(m);
                pathlist.push(m);
                m.distance = dist+=1;
              }
            }
          }
        }
      }
    }
  }
  return pathlist;
}


//highlights shortest path in yellow
function tracePath(pathlist){
  var shortestpathnodes = []
  pathlist.push(startnode);
  var n = endnode;
  var mindist = n;
  var index = 0;
  var distance = 0;
  while(n !== startnode && index<=nodeCount){
    var found = false;
    distance = squaresize + 10;
    index+=1;
    const edgecoords = [[n.x+distance, n.y], [n.x-distance, n.y],  //right left
    [n.x, n.y+distance], [n.x, n.y-distance]] //up down
    for(let e of edgecoords){
      for (let i=0;i!=pathlist.length;i++) {
        var m = pathlist[i];
        if(m.x === e[0] && m.y ===e[1]){
          if(m===startnode){
            colorshortestpath(shortestpathnodes);
            return;
          }
          //update mindist node with smallest distance
          if(Math.min(m.distance, mindist.distance) < mindist.distance){
            mindist = m;
            found = true;
            break;
          }
          if(found===true){
            break;
          }
          mindist.color = yellowcolor;
          n = mindist;
          shortestpathnodes.push(n);
        }
      }
    }
  }
  colorshortestpath(shortestpathnodes);
}

function colorshortestpath(shortestpathnodes){
  var i = 1;
  for (let p of shortestpathnodes) {
      //cause a delay
      setTimeout(function(){
        colorNode(p);
      }, 70*i);
      i+=1;
  }
}
