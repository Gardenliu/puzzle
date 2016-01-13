/**
 * Created by Gardenliu on 2016/1/13.
 *
 * explorer
 * var  t=new Puzzle(2,2,220,220);//行与列,值越大,难度越高
    t.startGame();
 */
function Puzzle(row,col,conwidth,conheight){
    this.con=document.getElementById('container');
    this.item=[];
    this.conwidth=conwidth;
    this.conheight=conheight;
    this.row=row||3;
    this.col=col||3;
    this.minwidth=this.conwidth/this.col;
    this.minheight=this.conheight/this.row;
    this.num=this.row*this.col;
    this.arr=[];//初始化数组;
    this.newarr=[];//随机图片数组;
    this.pos=[];//存放位置的
    this.init();
    this.len=this.arr.length;
    this.minIndex=10;
};
Puzzle.prototype.init=function(){
    for(var i=1;i<=this.num;i++){
        this.arr.push(i);
    };
    this.newarr=this.arr.slice(0);
    var oFrag=document.createDocumentFragment();
    for(var i=0;i<this.num;i++){
        var div=document.createElement('div');
        div.style.cssText='background:url(http://img1.gtimg.com/henan/pics/hv1/22/225/1867/121459072.jpg) no-repeat -'+(i%this.col)*this.minwidth+'px -'+Math.floor((i)/this.col)*this.minheight+'px;float:left;height:'+this.minheight+'px;width:'+this.minwidth+'px;';
        this.item.push(div);
        oFrag.appendChild(div);
    };
    this.con.appendChild(oFrag);//得到文档碎片-4个div文档碎片--加载到#container元素中，
};
Puzzle.prototype.isSuccess=function(){//判断随机图片组是否在正确的位置
    for(var i=0;i<this.len-1;i++){
        if(this.newarr[i]!=this.arr[i])
        {
            return false;
        }
    };
    return true;
};
Puzzle.prototype.startGame=function(){
    //随机图片数组-打乱排序
    this.newarr.sort(function(a,b){
        return Math.random() > 0.5 ? 1 :-1;
    });
    //存放位置设置
    for(var i=0;i<this.len;i++){

        this.pos[i]=[this.item[i].offsetLeft,this.item[i].offsetTop];
    };
    console.log(this.pos)
    //存放位置css样式分配
    for(var i=0;i<this.len;i++){
        var n=this.newarr[i]-1;
        this.item[i].style.left=this.pos[i][0]+'px';
        this.item[i].style.top=this.pos[i][1]+'px';
        this.item[i].style.backgroundPosition='-'+(n % this.col)*this.minwidth+'px -'+Math.floor((n)/this.col)*this.minheight+'px';
        this.item[i].style.position='absolute';
        this.item[i].index=i;
        this.drag(this.item[i]);
    }
}
Puzzle.prototype.drag=function(o){//代表上面item[]元素-分开的div元素
    var self=this,near=null;//this代表Game对象属性
    var events={
        handleEvent:function(event){
            switch (event.type){
                case 'touchmove':
                    this.move(event);break;
                case 'touchstart':
                    this.start(event);break;
                case 'touchend':
                    this.end(event);break;
                default :break;
            }
        },
        start:function(event){
            event.preventDefault();
            event.stopPropagation();
            var touches=event.touches[0];
            disX=touches.pageX-o.offsetLeft,
                disY=touches.clientY-o.offsetTop;
            o.style.zIndex=self.minIndex++;
            addEventListener('touchmove', events, false);
            addEventListener('touchend', events, false);

        },
        move:function(event){
            var touches=event.touches[0];
            l=touches.pageX-disX,
                t=touches.pageY-disY;
            near=self.findNear(o);
            if(near){
                near.className='active';
            }
            o.style.left=l+'px';
            o.style.top=t+'px';
        },
        end:function(event){
            if(near){
                near.className='';
                self.move(o,{left:self.pos[near.index][0],top:self.pos[near.index][1]});
                self.move(near,{left:self.pos[o.index][0],top:self.pos[o.index][1]});

                var temp=0;
                temp=near.index;
                near.index=o.index;
                o.index=temp;

                for(var i=0;i<self.len;i++){
                    self.arr[i]=(self.item[i].index+1);
                }

                if(self.isSuccess()){
                    self.tips()
                }

            }else{
                self.move(o,{left:self.pos[o.index][0],top:self.pos[o.index][1]})
            }
//            console.log(self.arr);

            o.releaseCapture && o.releaseCapture();
            removeEventListener('touchmove', events, false);
            removeEventListener('touchend', events, false);
            self.setCapture && self.setCapture();
            events.preventDefault && events.preventDefault();
            return false;
        }
    };
    o.addEventListener('touchstart',events);

};
Puzzle.prototype.move=function(o,json,fn){
    o.timer && clearInterval(o.timer);
    o.timer=setInterval(function(){
        var bStop=true;
        for(var i in json){
            var iCur=css(o,i);
            var iSpeed=(json[i]-iCur)/5;iSpeed=iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
            if(json[i]!=iCur){
                bStop=false;
            };
            o.style[i]=(iCur+iSpeed)+'px';

        };

        if(bStop){
            clearInterval(o.timer);
            typeof fn=='function' && fn();
        };

    },10);

    function css(o,attr){
        return o.currentStyle ? parseFloat(o.currentStyle[attr]) : parseFloat(getComputedStyle(o,false)[attr]);
    }

};
Puzzle.prototype.tips=function(ts){
    var suc=document.createElement('div');
    var t=document.createElement('p');
    var tn=ts||3;
    var timer=null;
    suc.style.cssText='position:absolute;z-index:9999999;top:45%;width:100%;text-align:center;font-size:60px;color:#F56200;font-family:arial,黑体;';
    suc.innerHTML='oh yeah!';
    suc.appendChild(t);
    this.con.appendChild(suc);
    function updatetime(){
        t.innerHTML=tn--;
        if(tn<=0){
            clearInterval(timer);
            window.location.reload();
            return;
        }
        timer=setTimeout(function(){
            updatetime();
        },1000)
    }
    updatetime();
};
Puzzle.prototype.checkPZ=function(o1,o2){
    if(o1==o2)return;
    var l1=o1.offsetLeft,t1=o1.offsetTop,r1=o1.offsetWidth+l1,b1=o1.offsetHeight+t1;
    var l2=o2.offsetLeft,t2=o2.offsetTop,r2=o2.offsetWidth+l2,b2=o2.offsetHeight+t2;
    if(l1>r2 || t1>b2 || r1<l2 || b1<t2){
        return false;
    }
    else
    {
        return true;
    }
};
Puzzle.prototype.findNear=function(o){
    var iMin=99999,index=-1;
    for(var i=0;i<this.len;i++){
        this.item[i].className='';
        if(this.checkPZ(o,this.item[i])){
            var l=dis(o,this.item[i]);
            if(iMin>l)
            {
                iMin=l;
                index=i;
            };
        }
    };
    if(index==-1){
        return null;
    }
    else
    {
        return this.item[index];
    };
    function dis(o1,o2){
        var c1=o1.offsetLeft-o2.offsetLeft,c2=o1.offsetTop-o2.offsetTop;
        return Math.sqrt(c1*c1+c2*c2);
    }
};