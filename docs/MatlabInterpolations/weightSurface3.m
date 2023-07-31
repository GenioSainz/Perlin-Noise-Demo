clc;close all


s1d = @(t)   3*t^2-2*t^3;
s2d = @(x,y) s1d(x)*s1d(y);

n = 21;
x = linspace(0,1,n);
y = x;

[X,Y]=meshgrid(x,y);

ZTL = zeros(n,n); ZTR = zeros(n,n);
ZBL = zeros(n,n); ZBR = zeros(n,n);

STL = zeros(n,n); STR = zeros(n,n);
SBL = zeros(n,n); SBR = zeros(n,n);

dotZTL = zeros(n,n); dotZTR = zeros(n,n);
dotZBL = zeros(n,n); dotZBR = zeros(n,n);

Z   = zeros(n,n);

gradientTL=[1 -1]; gradientTR=[-1 -1];
gradientBL=[1  1]; gradientBR=[-1  1];

rowsRand = randperm(4);

% gradients = [1 -1;
%             -1 -1;
%              1  1;
%             -1  1];
% gradients = gradients(rowsRand,:);
% gradientTL=gradients(3,:); gradientTR=gradients(4,:);
% gradientBL=gradients(1,:); gradientBR=gradients(2,:);

for i= 1:length(y)
    for j = 1:length(x)

    
        TL=dot(gradientTL,[x(j)-0,y(i)-1]); TR=dot(gradientTR,[x(j)-1,y(i)-1]);
        BL=dot(gradientBL,[x(j)-0,y(i)-0]); BR=dot(gradientBR,[x(j)-1,y(i)-0]);
    
                 dotZBL(i,j) = BL;
                 dotZBR(i,j) = BR;
                 dotZTR(i,j) = TR;
                 dotZTL(i,j) = TL;

                 ZBL(i,j) = s2d( 1-x(j),1-y(i) );
                 ZBR(i,j) = s2d( x(j)  ,1-y(i) );
                 ZTR(i,j) = s2d( x(j)  ,y(i)   );
                 ZTL(i,j) = s2d( 1-x(j),y(i)   );

                 SBL(i,j) = s2d( 1-x(j),1-y(i) )*BL;
                 SBR(i,j) = s2d( x(j)  ,1-y(i) )*BR;
                 STR(i,j) = s2d( x(j)  ,y(i)   )*TR;
                 STL(i,j) = s2d( 1-x(j),y(i)   )*TL;

                 Z(i,j)   = ZBL(i,j)+ZBR(i,j)+ZTR(i,j)+ZTL(i,j);
 
    end
end

set(gcf,'position',[0 0 1500 1000]);set(gcf,'color','w');
annotation('rectangle',[0 0 1 1 ],'Color','k',LineWidth=4);
ti = tiledlayout(2,3,TileSpacing = 'compact',Padding = 'compact');
title(ti,{'$s=3t^2-2t^3 \rightarrow S(x,y)=s(x)s(y)$';'$noise2D(x,y)=S(1-x,y)TL+S(x,y)TR+S(1-x,1-y)BL+S(x,1-y)BR$';' '},'Interpreter','latex',FontSize=18)


scaleQuiver=0.475;

nexttile(1)
hold on;box on;grid on;%daspect([1,1,0.5]);%axis([-0.5 1.5 -0.5 1.5 -2 2]);
xlabel('X');ylabel('Y');zlabel('Z')
view(-45,45)
mesh(X,Y,dotZTL,'DisplayName','$TL=dot(gradTL,(x,y))$',FaceColor=[1 0 0],EdgeColor=[1 1 1]);
mesh(X,Y,ZTL   ,'DisplayName','$S(1-x,y)$',FaceColor=[0 1 0],EdgeColor=[1 1 1]);
legend('Interpreter','latex','NumColumns',1,'location','northoutside',FontSize=14)

nexttile(2)
hold on;box on;grid on;%daspect([1,1,2]);axis([0 1 0 1 -1 2]);
xlabel('X');ylabel('Y');zlabel('Z')
view(-45,45)
mesh(X,Y,dotZTR,'DisplayName','$TR=dot(gradTR,(x,y))$',FaceColor=[1 0 0],EdgeColor=[1 1 1]);
mesh(X,Y,ZTR   ,'DisplayName','$S(x,y)$',FaceColor=[0 1 0],EdgeColor=[1 1 1]);
legend('Interpreter','latex','NumColumns',1,'location','northoutside',FontSize=14)

nexttile(3)
hold on;box on;grid on;daspect([1,1,2]);axis([0 1 0 1]+[-1 1 -1 1]*0.5);xlabel('X');ylabel('Y');
title('$Gradient Vectors$','Interpreter','latex',FontSize=16)
quiver(0,1,gradientTL(1),gradientTL(2),scaleQuiver,LineWidth=2,Color='r')  ;quiver(1,1,gradientTR(1),gradientTR(2),scaleQuiver,LineWidth=2,Color='r');
quiver(0,0,gradientBL(1),gradientBL(2)  ,scaleQuiver,LineWidth=2,Color='r');quiver(1,0,gradientBR(1),gradientBR(2),scaleQuiver,LineWidth=2,Color='r');
plot(polyshape([0 0 1 1],[1 0 0 1]),FaceColor='none',LineWidth=1.5);

nexttile(4)
hold on;box on;grid on;%daspect([1,1,2]);axis([0 1 0 1 -1 2]);
xlabel('X');ylabel('Y');zlabel('Z')
view(-45,45)
mesh(X,Y,dotZBL,'DisplayName','$BL=dot(gradBL,(x,y))$',FaceColor=[1 0 0],EdgeColor=[1 1 1]);
mesh(X,Y,ZBL   ,'DisplayName','$S(1-x,1-y)$',FaceColor=[0 1 0],EdgeColor=[1 1 1]);
legend('Interpreter','latex','NumColumns',1,'location','northoutside',FontSize=14)

nexttile(5)
hold on;box on;grid on;%daspect([1,1,2]);axis([0 1 0 1 -1 2]);
xlabel('X');ylabel('Y');zlabel('Z')
view(-45,45)
mesh(X,Y,dotZBR,'DisplayName','$BR=dot(gradBR,(x,y))$',FaceColor=[1 0 0],EdgeColor=[1 1 1]);
mesh(X,Y,ZBR   ,'DisplayName','$S(x,1-y)$',FaceColor=[0 1 0],EdgeColor=[1 1 1]);
legend('Interpreter','latex','NumColumns',1,'location','northoutside',FontSize=14)

nexttile(6)
hold on;box on;grid on;%daspect([1,1,2]);axis([0 1 0 1 -1 1]);
xlabel('X');ylabel('Y');zlabel('Z')
title('$noise2D(x,y)$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,SBL+SBR+STL+STR)


exportgraphics(gcf,'imgs/perlinNoiseInterpolation.png','Resolution',300)



function plotGradients(scaleQuiver,gradientBL,gradientBR,gradientTL,gradientTR)

         quiver3(0,1,-1,gradientTL(1),gradientTL(2),0,scaleQuiver,LineWidth=2,Color='r');quiver3(1,1,-1,gradientTR(1),gradientTR(2),0,scaleQuiver,LineWidth=2,Color='r');
         quiver3(0,0,-1,gradientBL(1),gradientBL(2),0,scaleQuiver,LineWidth=2,Color='r');quiver3(1,0,-1,gradientBR(1),gradientBR(2),0,scaleQuiver,LineWidth=2,Color='r');
end
