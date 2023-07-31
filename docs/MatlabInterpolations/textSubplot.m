

lerp   = @(t,a,b) a+(b-a)*t;
sFun1D = @(t) 3*t^2-2*t^3;
sFun2D = @(x,y) sFun1D(x)*sFun1D(y);
pieceWise2D = @(x,y,j,i,a,b,c,d) a+...
                                (b-a)*sFun1D(x-j)+...
                                (c-a)*sFun1D(y-i)+...
                                (a-b-c+d)*sFun1D(x-j)*sFun1D(y-i);

% CORNER VALUES                             

% TL  TR
%
% BL  BR

%%% METHOD 1 INTERPOLATION IN PERLIN NOISE AS LERP AND S fun
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
xn      = x-floor(x);
yn      = y-floor(y);
u       = sFun1D(xn);
v       = sFun1D(yn);
BLBR    = lerp(u,BL,BR);
TLTR    = lerp(u,TL,TR);  
Z1(x,y) = lerp(v ,BLBR,TLTR);

%%% METHOD 2 INTERPOLATION IN PERLIN NOISE AS SUM OF WEIGHTS SURFACES
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
xn      = x-floor(x);
yn      = y-floor(y);
Z2(x,y) = sFun2D(1-xn,1-yn)*BL +...
          sFun2D(xn,1-yn)*BR +...
          sFun2D(1-xn,yn)*TL +...
          sFun2D(xn,yn)*TR;

%%% METHOD 3 PieceWise2D
%%%%%%%%%%%%%%%%%%%%%%%%
Z3(x,y) = pieceWise2D(x,y,1j,1i,BL,BR,TL,TR);