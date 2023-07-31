clear all;clc;close all


s1d = @(t)   3*t^2-2*t^3;
s2d = @(x,y) s1d(x)*s1d(y);

n = 21;
x = linspace(0,1,n);
y = x;

[X,Y]=meshgrid(x,y);

ZTL = zeros(n,n); ZTR = zeros(n,n);
ZBL = zeros(n,n); ZBR = zeros(n,n);

for i= 1:length(y)
    for j = 1:length(x)

    ZTL(i,j)=s2d( 1-x(j),y(i)   ); ZTR(i,j)=s2d( x(j),y(i)   );
    ZBL(i,j)=s2d( 1-x(j),1-y(i) ); ZBR(i,j)=s2d( x(j),1-y(i) );
 
    end
end

set(gcf,'position',[0 0 1000 1000]);set(gcf,'color','w');
ti = tiledlayout(2,2,TileSpacing = 'compact',Padding = 'compact');
title(ti,{'$s=3t^2-2t^3 \rightarrow S(x,y)=s(x)s(y)$';'$noise2D(x,y)=S(1-x,y)TL+S(x,y)TR+S(1-x,1-y)BL+S(x,1-y)BR$';' '},'Interpreter','latex',FontSize=18)

nexttile
hold on;box on;grid on;daspect([1,1,1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(1-x,y)$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZTL)

nexttile
hold on;box on;grid on;daspect([1,1,1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(x,y)$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZTR)

nexttile
hold on;box on;grid on;daspect([1,1,1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(1-x,1-y)$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZBL)

nexttile
hold on;box on;grid on;daspect([1,1,1]);axis([0 1 0 1 0 1]);xlabel('X');ylabel('Y');zlabel('Z')
title('$S(x,1-y)$','Interpreter','latex',FontSize=16)
view(-45,45)
mesh(X,Y,ZBR)

exportgraphics(gcf,'imgs/weightSurfaces.png','Resolution',300)





