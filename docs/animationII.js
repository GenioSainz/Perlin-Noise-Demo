
// input vectors
let vectorBL = new p5.Vector(0,0); // bottomLeft
let vectorBR = new p5.Vector(0,0); // bottomRight
let vectorTL = new p5.Vector(0,0); // topLeft
let vectorTR = new p5.Vector(0,0); // topRight

// gradient vectors
let gradientBL = new p5.Vector(+1,+1); // bottomLeft
let gradientBR = new p5.Vector(-1,+1); // bottomRight
let gradientTL = new p5.Vector(+1,-1); // topLeft
let gradientTR = new p5.Vector(-1,-1); // topRight

// cell corners
let cornerBL = {}; // bottomLeft
let cornerBR = {}; // bottomRight
let cornerTL = {}; // topLeft
let cornerTR = {}; // topRight

// corner values
let valueA = 0;
let valueB = 0;
let valueC = 0;
let valueD = 0;

// interpolation values
let U  = 0;
let V  = 0;
let AB = 0;
let CD = 0;
let Z  = 0;

// plots configurations
var divSize = 250;
var divPad  = 10;
var plotX;  var idx = 'plotX';
var plotY;  var idy = 'plotY';

var plotAB;   var idAB = 'plotAB';
var plotCD;   var idCD = 'plotCD';
var plotZ;    var idZ  = 'plotZ';
var plotVals; var idVals = 'plotVals';

var plotXX; var idXX = 'XX';
var plotYY; var idYY = 'YY';

var txtX = ['X','U'];
var txtY = ['Y','V'];

var colorXX = 'rgb(255,255,0)';
var colorYY = 'rgb(0,255,255)';

// noise object and permutatin table P
let noiseObject = new PerlinNoise();
let P           = noiseObject.P;

let imgGradient; 
var cellSize;       
var nXY;             
var dxy;             
var gradientsModule;

var XY;    
var XY0;  

var cellP;

function setup() {

    createCanvas(windowWidth,windowHeight);angleMode(DEGREES);
    frameRate(10);
    pixelDensity(1);
    textSize(20);textAlign(CENTER,CENTER);textStyle(BOLD);
    cursor(CROSS);
    
    var gradientXY  = sqrt(2)/2;
    cellP           = 20;
    cellSize        = floor( (windowHeight-2*cellP)/(2+2*gradientXY*sqrt(2)/4) );
    nXY             = 2;
    gradientsModule = Math.sqrt(2)*cellSize/4;
    dxy             = 30;

    XY      = myUtils.linspace(0,cellSize*nXY-1,nXY*cellSize);
    XY0     = [];for(let i = 0;i<nXY*cellSize;i++){ XY0.push(0) };

    //plotX     = createDiv('').id(idx);
    //plotY     = createDiv('').id(idy);
    //plotVals  = createDiv('').id(idVals);
    //plotAB    = createDiv('').id(idAB);
    //plotCD    = createDiv('').id(idCD);
    //plotZ     = createDiv('').id(idZ);
    plotXX    = createDiv('').id(idXX);
    plotYY    = createDiv('').id(idYY);

    //plotX    .position(divPad                      , divPad);
    //plotY    .position(2*divPad+divSize            , divPad);
    //plotVals .position(divPad                      , 2*divPad + divSize);
    plotXX   .position(windowWidth-2*divSize-divPad, divPad);
    plotYY   .position(windowWidth-2*divSize-divPad, 2*divPad + divSize);

    if(windowWidth>windowHeight){

        //plotAB .position( divPad             , 3*divPad + 2*divSize);
        //plotCD .position( 2*divPad+divSize   , 3*divPad + 2*divSize);
        //plotZ  .position( 2*divPad+divSize/2 , 4*divPad + 3*divSize);
    }else{
        //plotAB .position( windowWidth-2*divSize-2*divPad, divPad);
        //plotCD .position( windowWidth-divSize-divPad , divPad);
        //plotZ  .position( windowWidth-1.5*divSize-divPad , 2*divPad + divSize);
        plotXX .position( divPad,windowHeight-divSize-divPad);
        plotYY .position( windowWidth-2*divSize-divPad,windowHeight-divSize-divPad);
    };
    
    var borderTxt = '2px solid rgba(127,127,127,255)';
    //plotX.style('border',borderTxt);
    //plotY.style('border',borderTxt);
    //plotVals.style('border',borderTxt);
    //plotAB.style('border',borderTxt);
    //plotCD.style('border',borderTxt);
    //plotZ.style('border',borderTxt);
    plotXX.style('border',borderTxt);
    plotYY.style('border',borderTxt);


    // Evaluate Color map 
    /////////////////////////////////
    imgGradient = createImage(cellSize*nXY,cellSize*nXY);
    imgGradient.loadPixels();
    var gridCellSize = 6;
    createUpdateImage(gridCellSize);
};

