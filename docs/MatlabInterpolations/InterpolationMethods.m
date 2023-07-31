clear all;clc;close all

lerp   = @(t,a,b) a+(b-a)*t;
sFun1D = @(t) 3*t^2-2*t^3;
sFun2D = @(x,y) sFun1D(x)*sFun1D(y);
pieceWise2D = @(x,y,j,i,a,b,c,d) a+...
                                (b-a)*sFun1D(x-j)+...
                                (c-a)*sFun1D(y-i)+...
                                (a-b-c+d)*sFun1D(x-j)*sFun1D(y-i);

xGrid = 0.4;
yGrid = 0.8;

M  = [0.0 0.8 ;
      0.8 1.0];

BL = M(1,1);BR = M(1,2);
TL = M(2,1);TR = M(2,2);

x     = linspace(0,1,21);
y     = linspace(0,1,21);
[X,Y] = meshgrid(x,y);
Z1    = zeros(length(y),length(x));
Z2    = zeros(length(y),length(x));
Z3    = zeros(length(y),length(x));

xCorners = [0 1 1 0 0];
yCorners = [0 0 1 1 0];
zCorners = [BL BR TR TL BL];

set(gcf,'position',[0 0 1500 1000]);set(gcf,'color','w');
ti = tiledlayout(1,3,TileSpacing = 'compact',Padding = 'compact');


%%% METHOD 1
%%%%%%%%%%%%%%%%%%%%%%%%
nexttile

    for i= 1:length(y)
        for j = 1:length(x)
    
        xj = x(j);
        yi = y(i);
      
        u = sFun1D(x(j));
        v = sFun1D(y(i));

        BLBR = lerp(u,BL,BR);
        TLTR = lerp(u,TL,TR);  
        Z1(i,j) = lerp(v ,BLBR,TLTR);

        end
    end

    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-45,45)
    title({'METHOD 1';' '})
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    mesh(X,Y,Z1,FaceColor='flat', EdgeColor='k')

%%% METHOD 2
%%%%%%%%%%%%%%%%%%%%%%%%
nexttile

    for i= 1:length(y)
        for j = 1:length(x)
    
        xj = x(j);
        yi = y(i);
 
        Z2(i,j) = sFun2D(1-xj,1-yi)*BL + sFun2D(xj,1-yi)*BR + sFun2D(1-xj,yi)*TL + sFun2D(xj,yi)*TR;

        end
    end

    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-45,45)
    title({'METHOD 2';' '})
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    mesh(X,Y,Z2,FaceColor='flat', EdgeColor='k')


%%% METHOD 3
%%%%%%%%%%%%%%%%%%%%%%%%
nexttile

    for i= 1:length(y)
        for j = 1:length(x)
    
        xj = x(j);
        yi = y(i);
      
        %pieceWise2D(x,y,j,i,a,b,c,d)
   
        Z3(i,j) = pieceWise2D(xj,yi,0,0,BL,BR,TL,TR);

        end
    end

    hold on;box on;grid on;daspect([1 1 1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
    view(-45,45)
    title({'METHOD 3';' '})
    scatter3(xCorners,yCorners,zCorners,MarkerFaceColor='r',MarkerEdgeColor='k',sizeData=100)
    mesh(X,Y,Z3,FaceColor='flat', EdgeColor='k')

