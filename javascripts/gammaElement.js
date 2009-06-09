var GammaElement = {
  id : 0,
  x : 0,
  y : 0,
  dirX : 0,
  dirY : 0,
  containter : null,
  conncetedTo : null,
  grabbed : false,
  data : {},
  create : function(data){
	if(data) this.data = data;
	GammaElement.count++;
	this.id = GammaElement.count;
	return this;
  }
}

GammaElement.count = 0;
GammaElement.programs = $H();

/*
    === The React Method ===
    This method is called periodically for every gamma element

*/
GammaElement.react = function(){
	if(this.x + this.dirX >= this.container.options.xLimit){
		this.x = this.container.options.xLimit;
		this.dirX = -1*this.dirX;
	}else if(this.x + this.dirX <= 0){
		this.x = 0;
		this.dirX = -1*this.dirX;		
	}else{
		this.x += this.dirX;
	}
	if(this.y + this.dirY >= this.container.options.yLimit){
		this.y = this.container.options.yLimit;
		this.dirY = -1*this.dirY;
	}else if(this.y + this.dirY <= 0){
		this.y = 0;
		this.dirY = -1*this.dirY;		
	}else{
		this.y += this.dirY;
	}
	for(var program in this.programs){
        if(this.programs[program].status=="active"){
            var argsLength  = this.programs[program]["condition"].length;
            if(argsLength==1){
                if(this.programs[program]["condition"](this)){
                    this.programs[program]["reaction"](this);
                    this.container.redraw();
                }
            }else if(argsLength==2 && this.container.data.length > 1){
                if(!this.grabbed){
                    if(this.connect(this.programs[program]["condition"])){
                        this.connectedTo.grabbed = true;
						if(this.connectedTo.active){
                            this.programs[program]["reaction"](this.connectedTo,this);
						}else{
                            this.programs[program]["reaction"](this,this.connectedTo);
						}
                        this.container.redraw();
                        this.connectedTo.grabbed = false;
                        this.connectedTo.active = false;
                    }
                }
            }
        }
    }
}

GammaElement.remove = function(){
    this.container.removeElement(this);
}

GammaElement.consume = function(element){
    element.remove();
}

GammaElement.produce = function(val){
    return this.container.putElement(GammaElement.begetObject().create(val));
}

GammaElement.connect = function(condition,method){
	var moi = this;
    if(e = this.container[this.container.association]({element:moi, range:10,condition_func:function(el){
											if (el == moi )return -1;
											if(condition(moi,el))return 0;
											if(condition(el,moi))return 1;
											}})){
        this.connectedTo = e;
        return e.grabbed = true;
    }
	this.connectedTo = null;
    return false;
}

GammaElement.invoke = function(){
	var moi = this;
	setTimeout(function(){moi.container.react(moi.id);},this.container.interval);
}