function keyPressed() {
    // this will download the first 5 seconds of the animation!
    if (key === 's') {
      saveGif('mySketch', 10);
    }
  }

var thetaSpiral = 0;

function draw(){

    background(0);
    strokeWeight(2);
   
    // push();noStroke();fill(255);textSize(16);text('PERLIN NOISE DEMO',windowWidth/2,20);pop();

    // Translate Center
    //////////////////////
    //translate(windowWidth/2 - 2*cellSize, windowHeight/2 - 2*cellSize)

    var txy = round( cellP+gradientsModule*sqrt(2)/2 );
    translate(txy,txy);

    plotXX   .position(txy+2*cellSize+gradientsModule,txy);
    plotYY   .position(txy+2*cellSize+gradientsModule,txy+ cellSize);
    

    //  (0,0) = (windowWidth/2 - 2*cellSize, windowHeight/2 -2*cellSize)
    /////////////////////////////////////////////
    // var x = mouseX - txy;
    // var y = mouseY - txy;

    //  x,y by noise
    /////////////////////////////////////////////
    
    // var kNoise =  0.05;
    // var x      = map( noise( 1000 + frameCount*kNoise),0,1,txy,txy+2*cellSize);
    // var y      = map( noise( 2000 + frameCount*kNoise),0,1,txy,txy+2*cellSize);
    
    var thetaSpeed = 3;
    var R          = cellSize;
    var kTurns     = 3;

    thetaSpiral+=thetaSpeed;
    
    if(thetaSpiral>kTurns*360){
        thetaSpiral = 0;
    }

    var r = R - (R/kTurns)*(thetaSpiral/360);
    var x = txy + cellSize + r*cos(thetaSpiral) - txy;
    var y = txy + cellSize + r*sin(thetaSpiral) - txy;
    
    // eje1 (x,y)=(0.1,2.2)
    /////////////////////////
    var xGrid = x/cellSize;
    var yGrid = y/cellSize;

    // Index for indexing permutation table
    ////////////////////////////////////////
    var indexX = Math.floor(xGrid) & 255;
    var indexY = Math.floor(yGrid) & 255;
    
    // Draw Color map
    ////////////////////////
    image(imgGradient,0,0);

    // Draw cells and gradient vectors
    //////////////////////////////////////
    drawGrid();
    drawGradients();

    // If mouse is over grid
    ///////////////////////////
    var boolX = xGrid>=0 && xGrid<=nXY;
    var boolY = yGrid>=0 && yGrid<=nXY;

    if(boolX && boolY){
         
        // Current cell corners
        ///////////////////////
        cornerBL = {x:floor(xGrid), y:floor(yGrid)};
        cornerBR = {x:ceil(xGrid) , y:floor(yGrid)};
        cornerTL = {x:floor(xGrid), y:ceil(yGrid)};
        cornerTR = {x:ceil(xGrid) , y:ceil(yGrid)};

        // Current vectors from corners to input (x,y)
        ///////////////////////////////////////////////
        vectorBL.set(xGrid-cornerBL.x, yGrid-cornerBL.y);  
        vectorBR.set(xGrid-cornerBR.x, yGrid-cornerBR.y);  
        vectorTL.set(xGrid-cornerTL.x, yGrid-cornerTL.y); 
        vectorTR.set(xGrid-cornerTR.x, yGrid-cornerTR.y);  

        var indexBL = P[ P[indexX]   + indexY   ];
        var indexBR = P[ P[indexX+1] + indexY   ];
        var indexTL = P[ P[indexX]   + indexY+1 ];
        var indexTR = P[ P[indexX+1] + indexY+1 ];

        // Cell Gradients
        ///////////////////
        var temGradBL = getGradient( indexBL );
        var temGradBR = getGradient( indexBR );
        var temGradTL = getGradient( indexTL );
        var temGradTR = getGradient( indexTR );

        valueA = vectorBL.dot(temGradBL);
        valueB = vectorBR.dot(temGradBR);
        valueC = vectorTL.dot(temGradTL);
        valueD = vectorTR.dot(temGradTR);

        // Draw Projections
        /////////////////////////////////////////////////////
        drawProjections(x,y,cornerBL,0,0,vectorBL,temGradBL,[255,0,0])
        drawProjections(x,y,cornerBL,1,0,vectorBR,temGradBR,[0,255,0])
        drawProjections(x,y,cornerBL,0,1,vectorTL,temGradTL,[0,0,255])
        drawProjections(x,y,cornerBL,1,1,vectorTR,temGradTR,[255,0,255])
        
        // Draw Inputs vectors
        /////////////////////////
        push()
            strokeWeight(2)
            myUtils.drawArrow([cornerBL.x*cellSize,cornerBL.y*cellSize],[x,y], {color:[255,0,0]  , arrowHead:0.05}); // bottomLeft
            myUtils.drawArrow([cornerBR.x*cellSize,cornerBR.y*cellSize],[x,y], {color:[0,255,0]  , arrowHead:0.05}); // bottomRight
            myUtils.drawArrow([cornerTL.x*cellSize,cornerTL.y*cellSize],[x,y], {color:[0,0,255]  , arrowHead:0.05}); // topLeft
            myUtils.drawArrow([cornerTR.x*cellSize,cornerTR.y*cellSize],[x,y], {color:[255,0,255], arrowHead:0.05}); // topRight
        pop()
        
        // Draw Circle Corners
        /////////////////////////
        push();
           strokeWeight(2);stroke(0);
           circle(cornerBL.x*cellSize,cornerBL.y*cellSize,cellSize/10);
           circle(cornerBR.x*cellSize,cornerBR.y*cellSize,cellSize/10);
           circle(cornerTL.x*cellSize,cornerTL.y*cellSize,cellSize/10);
           circle(cornerTR.x*cellSize,cornerTR.y*cellSize,cellSize/10);
           fill(0);noStroke()
           text('A',cornerBL.x*cellSize,cornerBL.y*cellSize);
           text('B',cornerBR.x*cellSize,cornerBR.y*cellSize);
           text('C',cornerTL.x*cellSize,cornerTL.y*cellSize);
           text('D',cornerTR.x*cellSize,cornerTR.y*cellSize);
        pop();

        // Plot Interpolations
        /////////////////////////
        U = smoothInterp(idx,xGrid,txtX)
        V = smoothInterp(idy,yGrid,txtY)
        plotValues();

        AB = lerpInterp(idAB,U,valueA,valueB,['<b>A','<b>B'],1);
        CD = lerpInterp(idCD,U,valueC,valueD,['<b>C','<b>D'],2);
        Z  = lerpInterp(idZ,V,AB,CD ,['<b>AB','<b>CD'],3);

        // Draw constant XX YY lines
        //////////////////////////////
        push()
            strokeWeight(2);
                drawingContext.setLineDash([10, 5, 3, 5]);
                stroke(colorXX);line(x,0,x,nXY*cellSize);
                stroke(colorYY);line(0,y,nXY*cellSize,y);
            noStroke();
                fill(colorXX);text('XX_Y0',x,-dxy);text(`XX_Y${nXY}`,x,dxy+nXY*cellSize)
                fill(colorYY);text('YY_X0',-2*dxy,y);text(`YY_X${nXY}`,2*dxy+nXY*cellSize,y);
        pop()
        
        // Plot graphs constant rows-columns
        //////////////////////////////////////
        var xPixel = round(x);
        var yPixel = round(y);
        
        var XX = [];
        var YY = [];

        for(let i = 0;i<nXY*cellSize;i++){

            // pixel value gray scale[131, 131, 131, 255]
            XX.push( map( imgGradient.get(xPixel,i)[0], 0,255,-1,1 ));
            YY.push( map( imgGradient.get(i,yPixel)[0], 0,255,-1,1 ));
        };

        // XY: 0,1,2,3....nXY*cellSize
        // XX column vector
        // YY row vector
        plotRowsCols(idXX,XY,XX,yPixel,Z);
        plotRowsCols(idYY,XY,YY,xPixel,Z);
        
        // comparison between Perlin noise class values vs demos values (are the same)
        // console.log('-------')
        // console.table({xGrid,yGrid,indexX,indexY,temGradBL,temGradBR,temGradTL,temGradTR})

        // console.table class values vs scrpt values
        // _ class values 
        // var Z_ = noiseObject.eval(xGrid,yGrid).toFixed(4);
        // var U_ = noiseObject.U.toFixed(4);
        // var V_ = noiseObject.V.toFixed(4)
        // var A_ = noiseObject.valueA.toFixed(4);
        // var B_ = noiseObject.valueB.toFixed(4);
        // var C_ = noiseObject.valueC.toFixed(4);
        // var D_ = noiseObject.valueD.toFixed(4);
        // var AB_ = noiseObject.valueAB.toFixed(4);
        // var CD_ = noiseObject.valueCD.toFixed(4);

        // var sep1 = '----------------------';
        // var sep2 = '----------------------';
        // var sep3 = '----------------------';
        // console.table( {U_,V_,sep1,A_,B_,C_,D_,sep2,AB_,CD_,Z_,sep3,AB,CD,Z} )
        // console.log({Z})


    }else{

        // Plot Interpolations
        ///////////////////
        xGrid = 0; yGrid = 0;valueA = 0; valueB = 0; valueC = 0; valueD = 0;
        U  = smoothInterp(idx,xGrid,txtX);
        V  = smoothInterp(idy,yGrid,txtY);
        AB = lerpInterp(idAB,U,valueA,valueB,['<b>A','<b>B'],1);
        CD = lerpInterp(idCD,U,valueC,valueD,['<b>C','<b>D'],2);
        Z  = lerpInterp(idZ,V,AB,CD ,['<b>AB','<b>CD'],3);
        plotValues();

        // Plot rows-cols XX-YY
        ////////////////////////
        var xPixel = 0;
        var yPixel = 0;
        var yXY    = Z
        plotRowsCols(idXX,XY,XY0,yPixel,Z);
        plotRowsCols(idYY,XY,XY0,xPixel,Z);
    };
};

