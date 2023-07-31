clear all;clc;close all


s1d = @(t)   3*t^2-2*t^3;
s2d = @(x,y) s1d(x)*s1d(y);

n = 21;
x = linspace(0,1,n);
y = x;

[X,Y]=meshgrid(x,y);

ZTL = zeros(n,n); ZTR = zeros(n,n);
ZBL = zeros(n,n); ZBR = zeros(n,n);
Z   = zeros(n,n);

% vTL=[1 -1]; vTR=[-1 -1];
% vBL=[1  1]; vBR=[-1  1];

rowsRand = randperm(4);

gradients = [1 -1;
            -1 -1;
             1  1;
            -1  1];
gradients = gradients(rowsRand,:);
vTL=gradients(3,:); vTR=gradients(4,:);
vBL=gradients(1,:); vBR=gradients(2,:);

for i= 1:length(y)
    for j = 1:length(x)

    
        TL=dot(vTL,[x(j)-0,y(i)-1]); TR=dot(vTR,[x(j)-1,y(i)-1]);
        BL=dot(vBL,[x(j)-0,y(i)-0]); BR=dot(vBR,[x(j)-1,y(i)-0]);
    
                 ZBL(i,j) = s2d( 1-x(j),1-y(i) )*BL;
                 ZBR(i,j) = s2d( x(j)  ,1-y(i) )*BR;
                 ZTR(i,j) = s2d( x(j)  ,y(i)   )*TR;
                 ZTL(i,j) = s2d( 1-x(j),y(i)   )*TL;
                 Z(i,j)   = ZBL(i,j)+ZBR(i,j)+ZTR(i,j)+ZTL(i,j);
 
    end
end

set(gcf,'position',[0 0 1500 1000]);
ti = tiledlayout(2,3,TileSpacing = 'compact',Padding = 'compact');
title(ti,{'$s=3t^2-2t^3 \rightarrow S(x,y)=s(x)s(y)$';'$noise2D(x,y)=S(1-x,y)TL+S(x,y)TR+S(1-x,1-y)BL+S(x,1-y)BR$';' '},'Interpreter','latex',FontSize=18)

nexttile(1)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1 -1 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(1-x,y)TL$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZTL);

nexttile(2)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1 -1 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(x,y)TR$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZTR)

nexttile(3)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1]+[-1 1 -1 1]*0.5);xlabel('X');ylabel('Y');
title('$Gradient Vectors$','Interpreter','latex',FontSize=16)
scale=0.45;

quiver(0,1,vTL(1),vTL(2),scale,LineWidth=2,Color='r');quiver(1,1,vTR(1),vTR(2),scale,LineWidth=2,Color='r');
quiver(0,0,vBL(1),vBL(2)  ,scale,LineWidth=2,Color='r');quiver(1,0,vBR(1),vBR(2),scale,LineWidth=2,Color='r');
plot(polyshape([0 0 1 1],[1 0 0 1]),FaceColor='none',LineWidth=1.5);

nexttile(4)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1 -1 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(1-x,1-y)BL$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZBL)

nexttile(5)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1 -1 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(x,1-y)BR$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZBR)


nexttile(6)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1 -1 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$noise2D(x,y)$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,Z)


exportgraphics(gcf,'imgs/perlinNoiseInterpolation.png','Resolution',300)


