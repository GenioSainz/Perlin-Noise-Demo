

let myUtils = {
    
    drawGrid : function({cellSize = 50, ktxt = 1, center=false,fillText=0}={}){

        // This function draws a grid with a cellSize 
        // from (x,y)=(0,0) to (x,y)=(windowWidth,windowHeight)

        push()
    
            stroke(127,127,127);strokeWeight(1)
            fill(fillText);textAlign(LEFT,CENTER);textSize(12)
            
            for (var x=0; x < width; x+=cellSize ) {
              line(x, -height, x, height);
              text(x*ktxt, x+1, cellSize /4);
            };

            for (var y=0; y < height; y+=cellSize ) {
              line(-width, y, width, y);
              text(y*ktxt, 1, y+cellSize /4);
            };
            
            if(center){
              for (var x=0; x > -width; x-=cellSize ) {
                line(x, -height, x, height);
                text(x*ktxt, x+1, cellSize /4);
              };

              for (var y=0; y > -height; y-=cellSize ) {
                line(-width, y, width, y);
                text(y*ktxt, 1, y+cellSize /4);
              };
            }

        pop()

    },

    drawArrow : function(p1=[0,0], p2=[200,200], {module=undefined, double=false, arrowHead=0.1, color=[0,0,0]}={}){
       
      // Named default parameters via destructuring 
      
      // function functioName (var1,var2, { start=0, end=-1, step=1 } = {}) {
      
      //     The object pattern is an abbreviation of: { start: start=0, end: end=-1, step: step=1 }
      //     Use the variables `start`, `end` and `step` here

      // }
                 
      // ARROW FROM ----> TO     p1 [p1x,p1y] -----> p2 [p2x,p2y]

      // Equilateral triangle of side len 
      // coordinates respect (0,0)-->translate x2 (0,0)
      //     x2
      //   x1  x3
      
      var dx    = p2[0]-p1[0];
      var dy    = p2[1]-p1[1];
      var alpha = atan2(dy,dx);
      var len;

      if(module){
          
          p2[0] = p1[0] + Math.cos(alpha*Math.PI/180)*module;
          p2[1] = p1[1] + Math.sin(alpha*Math.PI/180)*module;
          len   = arrowHead*module;

      }else{

           len  = arrowHead*sqrt((p1[0]-p2[0])**2+(p1[1]-p2[1])**2);
      };

    
      var x1 = - len/2;
      var y1 =   len
    
      var x2 = 0;
      var y2 = 0;
    
      var x3 = + len/2
      var y3 =   len; 
      
      //stroke(colorStroke);

      // SEGMENT
      push()
       stroke(color);
       line(p1[0],p1[1],p2[0],p2[1]);
      pop()
      
      // TRIANGLE
      push()
       fill(color);stroke(color);
       translate(p2[0],p2[1])
       rotate( +90 + alpha )
       triangle(x1, y1, x2, y2, x3, y3);
      pop()
      
      // P1
      if(double){

        push()
          fill(color);stroke(color);
          translate(p1[0],p1[1])
          rotate( -90 + alpha )
          triangle(x1, y1, x2, y2, x3, y3);
        pop()
        
      }

    },

    roundGrid: function(gridCellSize,xpos,ypos){

                xGrid = Math.round(xpos/gridCellSize)*gridCellSize;
                yGrid = Math.round(ypos/gridCellSize)*gridCellSize;
    
    return {xGrid,yGrid}

    },

    randColor: function(){
     
      // nomber from [0,255];
      var r = Math.floor( Math.random()*255 + 1);
      var g = Math.floor( Math.random()*255 + 1);
      var b = Math.floor( Math.random()*255 + 1);

      return [r,g,b]
    },

    linspace: function(a,b,n){

      var arr = [];
      var step = (b - a) / (n - 1);
      for (var i = 0; i < n; i++) {
        arr.push(a+ (step * i));
      }
      return arr;
    
    }

};


class Joystick{

  constructor({x0=50, y0=50,joyLen=250,joystickX=0,joystickY=0,color=[255,0,0], fillValue=240,fillText=0, drawCircle=true,strokeBox=false}={}){

    this.x0        = x0;
    this.y0        = y0;
    this.joyLen    = joyLen;
    this.xMax      = this.x0 + this.joyLen;
    this.yMax      = this.y0 + this.joyLen;
    this.xMed      = this.x0 + this.joyLen/2;
    this.yMed      = this.y0 + this.joyLen/2;
    this.ktxt      = 2; 
    this.joystickX = joystickX;
    this.joystickY = joystickY;
    this.xJoysDraw = this.xMed + this.joystickX * this.joyLen/2  ;
    this.yJoysDraw = this.yMed + this.joystickY * this.joyLen/2;
    this.color     = color;
    this.drawCircle = drawCircle;
    this.fillValue  = fillValue;
    this.fillText   = fillText;
    this.strokeBox  = strokeBox;

  };

