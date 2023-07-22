clear all;clc;close all

sFun = @(x) 3*x^2-2*x^3;
lerp = @(t,a,b) a+(b-a)*t;

xGrid = 0.4;
yGrid = 0.8;

M  = [0.2 0.8 ;
      0.8 0.4];

BL = M(1,1);BR = M(1,2);
TL = M(2,1);TR = M(2,2);

x     = linspace(0,1,21);
y     = linspace(0,1,21);
[X,Y] = meshgrid(x,y);
Z1    = zeros(length(y),length(x));
Z2    = zeros(length(y),length(x));

xCorners = [0 1 1 0 0];
yCorners = [0 0 1 1 0];
zCorners = [BL BR TR TL BL];

set(gcf,'position',[0 0 1500 1000])

subplot(1,2,1)

    for i= 1:length(y)
        for j = 1:length(x)
    
        xj = x(j);
        yi = y(i);
      
        u = sFun(x(j));
        v = sFun(y(i));

        BLBR = lerp(u,BL,BR);
        TLTR = lerp(u,TL,TR);  
        Z1(i,j)= lerp(v ,BLBR,TLTR);

    
        end
    end

    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-30,33)
 
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    mesh(X,Y,Z1,FaceColor='flat', EdgeColor='k')

subplot(1,2,2)

    s1d = @(t)   3*t^2-2*t^3;
    s2d = @(x,y) s1d(x)*s1d(y);

    for i= 1:length(y)
        for j = 1:length(x)
    
        xj = x(j);
        yi = y(i);
      
        u = sFun(x(j));
        v = sFun(y(i));
 
        Z2(i,j)= s2d(1-xj,1-yi)*BL + s2d(xj,1-yi)*BR + s2d(1-xj,yi)*TL + s2d(xj,yi)*TR;

        end
    end

    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-30,33)
 
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    mesh(X,Y,Z2,FaceColor='flat', EdgeColor='k')