function drawGrid(){
    push()
        //  Grid
        for(let x=0;x<nXY;x++){
            for(let y=0;y<nXY;y++){
                
                var xc = x*cellSize;
                var yc = y*cellSize;
                noFill();strokeWeight(0.5)
                stroke(255)
                rect(xc,yc,cellSize);
            };
        };
        noStroke();
        // Text X
        for(let i=0;i<=nXY;i++){
            fill(255);text(`X${i}`,i*cellSize,-dxy-5);
        };
        
        // Text Y
        for(let i=0;i<=nXY;i++){
            fill(255);text(`Y${i}`,-dxy-5,i*cellSize);
        };
    pop()
};

function drawProjections(x,y,cornerBL,dx,dy,cornerVec,gradientVec,color){

    var X1           = cornerBL.x*cellSize + dx*cellSize;
    var Y1           = cornerBL.y*cellSize + dy*cellSize;   
    var a            = cornerVec.copy().mult(cellSize);
    var b            = gradientVec.copy().mult(cellSize);
    var num          = a.dot(b);
    var dem          = b.dot(b);
    var proyection   = b.mult(num/dem);
    var X2           = X1 + proyection.x
    var Y2           = Y1 + proyection.y

    push()

        drawingContext.setLineDash([5,5]);
        // Line from corner to mouse
        ///////////////////////////////
        strokeWeight(2);stroke(color); line(x,y,X2,Y2);

        // Projection Line
        /////////////////////
        strokeWeight(2);stroke(color);line(X1,Y1,X2,Y2);

    pop();
};

