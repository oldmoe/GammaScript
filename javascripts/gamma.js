//the gamma console, used to display output

function Console(id){
    this.out = $(id);
    this.write = function(str){
        this.out.value += str+"\n";
    }
    this.clear = function(){
        this.out.value="";
    }
}

function AdvancedConsole(id){
    this.out = $(id);
	this.out.style.overflow = "Auto";
	this.out.style.fontFamily= "courier";
	
    this.write = function(str){
		str = this.out.innerHTML+str+"<br \>"
        this.out.innerHTML = str;
    }
    this.clear = function(){
        this.out.innerHTML="";
    }
}

function ProgramManager(id){
  var moi = this;	
  this.myList = $(id);
  this.add = function(program){
    this.myList.options[this.myList.length] = new Option(program+" ("+GammaElement.programs[program].status+")",program);
  }

  this.redraw = function(){
    var length = this.myList.length;
    for(var i=0; i < length; i++){
      this.myList.options[0] = null;
    }
	GammaElement.programs.each(function(program){
		moi.myList.options[moi.myList.length] = new Option(program[0]+" ("+program[1].status+")",program[0]);
	});
  }
  
  this.remove = function(program){
       for(var option in this.myList.options){
            if(this.myList.options[option].value==program){
                this.myList.options[option]=null;
            }
       }
  }
  
}

function addElements(){
  try{
	  eval("var elements=["+$("elements").value+"]");
	  elements.each(function(el){S.putElement(GammaElement.begetObject().create(el))})
      $("elements").value = "";
  }catch(e){
      alert("only comma separated lists are allowed!");
  }
}