  // draw joystick
  draw(){


    push()

      fill( this.fillValue ) // JOYSTIC Bounding box 
      if(this.strokeBox){
         push();stroke(this.color);strokeWeight(2);rect(this.x0,this.y0,this.joyLen,this.joyLen,this.joyLen/25);pop();
      }else{
         push();stroke(0);strokeWeight(2);rect(this.x0,this.y0,this.joyLen,this.joyLen,this.joyLen/25);pop();
      }

      strokeWeight(2)
      line(this.x0 ,this.yMed, this.xMax, this.yMed);  // X AXIS
      line(this.xMed, this.y0, this.xMed, this.yMax ); // Y AXIS
      //myUtils.drawArrow([this.xMed, this.yMed],[this.xMax, this.yMed],{arrowHead:0.05}); // X DIRECCTION
      //myUtils.drawArrow([this.xMed, this.yMed],[this.xMed, this.yMax],{arrowHead:0.05}); // Y DIRECCTION
    
      var boolX = mouseX <= this.xMax && mouseX >= this.x0;
      var boolY = mouseY <= this.yMax && mouseY >= this.y0;

      if (mouseIsPressed && (boolX && boolY)){
        
        strokeWeight(1)
          //moving lines
          line(mouseX,this.y0,mouseX,this.yMax);
          line(this.x0,mouseY,this.xMax,mouseY);

          // MOVING CIRCLE OR ARROW
          if(this.drawCircle){
            fill(this.color);circle(mouseX,mouseY,this.joyLen/20);
          }else{
            strokeWeight(2);myUtils.drawArrow([this.xMed,this.yMed],[this.xJoysDraw,this.yJoysDraw],{color:this.color})
          };
          
          this.xJoysDraw = mouseX;
          this.yJoysDraw = mouseY;

          this.joystickX = map(mouseX, this.x0, this.xMax, -1, 1);
          this.joystickY = map(mouseY, this.y0, this.yMax, -1, 1);

          // TEXT (X,Y)
          fill(this.fillText);textSize(18);textAlign(CENTER,BOTTOM);strokeWeight(5)
          text(`x: ${this.joystickX.toFixed(3)} y: ${this.joystickY.toFixed(3)}`, this.xMed, this.y0 - this.ktxt);
      

          pop()

          return [this.joystickX,this.joystickY]

      }else{

          strokeWeight(1)
          line(this.xJoysDraw,this.y0,this.xJoysDraw,this.yMax);
          line(this.x0,this.yJoysDraw,this.xMax,this.yJoysDraw);
          
          // MOVING CIRCLE OR ARROW
          if(this.drawCircle){
            fill(this.color);circle(this.xJoysDraw,this.yJoysDraw,this.joyLen/20)
          }else{
            strokeWeight(2);myUtils.drawArrow([this.xMed,this.yMed],[this.xJoysDraw,this.yJoysDraw],{color:this.color})
          };
          
          // TEXT (X,Y)
          fill(this.fillText);textSize(18);textAlign(CENTER,BOTTOM);strokeWeight(5)
          text(`x: ${this.joystickX.toFixed(3)} y: ${this.joystickY.toFixed(3)}`, this.xMed, this.y0 - this.ktxt);

          pop()
          
          return [this.joystickX,this.joystickY]

      }

  };

  // update variables
  update(){

    this.xMax      = this.x0 + this.joyLen;
    this.yMax      = this.y0 + this.joyLen;
    this.xMed      = this.x0 + this.joyLen/2;
    this.yMed      = this.y0 + this.joyLen/2;
    this.ktxt      = 2; 
    this.xJoysDraw = this.xMed + this.joystickX*this.joyLen/2;
    this.yJoysDraw = this.yMed + this.joystickY*this.joyLen/2;


  }
  // get/set pos
  get x0(){
    return this._x0
  };

  set x0(value){
    this._x0 = value;
    this.update();
  };

  get y0(){
    return this._y0
  };

  set y0(value){
    this._y0 = value;
    this.update();
  };

  get joyLen(){
    return this._joyLen
  };

  set joyLen(value){
    this._joyLen = value;
    this.update();
  };

};