function drawGradients(){

	strokeWeight(5);
    var module    = gradientsModule;
    var arrowHead = 0.1;
    var color     = [255,255,255];

    for(let X=0;X<nXY;X++){
        for(let Y=0;Y<nXY;Y++){
                
                var indexX = X & 255;
                var indexY = Y & 255;
                
                var indexBL = P[ P[indexX]   + indexY   ];
                var indexBR = P[ P[indexX+1] + indexY   ];
                var indexTL = P[ P[indexX]   + indexY+1 ];
                var indexTR = P[ P[indexX+1] + indexY+1 ];
                
                var X1 = X*cellSize;
                var Y1 = Y*cellSize  + cellSize;
                var Gr = getGradient( indexTL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 

                var X1 = X*cellSize + cellSize;
                var Y1 = Y*cellSize + cellSize;
                var Gr = getGradient( indexTR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 

                var X1 = X*cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBL );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 

                var X1 = X*cellSize+cellSize;
                var Y1 = Y*cellSize;
                var Gr = getGradient( indexBR );
                var X2 = X1 + Gr.x*cellSize
                var Y2 = Y1 + Gr.y*cellSize
                myUtils.drawArrow([X1,Y1],[X2,Y2], {color:color, arrowHead:arrowHead,module:module}); 
        };
    };

};

function getGradient(index){

    var  k = index % 4;

    if( k == 0){
        return gradientBL

    }else if( k == 1){
        return gradientBR

    }else if( k == 2){
        return gradientTL

    }else{
        return gradientTR
    };

};

function plotValues(){

        var traceA= {
            x: [`<b>A<br>${(valueA).toFixed(4)}`],
            y: [valueA],
            type: 'bar',
            marker:{color: 'rgb(255,0,0)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var traceB= {
            x: [`<b>B<br>${(valueB).toFixed(4)}`],
            y: [valueB],
            type: 'bar',
            marker:{color: 'rgb(0,255,0)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var traceC= {
            x: [`<b>C<br>${(valueC).toFixed(4)}`],
            y: [valueC],
            type: 'bar',
            marker:{color: 'rgb(0,0,255)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var traceD= {
            x: [`<b>D<br>${(valueD).toFixed(4)}`],
            y: [valueD],
            type: 'bar',
            marker:{color: 'rgb(255,0,255)',size: 8,line:  {color: 'rgb(0,0,0)',width:1}},
        };

        var data = [traceA,traceB,traceC,traceD];
    
        var layout = {
            title: {text:`<b>Corners Values`,font:{size:12}},
            showlegend: false,
            width:  2*divSize +divPad,
            height: divSize,
            margin: {
                l: 40,
                r: 40,
                b: 50,
                t: 50,
                pad: 4
              },
    
              yaxis: {
                        range: [-1.1,1.1],
                        tickvals:[-1,0,1],
                        ticktext:['<b>-1','<b>0','<b>1']
                 },     
          }
    
        var config = {   
                        responsive: true,
                        displayModeBar: false}
          
        //Plotly.newPlot(idVals, data,layout,config);
    
}

function smoothInterp(id,gridValue,txt){

    // normalize values => scalar
    var tn = gridValue-floor(gridValue);
    var sn = 6*tn**5-15*tn**4+10*tn**3

    // normalize values =>array
    var t = myUtils.linspace(0,1,25);
    var s = t.map(t => 6*t**5-15*t**4+10*t**3);

    var traceInterpolation = {
        x: [0,tn,tn],
        y: [sn,sn,0],
        mode: 'lines+markers',
        line:  {color: 'rgb(0,0,0)',width: 0.5},
        marker:{color: 'rgb(127,127,127)',size: 6},
    };

    var traceFunction = {
        x: t,
        y: s,
        mode: 'lines',
        line:  {color: 'rgb(255,0,0)',width: 2}
    };


    var data = [traceInterpolation,traceFunction];

    var dxy = 0.2;

    var anotation = [  
                        // OUTPUT
                        {
                        x: dxy,
                        y: sn + dxy,
                        xref: 'x',
                        yref: 'y',
                        text: `${(sn).toFixed(4)}`,
                        showarrow: false,
                        },

                        // INPUT
                        {
                        x: tn + dxy,
                        y: dxy,
                        xref: 'x',
                        yref: 'y',
                        text: `${(tn).toFixed(4)}`,
                        showarrow: false,
                        }
                    ];


    var layout = {

        title: {text:`<b>Interpolate ${txt[0]}grid ${gridValue.toFixed(4)} <br> ${txt[1]}: ${sn.toFixed(4)} `,font:{size:12}},
        showlegend: false,
        width:  divSize,
        height: divSize,
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 40,
            pad: 4
          },
          xaxis: {
                    range: [0,1.2],
                    tickvals:[0,1],
                    ticktext:['<b>0','<b>1']
             },
          yaxis: {
                    range: [0,1.2],
                    tickvals:[0,1],
                    ticktext:['<b>0','<b>1']
             },
         annotations:anotation
      }

    var config = {   
                    responsive: true,
                    displayModeBar: false}
      
    //Plotly.newPlot(id, data,layout,config);

    return sn

};

function lerpInterp(id,tn,min,max,txt,k){

     
    if(min<=max){

        var MIN    = min;
        var MAX    = max;
        var lerpTxt = '';
    }else{
         
        var MIN = max;
        var MAX = min;
        txt.reverse();
        tn = 1-tn;
        var lerpTxt = '1-';
    }

    if(k==1){

        var txtTitle = 'Interpolate AB '
        var uv = `${lerpTxt}U`;

    }else if(k==2){

        var txtTitle = 'Interpolate CD '
        var uv = `${lerpTxt}U`;

    }else if(k==3){

        var txtTitle = 'noise(Xgrid,Ygrid) '
        var uv = `${lerpTxt}V`;
    };

    var interp = (MAX-MIN)*tn + MIN;

    var traceInterpolation = {
        x: [0,tn,tn],
        y: [interp,interp,0],
        mode: 'lines+markers',
        line:  {color: 'rgb(0,0,0)',width: 0.5},
        marker:{color: 'rgb(127,127,127)',size: 6},
    };

    var traceFunction = {
        x: [0,1],
        y: [MIN,MAX],
        mode: 'lines',
        line:  {color: 'rgb(255,0,0)',width: 2}
    };

    var data = [traceInterpolation,traceFunction];

    var anotation = [  
                        // INPUT
                        {
                        x: tn+0.02,
                        y: 0,
                        xref: 'x',
                        yref: 'y',
                        text: `<b>${uv}`,
                        showarrow: true,
                        arrowhead: 2,
                        ax: 20,
                        ay: -20
                        },
                    ];

    var layout = {
        title: {text:`<b>${txtTitle}: ${interp.toFixed(4)} `,font:{size:12}},
        showlegend: false,
        width:  divSize,
        height: divSize,
        margin: {
            l: 25,
            r: 25,
            b: 25,
            t: 40,
            pad: 2
          },
          xaxis: {
                    range: [0,1.1],
                    tickvals:[0,1],
                    ticktext:['<b>0','<b>1']
             },
          yaxis: {
                    //range:   [MIN*0.5,MAX*1.5],
                    tickvals:[MIN,MAX],
                    ticktext:txt,
             },
         annotations:anotation
      };

    var config = {   
                    responsive: true,
                    displayModeBar: false}
      
      //Plotly.newPlot(id, data,layout,config)

      return interp
};

function plotRowsCols(id,XY,rowORcol,xAnnotation,noiseValue){


    if(id=='XX'){
        var traceColor = colorXX;
    }else{
        var traceColor = colorYY;
     };


    var traceRowOrCol= {
            x: XY,
            y: rowORcol,
            mode: 'lines',
            //line:  {color:traceColor, width: 3,dash: 'dashdot',},
            line:  {color:traceColor, width: 3},
        };

    var traceLine = {
        x: [xAnnotation,xAnnotation,0],
        y: [0,noiseValue,noiseValue],
        mode: 'lines+markers',
        line:  {color: 'rgb(255,255,255)',width: 1},
        marker:{color: 'rgb(0,0,0)',size: 6},
    };

    var data = [traceRowOrCol,traceLine];

    var tickvalsArray = [];
    var ticktextArray = [];
    var letter        = 'X';
    var vector        = 'Row';

    if(id=='XX'){
        letter = 'Y';
        vector = 'Column';
    };

    for(let i=0;i<=nXY;i++){

        tickvalsArray.push(i*cellSize)
        ticktextArray.push(`<b>${letter}${i}`)
    };

    var layout = {

        title: {text:`<b>Plot ${vector} Vector ${id}: noise(Xgrid,Ygrid): ${noiseValue.toFixed(4)}`,font:{size:18}},
        plot_bgcolor:'rgb(127,127,127)',
        showlegend: false,
        width:  2*cellSize,
        height: cellSize,
        margin: {
            l: 40,
            r: 40,
            b: 40,
            t: 40,
            pad: 4
          },
          xaxis: {  
                    gridcolor:'rgb(200,200,200)',
                    tickfont:{size:16},
                    range: [0,nXY*cellSize+10],
                    tickvals:tickvalsArray,
                    ticktext:ticktextArray,
                    gridwidth: 2,
             },
          yaxis: { 
                    gridcolor:'rgb(200,200,200)',
                    range: [-1,1],
                    tickvals:[-1,1],
                    ticktext:['<b>-1','<b>1'],
                    tickfont:{size:16},
             },
         //annotations:anotation
      }

    var config = {   
                    responsive: true,
                    displayModeBar: false}
      
    Plotly.newPlot(id, data,layout,config);
    Plotly.newPlot(id, data,layout,config);
}



function createUpdateImage(gridCellSize){

    imgGradient.loadPixels();
    
    var imgW = imgGradient.width;
    var imgH = imgGradient.height;
    for (let i = 0; i < imgW; i++) {
        for (let j = 0; j < imgH; j++) {
            
            var xi   = map(i,0,imgW-1,0,nXY);
            var yi   = map(j,0,imgH-1,0,nXY);
            var z    = noiseObject.eval(xi,yi);
            var zMap = round(map(z,-1,1,0,255));
            var zRound =  Math.round(zMap/gridCellSize)*gridCellSize;

            imgGradient.set(i, j, zRound);
            // red gradient
            // imgGradient.set(i, j, color(255,0,0,a));
        }
      }

    imgGradient.updatePixels();
};

function windowResized() {

    window.location.reload();
    resizeCanvas(windowWidth, windowHeight);
};

function lerpInterpolation(tn,a,b){
         
    return (b-a)*tn + a;
};

function smoothInterpolation(tn){
 
    return 6*tn**5 - 15*tn**4 + 10*tn**3
};

