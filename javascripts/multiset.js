var Multiset = {
    options : {xLimit:99, yLimit:99, active:false, interval:10},
	data : [],
	speed : 12,	
	association: "proximity",
    putElement : function(element){
        this.data.push(element);
        element.container = this;
        element.x = Math.round(Math.random()*this.options.xLimit)
        element.y = Math.round(Math.random()*this.options.yLimit)
		element.dirX = (Math.round(Math.random()*this.speed)+1)*[-1,1][Math.round(Math.random())];
		element.dirY = (Math.round(Math.random()*this.speed)+1)*[-1,1][Math.round(Math.random())];		
		if(this.options.active){
            element.invoke();
        }
		return element;
    },
	proximity : function(params){
		var elements = this.data.select(function(el){
			return Math.abs(el.x - params.element.x) <= params.range && Math.abs(el.y - params.element.y) <= params.range && el!=params.element;
		})
		for(var i = 0;i < elements.length;i++){
			var el = elements[i];
			if(el && !el.grabbed){
				if(params.condition_func(el)==0){
					el.active = false;
					return el;
				}else if(params.condition_func(el)==1){
					el.active = true;
					return el;
				}
			}	
		}
		return null;
	},
	random : function(params){
		var index = Math.round(Math.random()*this.data.length);
		var el = this.data[index];
		if(el && !el.grabbed){
			if(params.condition_func(el)==0){
				el.active = false;
				return el;
			}else if(params.condition_func(el)==1){
				el.active = true;
				return el;
			}
		}
		return null;
	},
    removeElement : function(element){
        var self = this;
		this.data.each(function(value,index){
			if(value == element){
				self.data.splice(index,1);
				delete element;
			}
		})
    },

    clearElements : function(){
        for(var e in this.data){
              delete this.data[e];
        }
		this.data = [];
        this.redraw();
    },

    addProgram : function(program){
		program.status = "active"
        GammaElement.programs[program.name] = program;
        pm.add(program.name);
    },

    removeProgram : function(name){
        delete GammaElement.programs[name];
        pm.remove(name);
	},

    activateProgram : function(name){
		var program = GammaElement.programs[name]; 
		if(program.status == "active"){
            program.status="inactive";
        }else{
            program.status="active";
        }
        pm.redraw();
    },

    activate : function(){
        this.options.interval=$("delay").value;
        for(var i=0; i < $("count").value; i++){
            num = Math.random()*100;
            num = Number(Math.round(num));
            el = GammaElement.begetObject().create(num);
            this.putElement(el);
        }
        this.options.active = true;
		this.data.each(function(element){
			element.invoke();
		})
  },

	drawCanvas : function(){
		var canvas = $("canvas");
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgb(0,0,64)";
		ctx.fillRect(0,0,300,300); 
		ctx.fillStyle = "rgb(200,200,255)";
		this.data.each(function(element){
			if(element.connectedTo != null) ctx.fillStyle = "rgb(255,200,100)"; 
			ctx.fillRect(element.x*3, element.y*1.5, 6, 3);
			ctx.fillStyle = "rgb(200,200,255)";
		})	
	},
	
    deactivate : function(){
        this.options.active = false;
        this.redraw();
    },

    redraw : function(){
		after.clear();
		var str = "";
		this.data.each(function(element){
						str+=element.data+":["+element.x+","+element.y+"]<br/>"
						});
		after.write(str);
		this.drawCanvas();
		
    },

    react : function(id){
	  var self = this;
	  if(!this.options.active)return;
	  var elements = this.data.select(function(el){return el.id == id}); 	
      if(elements[0]){
        elements[0].react();
        setTimeout(function(){self.react(id)},self.options.interval);
      }
	  this.redraw();
    }
}