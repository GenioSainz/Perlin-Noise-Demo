clear all;clc;close all

sFun = @(x) 3*x.^2-2*x.^3;
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
    BLBR = lerp(xGrid,BL,BR);
    TLTR = lerp(xGrid,TL,TR);
    
    BLTL = lerp(yGrid,BL,TL);
    BRTR = lerp(yGrid,BR,TR);
    
    z1= lerp(yGrid,BLBR,TLTR);
    z2= lerp(xGrid,BLTL,BRTR);
    
    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-30,33)
    
    %%% CORNERS
    %%%%%%%%%%%%%%
    plot3(xCorners,yCorners,zCorners,'r');
    plot3(xCorners,yCorners,[0 0 0 0 0],'r')
    plot3([0 0],[0 0],[0 BL],'r');plot3([1 1],[0 0],[0 BR],'r');plot3([1 1],[1 1],[0 TR],'r');plot3([0 0],[1 1],[0 TL],'r');
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    scatter3(xCorners,yCorners,[0 0 0 0 0],MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    
    %%% x
    %%%%%%%%%%%%%%
    scatter3([xGrid xGrid xGrid xGrid],[0 0 1 1],[0 BLBR TLTR 0],MarkerFaceColor='b',MarkerEdgeColor='k',sizeData=100)
    plot3([xGrid xGrid xGrid xGrid xGrid],[0 0 1 1 0],[0 BLBR TLTR 0 0],'b')
    
    %%% y
    %%%%%%%%%%%%%%
    scatter3([0 0 1 1],[yGrid yGrid yGrid yGrid],[0 BLTL BRTR 0],MarkerFaceColor='g',MarkerEdgeColor='k',sizeData=100)
    plot3([0 0 1 1 0],[yGrid yGrid yGrid yGrid yGrid],[0 BLTL BRTR 0 0] ,'g')

    %%% z
    %%%%%%%%%%%%%%
    scatter3(xGrid,yGrid,z1,MarkerFaceColor='m',MarkerEdgeColor='k',sizeData=100)


subplot(1,2,2)

    for i= 1:length(y)
        for j = 1:length(x)
    
        BLBR_  = lerp(x(j),BL,BR);
        TLTR_  = lerp(x(j),TL,TR);
        
        BLTL_ = lerp(y(i),BL,TL);
        BRTR_ = lerp(y(i),BR,TR);
        
        z1_= lerp(y(i),BLBR_,TLTR_);
        z2_= lerp(x(j),BLTL_,BRTR_);
      
        Z1(i,j) = z1_; % z1 = z2

        u      = sFun(x(j));
        v      = sFun(y(i));

        BLBR_  = lerp(u,BL,BR);
        TLTR_  = lerp(u,TL,TR);  
        Z2(i,j)= lerp(v ,BLBR_,TLTR_);

    
        end
    end


    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-30,33)
 
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)

   mesh(X,Y,Z1,FaceColor='flat', EdgeColor='k')
   %mesh(X,Y,Z2+0,1,FaceColor=[0 1 0], EdgeColor='k')
