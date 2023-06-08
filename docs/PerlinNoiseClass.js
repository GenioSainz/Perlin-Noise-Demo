

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
        
        this.valueA = 0;
        this.valueB = 0;
        this.valueC = 0;
        this.valueD = 0;

        this.U       = 0;
        this.V       = 0;
        this.valueAB = 0;
        this.valueCD = 0;
        this.valueZ = 0;
        
        this.P = [];
        this.createPermutation();
    };

    createPermutation(){
        
        // Create
        for(let i = 0; i < 256; i++) {
            this.P[i] = i;
        };
        
        // Suffle table
        for (var i = this.P.length - 1; i > 0; i--) {

                var j = Math.floor( Math.random() * (i + 1));
                var temp = this.P[i];
                           this.P[i] = this.P[j];
                           this.P[j] = temp;
        };
    };

    eval(x,y){
        
        this.xn = x-Math.floor(x);
        this.yn = y-Math.floor(y);
        
        this.vectorBL.set( this.xn  , this.yn  );  
        this.vectorBR.set( this.xn-1, this.yn  );  
        this.vectorTL.set( this.xn  , this.yn-1); 
        this.vectorTR.set( this.xn-1, this.yn-1); 
        
        this.X  = Math.floor(x) & 255;
        this.Y  = Math.floor(y) & 255;
        
        this.indexBL = this.P[ this.P[this.X]   + this.Y   ];
        this.indexBR = this.P[ this.P[this.X+1] + this.Y   ];
        this.indexTL = this.P[ this.P[this.X]   + this.Y+1 ];
        this.indexTR = this.P[ this.P[this.X+1] + this.Y+1 ];


        this.valueA = this.vectorBL.dot( this.getGradient(this.indexBL) );
        this.valueB = this.vectorBR.dot( this.getGradient(this.indexBR) );
        this.valueC = this.vectorTL.dot( this.getGradient(this.indexTL) );
        this.valueD = this.vectorTR.dot( this.getGradient(this.indexTR) );

        this.U = this.smoothInterpolation(this.xn);
        this.V = this.smoothInterpolation(this.yn);

        this.valueAB = this.lerpInterpolation(this.U,this.valueA,this.valueB);
        this.valueCD = this.lerpInterpolation(this.U,this.valueC,this.valueD);
        this.valueZ  = this.lerpInterpolation(this.V,this.valueAB,this.valueCD);

        return this.valueZ

    };

    evalFractal(x,y,{nOctaves=2,f=0.005}={}){

        let A = 1;
        let z = 0;

        for(let octave=0;octave<nOctaves;octave++){

            z+= A * this.eval(x*f,y*f);
            A*= 0.5;
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

    lerpInterpolation(tn,a,b){
         
        return (b-a)*tn + a;
    };

    smoothInterpolation(tn){
     
        return 6*tn**5 - 15*tn**4 + 10*tn**3
    };

};