

class PerlinNoise {

    constructor(){
        
        // float grid
        this.xn = 0;
        this.yn = 0;
        
        // permutation table index
        this.X = 0;
        this.Y = 0;

        // vector corner to (x,y)
        this.vectorBL = new p5.Vector(0,0); 
        this.vectorBR = new p5.Vector(0,0);  
        this.vectorTL = new p5.Vector(0,0);
        this.vectorTR = new p5.Vector(0,0); 
        
        // gradients corners 
        this.gradientBL = new p5.Vector(+1,+1); 
        this.gradientBR = new p5.Vector(-1,+1); 
        this.gradientTL = new p5.Vector(+1,-1); 
        this.gradientTR = new p5.Vector(-1,-1); 
        
        // gradients index
        this.indexBL = 0;
        this.indexBR = 0;
        this.indexTL = 0;
        this.indexTR = 0;
        
        // values
        this.valueA = 0;
        this.valueB = 0;
        this.valueC = 0;
        this.valueD = 0;

        this.U       = 0;
        this.V       = 0;
        this.valueAB = 0;
        this.valueCD = 0;
        this.valueZ = 0;
        
        // creation permutation table
        this.P = [];
        this.createPermutation();
    };

    createPermutation(){
        
        // Create table
        for(let i = 0; i < 256; i++) {
            this.P[i] = i;
        };
        
        // Suffle table
        this.P = PerlinNoise.suffleArray(this.P)
        
        // double permutation table to avoid overflows
        // for(let i=0;i<512;i++){
        //     this.P[i] = this.P[i%256] ;
        // };

        for(let i=0;i<256;i++){
   
              this.P.push(this.P[i]);
        };

    };

    eval(x,y){
        
        this.xn = x-Math.floor(x);
        this.yn = y-Math.floor(y);
        
        this.X  = Math.floor(x) & 255;
        this.Y  = Math.floor(y) & 255;
        
        this.indexTL = this.P[this.P[this.X] + this.Y+1]; this.indexTR = this.P[this.P[this.X+1] + this.Y+1];
        this.indexBL = this.P[this.P[this.X] + this.Y  ]; this.indexBR = this.P[this.P[this.X+1] + this.Y  ];

        this.vectorBL.set( this.xn  , this.yn  );  
        this.vectorBR.set( this.xn-1, this.yn  );  
        this.vectorTL.set( this.xn  , this.yn-1); 
        this.vectorTR.set( this.xn-1, this.yn-1); 

        this.valueA = this.vectorBL.dot( this.getGradient(this.indexBL) ); 
        this.valueB = this.vectorBR.dot( this.getGradient(this.indexBR) );
        this.valueC = this.vectorTL.dot( this.getGradient(this.indexTL) ); 
        this.valueD = this.vectorTR.dot( this.getGradient(this.indexTR) );

        this.U =  PerlinNoise.smoothInterpolation(this.xn);
        this.V =  PerlinNoise.smoothInterpolation(this.yn);

        this.valueAB = PerlinNoise.lerpInterpolation(this.U,this.valueA,this.valueB);
        this.valueCD = PerlinNoise.lerpInterpolation(this.U,this.valueC,this.valueD);
        this.valueZ  = PerlinNoise.lerpInterpolation(this.V,this.valueAB,this.valueCD);

        return this.valueZ

    };

    evalFractal(x,y,{nOctaves=2,f=0.005}={}){

        let A = 1;
        let z = 0;

        for(let octave=0;octave<nOctaves;octave++){

            z+= A * this.eval(x*f,y*f);
            A/= 0.5;
            f*= 2;
        };

        return z
    };

    getGradient(index){

        var  k = index % 4;

        if( k == 0){
            return this.gradientBL
    
        }else if( k == 1){
            return this.gradientBR
    
        }else if( k == 2){
            return this.gradientTL
    
        }else{
            return this.gradientTR
        };

    };

    static lerpInterpolation(tn,a,b){
         
        return (b-a)*tn + a;
    };

    static smoothInterpolation(tn){
     
        return 6*tn**5 - 15*tn**4 + 10*tn**3
    };
        
    static suffleArray(P){

        // Fisher–Yates Shuffle Algorithm example
        // suffleArray([0,1,2,3,4])
        // i=4 randInt[0,4]=3  0,1,2,3,4 --> 0,1,2,4,3
        // i=3 randInt[0,3]=2  0,1,2,4,3 --> 0,1,4,2,3
        // i=2 randInt[0,2]=0  0,1,4,2,3 --> 4,1,0,2,3
        // i=1 randInt[0,1]=1  4,1,0,2,3 --> 4,1,0,2,3

        for (var i = P.length - 1; i > 0; i--) {

                var j    = Math.floor( Math.random() * (i + 1) );
                var temp = P[i];
                           P[i] = P[j];
                           P[j] = temp;
                           // console.log(`i=${i} randInt[${0},${i}]=${j} `,P.toString());
        };

        return P
    };

};

