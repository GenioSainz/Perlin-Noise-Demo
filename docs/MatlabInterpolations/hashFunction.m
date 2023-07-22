clear all;clc;close all

n  = 7;
k  = 3;
xC = linspace(-k*n,k*n,1000);
xD = -k*n:k*n;

set(gcf,'color','w');
set(gcf,'position',[0,0,1600,800])
ti = tiledlayout(1,2,TileSpacing = 'compact',Padding = 'compact');

nexttile
    hold on;box on;grid on;daspect([2,1,1]);%axis([-n n -n n]*k+[-1 1 -1 1])
    plot(xC,rem(xC,n),'r');
    scatter(xD,rem(xD,n),MarkerFaceColor='b',MarkerEdgeColor='k',SizeData=25);
    xticks(-k*n:n:k*n)
    yticks([-n 0 n])
    title('y = x%7 = rem(x,7)',FontSize=22)
 
nexttile
    hold on;box on;grid on;daspect([1 1 1]);axis([-n n -n n]+[-1 1 -1 1]*2)
    plot(xD,bitand(xD,n,'int32'),'r');
    scatter(xD,bitand(xD,n,'int32'),MarkerFaceColor='none',MarkerEdgeColor='b',SizeData=600);
    
    k = 1;
    for x=-n-k:n+k
        for y=-n-k:n+k
    
            X = bitand(x,n,'int32');
            Y = bitand(y,n,'int32');
            
            txt = sprintf('(%d,%d)',X,Y);
            text(x,y,txt,'HorizontalAlignment','center','VerticalAlignment','middle',FontWeight='bold')
    
        end
    end

    title('(x,y) = (x&7,y&7)',FontSize=22)