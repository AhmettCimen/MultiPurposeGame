  var canvas = document.querySelector("canvas");

  canvas.width = window.innerWidth - 100;
  canvas.height = window.innerHeight - 100;
  console.log(canvas.height);

  var c = canvas.getContext("2d");
  var onGround = false;

  var InputSpeed = 30;
  var forceInputX = 0;
  var forceInputY = 0;
  const g = 10;

  var w = false;
  var a = false;
  var s = false;
  var d = false;
  var space= false;


  document.addEventListener("keydown", function (event) {
    if (event.key === "w") w = true;
    if (event.key === "a") a = true;
    if (event.key === "s") s = true;
    if (event.key === "d") d = true;
    if(event.code==="Space") space=true;
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "w") w = false;
    if (event.key === "a") a = false;
    if (event.key === "s") s = false;
    if (event.key === "d") d = false;
    if(event.code==="Space"){
      CircleArray[i].canFire=true;
      space=false;


    } 
    
  });


  function Fire(x,y){
    this.x=x;
    this.y=y;
    this.fireImage= new Image();
    this.fireImage.src="images/fire.png"
    this.mass = 10;
    this.force_x = 0;
    this.force_y = -10;
    this.dx = 0;
    this.dy = 0;
    this.friction = 0.95;
    
    
    

    this.draw= function(){



      this.dy +=this.force_y/this.mass
      this.y += this.dy;
      c.drawImage(this.fireImage,this.x-50,this.y+30,100,50)
    }
    
  }

  function Circle(x, y, radius,activeKey) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = 10;
    this.force_x = 0;
    this.force_y = 0;
    this.dx = 0;
    this.dy = 0;
    this.friction = 0.95;
    this.groundFriction = 0.85;
    this.activeKey=activeKey;
    this.canFire=true;
    

    this.draw = function (force_x, force_y) {
      this.force_x = force_x;
      this.force_y = force_y + g;

      this.dx += this.force_x / this.mass;
      this.dy += this.force_y / this.mass;

      if (onGround) {
        this.dx *= this.groundFriction;
      } else {
        this.dx *= this.friction;
      }

      this.dy *= this.friction;

      this.x += this.dx;
      this.y += this.dy;

      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.strokeStyle = "blue";
      c.stroke();
    };
  }

  var CircleArray = [];
  CircleArray.push(new Circle(100, 100, 30,["w"]));
  CircleArray.push(new Circle(300,100,30,["a","d"]));
  CircleArray.push(new Circle(500,100,30,["Space"]));

  var FireArray=[];


  function bordercheck() {
    for (let i = 0; i < CircleArray.length; i++) {
      let circle = CircleArray[i];
      if (circle.x + circle.radius > canvas.width) {
        circle.x = canvas.width - circle.radius;
        circle.dx = -circle.dx;
      }

      if (circle.x - circle.radius < 0) {
        circle.x = circle.radius;
        circle.dx = -circle.dx;
      }

      if (circle.y + circle.radius > canvas.height) {
        circle.y = canvas.height - circle.radius;
        circle.dy = -circle.dy;
        onGround = true;
      } else {
        onGround = false;
      }

      if (circle.y - circle.radius < 0) {
        circle.y = circle.radius;
        circle.dy = -circle.dy;
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    


    for (let i = 0; i < CircleArray.length; i++) {

    let forceInputX = 0;
    let forceInputY = 0;

    for(let j=0;j < CircleArray[i].activeKey.length;j++){

      if (w && CircleArray[i].activeKey[j]=="w") forceInputY -= InputSpeed;
      if (a && CircleArray[i].activeKey[j]=="a") forceInputX -= InputSpeed;
      if (s && CircleArray[i].activeKey[j]=="s") forceInputY += InputSpeed;
      if (d && CircleArray[i].activeKey[j]=="d") forceInputX += InputSpeed;


      if(space&&CircleArray[i].activeKey[j]=="Space"){      // ateş etme fonksiyonu burada olucak
        
        if(CircleArray[i].canFire){
        var newFire= new Fire(CircleArray[i].x,CircleArray[i].y);
        
        FireArray.push(newFire);
        CircleArray[i].canFire=false;
        
        }


  


      }




    } 

      if (w && CircleArray[i].activeKey=="w") forceInputY -= InputSpeed;
      if (a && CircleArray[i].activeKey=="a") forceInputX -= InputSpeed;
      if (s && CircleArray[i].activeKey=="s") forceInputY += InputSpeed;
      if (d && CircleArray[i].activeKey=="d") forceInputX += InputSpeed;


      CircleArray[i].draw(forceInputX, forceInputY);
    }

    for (let f = 0; f < FireArray.length; f++) {
    
    FireArray[f].draw();
  }

    bordercheck();
  }

  animate();
