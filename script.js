var canvas = document.querySelector("canvas");

var gameStarted = false;
var gameStartTime = null;

canvas.width = window.innerWidth - 10.2;
canvas.height = window.innerHeight - 10.8;
console.log(canvas.height);

var c = canvas.getContext("2d");

var startButton = document.createElement("button");
startButton.innerHTML = "Oyunu Başlat";
startButton.style.position = "absolute";
startButton.style.left = "50%";
startButton.style.top = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.padding = "20px 40px";
startButton.style.fontSize = "24px";
startButton.style.zIndex = "5";
startButton.style.backgroundColor = "#8B4513"; // kahverengi (saddle brown)
startButton.style.color = "white"; // yazı rengi
startButton.style.border = "none";
startButton.style.borderRadius = "30px"; // yuvarlaklık
startButton.style.cursor = "pointer";
startButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
startButton.style.transition = "transform 0.2s, box-shadow 0.2s";
startButton.onmouseover = function () {
  startButton.style.transform = "translate(-50%, -50%) scale(1.05)";
  startButton.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.3)";
};
startButton.onmouseout = function () {
  startButton.style.transform = "translate(-50%, -50%) scale(1)";
  startButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
};

var gameOverScreen = document.createElement("div");
gameOverScreen.style.display = "none";
gameOverScreen.style.position = "absolute";
gameOverScreen.style.left = "50%";
gameOverScreen.style.top = "50%";
gameOverScreen.style.transform = "translate(-50%, -50%)";
gameOverScreen.style.backgroundColor = "rgba(18, 4, 4, 0.8)";
gameOverScreen.style.color = "white";
gameOverScreen.style.padding = "15px";
gameOverScreen.style.borderRadius = "15px";
gameOverScreen.style.zIndex = "7";
gameOverScreen.style.textAlign = "center";

document.body.appendChild(gameOverScreen);

var howToPlayButton = document.createElement("button"); // buton tasarımını gpt den öğrendim ai.md de var
howToPlayButton.innerHTML = "Nasıl Oynanır";
howToPlayButton.style.position = "absolute";
howToPlayButton.style.left = "50%";
howToPlayButton.style.top = "60%";
howToPlayButton.style.transform = "translate(-50%, -50%)";
howToPlayButton.style.padding = "12px 30px";
howToPlayButton.style.fontSize = "20px";
howToPlayButton.style.fontWeight = "600";
howToPlayButton.style.backgroundColor = "#FFD700";
howToPlayButton.style.color = "#333";
howToPlayButton.style.border = "none";
howToPlayButton.style.borderRadius = "20px";
howToPlayButton.style.cursor = "pointer";
howToPlayButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
howToPlayButton.style.transition = "transform 0.2s, box-shadow 0.2s";
howToPlayButton.style.zIndex = "5";

howToPlayButton.onmouseover = function () {
  howToPlayButton.style.transform = "translate(-50%, -50%) scale(1.05)";
  howToPlayButton.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
};
howToPlayButton.onmouseout = function () {
  howToPlayButton.style.transform = "translate(-50%, -50%) scale(1)";
  howToPlayButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
};

var backgroundMusic = new Audio("sounds/audio.mp3");
backgroundMusic.volume = 1;
backgroundMusic.loop = true;
var musicStarted = false;

var jumpSound = new Audio("sounds/jumpEffect.mp3");
var fireSound = new Audio("sounds/fireEffect.mp3");
var shieldSound = new Audio("sounds/shieldCrack.mp3");
jumpSound.volume = 1;
fireSound.volume = 0.2;
shieldSound.volume = 0.1;

window.addEventListener("mousemove", function () {
  if (!musicStarted) {
    backgroundMusic.play().catch(function (error) {
      musicStarted = false;
    });
  }
  musicStarted = true;
});

var howTo = document.createElement("div");
howTo.style.display = "none"; // sonradan açiyorum tıklaynca
howTo.style.position = "absolute";
howTo.style.left = "50%";
howTo.style.top = "50%";
howTo.style.transform = "translate(-50%, -50%)";
howTo.style.backgroundColor = "white";
howTo.style.padding = "15px";
howTo.style.borderRadius = "15px";
howTo.style.zIndex = "6";

howTo.innerHTML = `
    <h2 style="color: #333; margin-bottom: 20px;">Nasıl Oynanır?</h2>
    <div style="color: #666; line-height: 1.6;">
         <p><strong>1. Sol Üst Bölge:</strong> A ve D tuşlarıyla hareket et, yukarıdan gelen nesnelerden kaç!</p>
        <p><strong>2. Sol Üst Bölge:</strong> A ve D tuşlarıyla hareket et, aşağıdan gelen nesnelerden kaç!</p>
        <p><strong>Sol Alt Bölge:</strong> W tuşuyla zıpla ve düşmanlardan kaç!</p>
        <p><strong>Sağ İç Bölge:</strong> Space tuşuyla ateş et ve düşmanları vur!</p>
        <p><strong>Sağ Bölge:</strong> Beliren kalkanları mouse ile tıklayarak kır!</p>
        <p><strong>Dikkat:</strong> Her bölgede 3 canın var, düşmanlara çarpmamaya çalış!</p>
    </div>
    <button onclick="this.parentElement.style.display='none'" style="
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;">Kapat</button> 
`;

howToPlayButton.addEventListener("click", function () {
  howTo.style.display = "block";
});

document.body.appendChild(startButton);
document.body.appendChild(howToPlayButton);
document.body.appendChild(howTo);

startButton.addEventListener("click", function () {
  gameStartTime = Date.now();
  gameStarted = true;
  startButton.style.display = "none";

  howToPlayButton.style.display = "none";
  howTo.style.display = "none";
});

canvas.style.position = "relative";
canvas.style.zIndex = "1";

//
var shieldScale = 2; // boyutla sürekli oynadığım için değişkene atadm
var borderUzaklik = 60;
var innerSquareUzaklik = 100; // bunları belki daha sonra fonksiyonun içinde tanımlayabilirim
// canvası oyunuma göre parçalara bölüyorum başlangıç
const leftWidth = canvas.width / 2;
const totalHeight = canvas.height;

const topHeight = (totalHeight * 3) / 5;
const bottomHeight = totalHeight - topHeight;

const verticalBoxWidth = leftWidth / 2;
const verticalBoxHeight = topHeight;

const horizontalBoxWidth = leftWidth;
const horizontalBoxHeight = bottomHeight;

const rightStartX = canvas.width / 2;
const rightWidth = canvas.width / 2;
const canvasHeight = canvas.height;

const innerSquareSize = canvasHeight / 2;

const innerSquareX = rightStartX + (rightWidth - innerSquareSize) / 2;
const innerSquareY = (canvasHeight - innerSquareSize) / 2;
// canvas parçalama sonu
//

//
// her bölge için dokunulmazlık süresi belirliyiorum ki çarpısma anında peşpese çarpışma olmasın
var BlueEnemyCooldown = 5000;
var lastBlueEnemySpawn = new Date();

var GreenEnemyCooldown = 5000;
var lastGreenEnemySpawn = new Date();

var PinkEnemyCooldown = 5000;
var lastPinkEnemySpawn = new Date();

var OrangeEnemyCooldown = 5000;
var lastOrangeEnemySpawn = new Date();
//

//temel hareketler için tanımladığım değişkenler
var onGround = false;
var InputSpeed = 2;
var forceInputX = 0;
var forceInputY = 0;
const g = 7;
var constForce = 0.5;
var constdx = 2;
var imgScale = 3;
var lastJump = new Date();
var time = new Date();
var jumpCooldownTime = 1000;
var jumpForce = -900;
var spaceDown = false;

var frameDuration = 1000;
var walkAnimationCooldown = 700;
var walkAnimationTimeStart;
var hitCooldownTime = 200;
var lastHitTime = new Date();
//

// kullanıcıdan gelen inputa göre değişen booleanlar
var w = false;
var a = false;
var s = false;
var d = false;
var space = false;

document.addEventListener("keydown", function (event) {
  if (event.key === "w") {
    if (new Date() - lastJump > jumpCooldownTime) {
      // zıplama için cooldown süresi
      w = true;
      lastJump = new Date();
      jumpSound.currentTime = 0;
      jumpSound.play();
      // zıplayabilen tek nesne circleArray in 3. elemanı
    }
  }
  if (event.key === "a") {
    CircleArray[0].imgFaceDirection = -1;
    CircleArray[1].imgFaceDirection = -1;
    CircleArray[0].isWalking = true;
    CircleArray[1].isWalking = true;
    walkAnimationTimeStart = Date.now();
    a = true;
  }
  if (event.key === "s") {
    CircleArray[0].imgFaceDirection = 1;
    CircleArray[1].imgFaceDirection = 1;
    s = true;
  }
  if (event.key === "d") {
    CircleArray[0].imgFaceDirection = 1;
    CircleArray[1].imgFaceDirection = 1;
    CircleArray[0].isWalking = true;
    CircleArray[1].isWalking = true;
    walkAnimationTimeStart = Date.now();
    d = true;
  }
  if (event.code === "Space" && !spaceDown) {
    if (new Date() - lastHitTime > hitCooldownTime) {
      space = true;

      spaceDown = true;

      fireSound.currentTime = 0; //
      fireSound.play();
      // space tuşuna basıldığında bir kez ateş edilecek last hit time ı değiştirebilirim sonra
    }
  }
});

document.addEventListener("keyup", function (event) {
  // objelerin canFire canJump gibi özelliklerini keydown süresince tamamen devam ettirmemesi için ateş ettikten sonra canfire false yapıp tuştan elimizi çekince tekrar True olucak yani tuşa her basıldığında yanlızca 1 kere eylem gerçekleşecek
  if (event.key === "w") {
    jumpTimeEnd = new Date();
    if (jumpTimeEnd - lastJump < jumpCooldownTime) {
      // eğer w ye basıldıktan sonra cooldown süresi dolmadan tekrar w ye basılırsa canJump false olur ve zıplama gerçekleşmez
      CircleArray[2].canJump = true; // zıplayabilen tek nesne circleArray in 3. elemanı
    }

    w = false;
  }
  if (event.key === "a") {
    //   CircleArray[0].isWalking = false;
    //   CircleArray[1].isWalking = false;
    a = false;
  }
  if (event.key === "s") s = false;
  if (event.key === "d") {
    //   CircleArray[0].isWalking = false;
    //   CircleArray[1].isWalking = false;
    d = false;
  }
  if (event.code === "Space") {
    spaceDown = false;
    CircleArray[3].canFire = true; // Ateş edebilen tek eleman 4. eleman bi değişiklik yapmam gerekirse CircleArrayi gezerek kontrol sağlayabilirim.

    space = false;
  }
});

function Fire(x, y) {
  this.x = x;
  this.y = y;
  this.fireImage = new Image();
  this.fireImage.src = "images/magicBall.png";
  this.mass = 10;
  this.force_x = 0;
  this.force_y = -1.5;
  this.dx = 0;
  this.dy = 0;
  this.friction = 0;

  this.draw = function () {
    this.dy += this.force_y / this.mass;
    this.y += this.dy;
    c.drawImage(this.fireImage, this.x - 12, this.y - 130 + 30, 30, 90);
  };
}

function Character(
  circle,
  spriteSheet,
  spriteSheetMirrored,
  frameWidth,
  frameHeight,
  frameCount,
  status
) {
  // her karakter bir circle a sahip. Karakterlerin circleları collisionları , konumları , hareketleri barındırıyor. Sadece karakterin çizileceği konumu belirlemede rol oynuyor.
  this.circle = circle;
  this.spriteSheet = spriteSheet;
  this.spriteSheetMirrored = spriteSheetMirrored;

  this.frameWidth = frameWidth;
  this.frameHeight = frameHeight;
  this.frameCount = frameCount;
  this.currentFrame = 0;
  this.frameDuration = 100;
  this.status = status;
  this.lastFrameTime = 0;
  this.updateFrame = function () {
    this.currentFrame = (this.currentFrame + 1) % this.frameCount; // örneğin 11 frame lik bir animasyonu göstericekse her 11 frame de bir başa dönmesi için
  };

  this.draw = function () {
    if (Date.now() - this.lastFrameTime >= this.frameDuration) {
      this.updateFrame();
      this.lastFrameTime = Date.now();
    }

    c.save();

    if (Date.now() - walkAnimationTimeStart >= walkAnimationCooldown) {
      this.circle.isWalking = false;
    }

    if (this.circle.isWalking) {
      if (this.circle.imgFaceDirection == -1) {
        c.drawImage(
          this.spriteSheetMirrored, // spriteSheetin y ekseninne göre yansıtılmış hali , c.scale le yapınca bikaç bug oldu

          this.currentFrame * this.frameWidth,
          0,
          this.frameWidth,
          this.frameHeight,
          this.circle.x - (this.frameWidth / 2) * imgScale,
          this.circle.y - (this.frameHeight / 2) * imgScale,
          this.frameWidth * imgScale,
          this.frameHeight * imgScale
        );
      } else {
        c.drawImage(
          this.spriteSheet,
          this.currentFrame * this.frameWidth,
          0,
          this.frameWidth,
          this.frameHeight,
          this.circle.x - (this.frameWidth / 2) * imgScale,
          this.circle.y - (this.frameHeight / 2) * imgScale,
          this.frameWidth * imgScale,
          this.frameHeight * imgScale
        );
      }
    } else if (status == "idle") {
      c.drawImage(
        this.spriteSheet,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.circle.x - (this.frameWidth / 2) * imgScale,
        this.circle.y - (this.frameHeight / 2) * imgScale,
        this.frameWidth * imgScale,
        this.frameHeight * imgScale
      );

      // eğer yürümüyorsa char1idle sprite sheetini kullanıcam
    } else if (status == "idleWarrior") {
      c.drawImage(
        this.spriteSheet,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.circle.x - (this.frameWidth / 2) * imgScale + 30,
        this.circle.y - (this.frameHeight / 2) * imgScale - 40,
        this.frameWidth * imgScale,
        this.frameHeight * imgScale
      );

      // eğer yürümüyorsa char1idle sprite sheetini kullanıcam
    } else if (status == "jump") {
      c.drawImage(
        this.spriteSheet,
        0, // jump sprite sheetinde tek bir frame var
        this.frameHeight * 8,
        this.frameWidth,
        this.frameHeight,
        this.circle.x - (this.frameWidth / 2) * imgScale + 30,
        this.circle.y - (this.frameHeight / 2) * imgScale - 40,
        this.frameWidth * imgScale,
        this.frameHeight * imgScale
      );
    } else if (status == "walkWitch") {
      if (this.circle.dx < 0) {
        c.drawImage(
          this.spriteSheetMirrored,
          this.currentFrame * this.frameWidth,
          0,
          this.frameWidth,
          this.frameHeight,
          this.circle.x - this.frameWidth / 2,
          this.circle.y - this.frameHeight / 2 - 30,
          this.frameWidth,
          this.frameHeight
        );
      } else {
        c.drawImage(
          this.spriteSheet,
          this.currentFrame * this.frameWidth,
          0,
          this.frameWidth,
          this.frameHeight,
          this.circle.x - this.frameWidth / 2,
          this.circle.y - this.frameHeight / 2 - 30,
          this.frameWidth,
          this.frameHeight
        );
      }
    } else if (status == "hitWitch") {
      c.drawImage(
        this.spriteSheet,
        0, // jump sprite sheetinde tek bir frame var
        0,
        this.frameWidth,
        this.frameHeight,
        this.circle.x - this.frameWidth / 2,
        this.circle.y - this.frameHeight / 2 - 30,
        this.frameWidth,
        this.frameHeight
      );
    }
  };
}
// background tanımlıcam burda
var blueBackground = new Image();
blueBackground.src = "images/blueBackground.png";
var greenBackground = new Image();
greenBackground.src = "images/greenBackground.png";
var pinkBackground = new Image();
pinkBackground.src = "images/pinkBackground.png";
var orangeBackground = new Image();
orangeBackground.src = "images/orangeBackground.png";
var grayBackground = new Image();
grayBackground.src = "images/grayBackground.png";

function checkGameOver() {
  if (!gameStarted || !gameStartTime) return;

  if (
    blueHeartCount <= 0 ||
    greenHeartCount <= 0 ||
    pinkHeartCount <= 0 ||
    orangeHeartCount <= 0 ||
    grayHeartCount <= 0
  ) {
    const survivalTime = (Date.now() - gameStartTime) / 1000;
    const minutes = Math.floor(survivalTime / 60);
    const seconds = survivalTime % 60;

    gameOverScreen.innerHTML = `
          <h1>OYUN BİTTİ!</h1>
          <p>Hayatta Kalma Süren: ${minutes} dakika ${seconds} saniye</p>
          <p>Yeniden başlatmak için sayfayı yenileyin.</p>
      `;
    gameOverScreen.style.display = "block";
    gameStarted = false; // Oyunu durdur
  }
}
// hasConstantSpeed booleani sabit hareket eden nesnelerde true olur ve active keyi hareket sağlamaz
function Circle(x, y, radius, activeKey, borderColor, hasConstantSpeed) {
  // oyunumu temelde hareket eden yuvarlak nesneler üzerinde tasarladım. Oyundaki tüm karakterler birer ağırlığı sürtünmesi kuvveti hızı olan birer circle objesi. Yani circle objelerini karakterlerin konumlarını , çarpışmalararını , sürtünmelerini vb. hesaplamak için kullandım. Daha sonra karakterleri bu circle ların bulunduğu konumda çiziyorum.
  this.borderColor = borderColor;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.mass = 10;
  this.force_x = 0;
  this.force_y = 0;
  this.dx = 0;
  this.dy = 0;
  this.friction = 0.75;
  this.groundFriction = 0.95;
  this.activeKey = activeKey;
  this.canFire = true;
  this.canJump = true;
  this.hasConstantSpeed = hasConstantSpeed;
  this.direction = 1;
  this.imgFaceDirection = 1; // 1 sağa -1 sola
  this.velocityDirection = 1; // 1 sağa -1 sola
  this.isWalking = false;

  if (hasConstantSpeed) {
    this.friction = 0;
    this.groundFriction = 0;
    this.force_x = constForce;
  }

  this.draw = function (force_x, force_y) {
    if (!hasConstantSpeed) {
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

      this.x += this.dx * this.direction;
      this.y += this.dy * this.direction;
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      //c.strokeStyle = "blue";
      // c.stroke();
    } else if (hasConstantSpeed) {
      this.force_x = constForce * this.direction;
      this.force_y = g;
      //this.dx += this.force_x / this.mass;
      this.dy = this.force_y / this.mass;
      this.dx = constdx * this.direction;

      this.x += this.dx;
      this.y += this.dy;

      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      //c.strokeStyle = "blue";
      //c.stroke();
    }
  };
}

var CircleArray = [];
/*
CircleArray.push(new Circle(100, 900, 30, ["w"]));
CircleArray.push(new Circle(300, 100, 30, ["a", "d", "Space"]));
CircleArray.push(new Circle(1024, 650, 30, ["Space"]));
*/

CircleInBlue = new Circle(200, 450, 30, ["a", "d"], "Blue", false); // circle lar bulunduğu bölgenin bordercheck if bloğunu kullansın Temelde
CircleInGreen = new Circle(514, 36, 30, ["a", "d"], "Green", false);
CircleInPink = new Circle(100, 886, 30, ["w"], "Pink", false);
CircleInOrange = new Circle(1420, 654, 30, ["Space"], "Orange", true);
CircleInGreen.direction = -1;

//
//

//

//

//

//

//

//

//

//

//
//

var ClickableImageArray = [];
var greyImage = new Image();
greyImage.src = "images/shield.png"; // şimdilik magicBall kullanıyorum, istediğiniz image'ı koyabilirsiniz

function createClickableImage() {
  // Gri bölgenin sınırlarını hesapla (turuncu kare dışındaki sağ alan)
  var minX = canvas.width / 2 + borderUzaklik;
  var maxX = canvas.width - borderUzaklik;
  var minY = borderUzaklik;
  var maxY = canvas.height - borderUzaklik;

  // Turuncu karenin dışında rastgele konum seç
  var x, y;
  do {
    x = Math.random() * (maxX - minX) + minX;
    y = Math.random() * (maxY - minY) + minY;
  } while (
    x >= innerSquareX - innerSquareUzaklik &&
    x <= innerSquareX + innerSquareSize + innerSquareUzaklik &&
    y >= innerSquareY - innerSquareUzaklik &&
    y <= innerSquareY + innerSquareSize + innerSquareUzaklik
  );

  // Yeni image objesi oluştur
  const newImage = {
    x: x,
    y: y,
    width: 50 * shieldScale,
    height: 50 * shieldScale,
    creationTime: Date.now(),
    isClicked: false,
  };

  ClickableImageArray.push(newImage);
}

canvas.addEventListener("click", function (event) {
  // diğper event listener ile birşeltirmedim kafa karışıklığı olmasın diye
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Tüm imageleri kontrol et
  for (let i = ClickableImageArray.length - 1; i >= 0; i--) {
    const img = ClickableImageArray[i];

    // Tıklama image üzerinde mi kontrol et
    if (
      clickX >= img.x &&
      clickX <= img.x + img.width &&
      clickY >= img.y &&
      clickY <= img.y + img.height
    ) {
      // Image'a tıklandı, diziden çıkar
      ClickableImageArray.splice(i, 1);
      shieldSound.currentTime = 0;
      shieldSound.play();

      break;
    }
  }
});

function updateClickableImages() {
  if (!gameStarted) return;

  const currentTime = Date.now();
  if (currentTime - lastImageSpawn >= 5000) {
    createClickableImage();
    lastImageSpawn = currentTime;
  }

  // Mevcut imageleri kontrol et
  for (let i = ClickableImageArray.length - 1; i >= 0; i--) {
    const img = ClickableImageArray[i];

    // 10 saniye geçti mi kontrol et
    if (currentTime - img.creationTime >= 10000) {
      // 10 saniye geçti, can azalt ve image'ı sil
      grayHeartCount--;
      shieldSound.currentTime = 0;
      shieldSound.play();
      ClickableImageArray.splice(i, 1);
    }
  }
}

// Son image spawn zamanı
var lastImageSpawn = Date.now();
//

//
//enemy circle ları burda tanımlıyorum
var EnemyCircleArrayBlue = [];
var EnemyBlueCircleCount = 0; // bu daha sonra poplarken yardımcı olacak

/*function EnemyCircleBlue() {
  EnemyBlueCircleCount[EnemyBlueCircleCount] = new Circle(
    200,
    450,
    30,
    [],
    "Blue",
    false
  );
}*/

// blue için create ve update
// tüm renkleri birlikte yapınca sıkıntılar yasadim
function createBlueEnemy() {
  var randomX = Math.random() * (verticalBoxWidth - 60) + 30; // 30
  var y = 0;

  var enemy = new Circle(
    randomX,
    y,
    15, // radius değişeck
    [],
    "Blue",
    false
  );

  enemy.dy = 0.1;

  EnemyCircleArrayBlue.push(enemy);
}

// Targetlar için
var blueTarget = new Image();
blueTarget.src = "images/blueTarget.png";
var greenTarget = new Image();
greenTarget.src = "images/greenTarget.png";

var orangeTarget = new Image();
orangeTarget.src = "images/orangeTarget.png";
var pinkTarget = new Image();
pinkTarget.src = "images/pinkTarget.png";
var targetScale = 1.5;

function updateBlueEnemies() {
  if (!gameStarted) return;

  if (Date.now() - lastBlueEnemySpawn >= BlueEnemyCooldown) {
    createBlueEnemy();
    lastBlueEnemySpawn = Date.now();
  }

  // Mevcut düşmanları güncelle
  for (let i = EnemyCircleArrayBlue.length - 1; i >= 0; i--) {
    const enemy = EnemyCircleArrayBlue[i];

    // Düşmanı hareket ettir
    enemy.dy = 0.2;
    enemy.y += enemy.dy;

    // Target'ı düşmanın konumunda çiz
    c.drawImage(
      blueTarget,
      enemy.x - 25 * targetScale,
      enemy.y - 25 * targetScale,
      50 * targetScale,
      50 * targetScale
    );

    const dx = enemy.x - CircleInBlue.x;
    const dy = enemy.y - CircleInBlue.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // burayı tam anlamadım ai dan yardım aldım

    if (distance < enemy.radius + CircleInBlue.radius) {
      // Çarpışma gerçekleşti
      blueHeartCount--;
      // Çarpışan düşmanı sil
      EnemyCircleArrayBlue.splice(i, 1);
      continue;
    }

    // Eğer düşman bölgenin altına ulaştıysa sil
    if (enemy.y > verticalBoxHeight) {
      EnemyCircleArrayBlue.splice(i, 1);
    }
  }
}

//

//
//
//
//
//
//
//
//
//
//
var EnemyCircleArrayGreen = [];

function createGreenEnemy() {
  // Green bölgenin alt sınırında random x pozisyonu
  const randomX =
    Math.random() * (verticalBoxWidth - 60) + verticalBoxWidth + 30; // Green bölge için x offset eklendi
  const y = verticalBoxHeight; // Alt sınırdan başla

  // Yeni düşman oluştur
  const enemy = new Circle(
    randomX,
    y,
    15, // 15 i değiştirebilirim belki tekrar bak
    [], // şimdilik aktif keyi yok zaten enemy sadec eyerçekimi kullansın istyorum
    "Green",
    false
  );

  // Düşmanın yukarı doğru hareket etmesi için
  enemy.force_y = -2 * g; // Negatif hız ile yukarı hareket etsin

  EnemyCircleArrayGreen.push(enemy);
}

function updateGreenEnemies() {
  if (!gameStarted) return;

  if (Date.now() - lastGreenEnemySpawn >= GreenEnemyCooldown) {
    createGreenEnemy();
    lastGreenEnemySpawn = Date.now();
  }

  // Mevcut düşmanları güncelle
  for (let i = EnemyCircleArrayGreen.length - 1; i >= 0; i--) {
    const enemy = EnemyCircleArrayGreen[i];

    // Düşmanı hareket ettir
    enemy.y -= 1.2 * enemy.dy;
    const dx = enemy.x - CircleInGreen.x;
    const dy = enemy.y - CircleInGreen.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    c.drawImage(
      greenTarget,
      enemy.x - 25 * targetScale,
      enemy.y - 25 * targetScale,
      50 * targetScale,
      50 * targetScale
    );

    if (distance < enemy.radius + CircleInGreen.radius) {
      // Çarpışma gerçekleşti
      greenHeartCount--;
      // Çarpışan düşmanı sil
      EnemyCircleArrayGreen.splice(i, 1);
      continue;
    }

    // Eğer düşman bölgenin üstüne ulaştıysa sil
    if (enemy.y < 0) {
      EnemyCircleArrayGreen.splice(i, 1);
    }
  }
}
//
//
//
//
//
//
//
//
//
// orange düşman yaratma

var EnemyCircleArrayOrange = [];

function createOrangeEnemy() {
  randomX = Math.random() * (innerSquareSize - 60) + innerSquareX + 30;

  const enemy = new Circle(randomX, innerSquareY, 30, [], "Orange", false);

  EnemyCircleArrayOrange.push(enemy);
}

function updateOrangeEnemies() {
  if (!gameStarted) return;

  if (Date.now() - lastOrangeEnemySpawn >= OrangeEnemyCooldown) {
    createOrangeEnemy();
    lastOrangeEnemySpawn = Date.now();
  }

  for (let i = EnemyCircleArrayOrange.length - 1; i >= 0; i--) {
    const enemy = EnemyCircleArrayOrange[i];

    enemy.dy = -0.2;
    enemy.y += enemy.dy;

    c.drawImage(
      orangeTarget,
      enemy.x - 25 * targetScale,
      enemy.y - 25 * targetScale,
      50 * targetScale,
      50 * targetScale
    );

    // ok kontrolü tekrar bk sanırım bazen çarpışma olmadan düşman siliniyor
    for (let j = FireArray.length - 1; j >= 0; j--) {
      const fire = FireArray[j];
      const dx = enemy.x - fire.x;
      const dy = enemy.y - fire.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.radius + 15) {
        EnemyCircleArrayOrange.splice(i, 1);
        FireArray.splice(j, 1);
        break; // break koymayınca bozuluyor
      }
    }

    // Eğer düşman hala varsa ve zemine değdiyse
    if (i >= 0 && enemy.y > innerSquareY + innerSquareSize - enemy.radius) {
      orangeHeartCount--;
      EnemyCircleArrayOrange.splice(i, 1);
    }
  }
}
//
//
//
//
//
//
//
// pink için tomruk benzeri bişey img lazım
// pink düşman yaratma
var EnemyCircleArrayPink = [];

function createPinkEnemy() {
  const x = leftWidth;
  const y = canvas.height - 50;

  const enemy = new Circle(x, y, 30, [], "Pink", false);

  enemy.dy = -1;
  enemy.dx = 0;

  EnemyCircleArrayPink.push(enemy);
}

function updatePinkEnemies() {
  if (!gameStarted) return;

  if (Date.now() - lastPinkEnemySpawn >= PinkEnemyCooldown) {
    createPinkEnemy();
    lastPinkEnemySpawn = Date.now();
  }

  for (let i = EnemyCircleArrayPink.length - 1; i >= 0; i--) {
    const enemy = EnemyCircleArrayPink[i];

    enemy.x += -2;
    enemy.y = canvas.height - 65;

    const dx = enemy.x - CircleInPink.x;
    const dy = enemy.y - CircleInPink.y;
    const distance = Math.sqrt(dx * dx + dy * dy); // bu algoritmayı kurarken ai dan yardım aldım
    c.drawImage(
      pinkTarget,
      enemy.x - 25 * targetScale,
      enemy.y - 25 * targetScale,
      50 * targetScale,
      50 * targetScale
    );

    if (distance < enemy.radius + CircleInPink.radius) {
      // Çarpışma gerçekleşti
      pinkHeartCount--;
      // Çarpışan düşmanı sil
      EnemyCircleArrayPink.splice(i, 1);
      continue;
    }

    if (enemy.x < 0) {
      EnemyCircleArrayPink.splice(i, 1);
    }
  }
}
//
//
// Animate fonksiyonunda green düşmanları da güncelle ve çiz

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  char1idle.draw();
  drawDivider();
  drawLeftPartition();
  drawRightPartition();
  drawHearts();

  // Düşmanları güncelle ve çiz
  updateBlueEnemies();
  updateGreenEnemies();

  // Blue düşmanları çiz
  for (let i = 0; i < EnemyCircleArrayBlue.length; i++) {
    EnemyCircleArrayBlue[i].draw(0, 0);
  }

  // Green düşmanları çiz
  for (let i = 0; i < EnemyCircleArrayGreen.length; i++) {
    EnemyCircleArrayGreen[i].draw(0, 0);
  }

  // ... existing code ...
}
// ... existing code ...

// green için create ve update
//
//
//
//

//spreadSheetleri imgleri burda tanımlıcam

// char1walk için spriteSheetler
var walkSpriteSheet = new Image();
walkSpriteSheet.src = "images/walk.png";
var walkSpriteSheetMirrored = new Image();
walkSpriteSheetMirrored.src = "images/walkMirrored.png";

var char1walk = new Character(
  CircleInBlue,
  walkSpriteSheet,
  walkSpriteSheetMirrored,
  96,
  64,
  8,
  "walk"
);

// char1idle için spriteSheetler
var idleSpriteSheet = new Image();
idleSpriteSheet.src = "images/idle.png";
var idleSpriteSheetMirrored = new Image();
idleSpriteSheetMirrored.src = "images/idleMirrored.png";
var char1idle = new Character(
  CircleInBlue,
  idleSpriteSheet,
  idleSpriteSheetMirrored,
  64,
  64,
  15,
  "idle"
);
//

// char2idle spriteSheet
var idleSpriteSheetUD = new Image();
idleSpriteSheetUD.src = "images/idleUD.png";
var idleSpriteSheetMirroredUD = new Image();
idleSpriteSheetMirroredUD.src = "images/idleMirroredUD.png";

var walkSpriteSheetUD = new Image();
walkSpriteSheetUD.src = "images/walkUD.png";
var walkSpriteSheetMirroredUD = new Image();
walkSpriteSheetMirroredUD.src = "images/walkMirroredUD.png";

var char2idle = new Character(
  CircleInGreen,
  idleSpriteSheetUD,
  idleSpriteSheetMirroredUD,
  64,
  64,
  15,
  "idle"
);
var char2walk = new Character(
  CircleInGreen,
  walkSpriteSheetUD,
  walkSpriteSheetMirroredUD,
  96,
  64,
  8,
  "walk"
);

// char3 için spriteSheetler
var jumpSpriteSheet = new Image();
jumpSpriteSheet.src = "images/warrior.png";

var char3idle = new Character(
  CircleInPink,
  jumpSpriteSheet,
  jumpSpriteSheet,
  69,
  44,
  6,
  "idleWarrior"
);
var char3jump = new Character(
  CircleInPink,
  jumpSpriteSheet,
  jumpSpriteSheet,
  69,
  44,
  6,
  "jump"
);

//char4 için spriteSheetler
var witchWalkSpriteSheet = new Image();
witchWalkSpriteSheet.src = "images/witchWalk.png";

var witchWalkSpriteSheetMirrored = new Image();
witchWalkSpriteSheetMirrored.src = "images/witchWalkMirrored.png";

var witchHitSpriteSheet = new Image();
witchHitSpriteSheet.src = "images/witchHit.png";

var char4hit = new Character(
  CircleInOrange,
  witchHitSpriteSheet,
  witchHitSpriteSheet,
  231,
  190,
  2,
  "hitWitch"
);
var char4walk = new Character(
  CircleInOrange,
  witchWalkSpriteSheet,
  witchWalkSpriteSheetMirrored,
  231,
  190,
  8,
  "walkWitch"
);

CircleArray.push(CircleInBlue);

CircleArray.push(CircleInGreen);

CircleArray.push(CircleInPink);

CircleArray.push(CircleInOrange);

// hearth çizdirme
var hearth = new Image();
hearth.src = "images/heart.png";

var deathHeart = new Image();
deathHeart.src = "images/deathHeart.png";

//blue bölge
var blueHeartY = 10;

var blueHeartX1 = verticalBoxWidth / 8;
var blueHeartX2 = (verticalBoxWidth / 8) * 2;
var blueHeartX3 = (verticalBoxWidth / 8) * 3;

// green ama kalbi aşağıda çizdiriyorum

var greenHeartY = verticalBoxHeight - verticalBoxHeight / 8; // yeşil bölge için kalp y koordinatı
var greenHeartX1 = verticalBoxWidth + verticalBoxWidth / 8;
var greenHeartX2 = verticalBoxWidth + (verticalBoxWidth / 8) * 2;
var greenHeartX3 = verticalBoxWidth + (verticalBoxWidth / 8) * 3;
// pink bölge
var pinkHeartY = verticalBoxHeight + 10;
var pinkHeartX1 = 0 + leftWidth / 16;
var pinkHeartX2 = leftWidth / 16 + leftWidth / 16;
var pinkHeartX3 = leftWidth / 16 + (leftWidth / 16) * 2;
// orange
var orangeHeartY = innerSquareY;
var orangeHeartX1 = innerSquareX + innerSquareSize / 8;
var orangeHeartX2 = innerSquareX + innerSquareSize / 8 + innerSquareSize / 8;
var orangeHeartX3 =
  innerSquareX + innerSquareSize / 8 + (innerSquareSize / 8) * 2;

// gray
var grayHeartY = 10;
var grayHeartX1 = canvas.width / 2 + canvas.width / 24;
var grayHeartX2 = canvas.width / 2 + (canvas.width / 24) * 2;
var grayHeartX3 = canvas.width / 2 + (canvas.width / 24) * 3;
// kalp sayıları

var blueHeartCount = 3;
var greenHeartCount = 3;
var pinkHeartCount = 3;
var orangeHeartCount = 3;
var grayHeartCount = 3;

const borderThickness = canvas.height * 0.005;
function drawHearts() {
  switch (blueHeartCount) {
    case 0:
      c.drawImage(deathHeart, blueHeartX1, blueHeartY, 50, 50);
      c.drawImage(deathHeart, blueHeartX2, blueHeartY, 50, 50);
      c.drawImage(deathHeart, blueHeartX3, blueHeartY, 50, 50);

      break;
    case 1:
      c.drawImage(hearth, blueHeartX1, blueHeartY, 50, 50);
      c.drawImage(deathHeart, blueHeartX2, blueHeartY, 50, 50);
      c.drawImage(deathHeart, blueHeartX3, blueHeartY, 50, 50);

      break;

    case 2:
      c.drawImage(hearth, blueHeartX1, blueHeartY, 50, 50);
      c.drawImage(hearth, blueHeartX2, blueHeartY, 50, 50);
      c.drawImage(deathHeart, blueHeartX3, blueHeartY, 50, 50);

      break;
    case 3:
      c.drawImage(hearth, blueHeartX1, blueHeartY, 50, 50);
      c.drawImage(hearth, blueHeartX2, blueHeartY, 50, 50);
      c.drawImage(hearth, blueHeartX3, blueHeartY, 50, 50);
      break;
    default:
      break;
  }
  switch (greenHeartCount) {
    case 0:
      c.drawImage(deathHeart, greenHeartX1, greenHeartY, 50, 50);

      c.drawImage(deathHeart, greenHeartX2, greenHeartY, 50, 50);
      c.drawImage(deathHeart, greenHeartX3, greenHeartY, 50, 50);
      break;
    case 1:
      c.drawImage(hearth, greenHeartX1, greenHeartY, 50, 50);
      c.drawImage(deathHeart, greenHeartX2, greenHeartY, 50, 50);
      c.drawImage(deathHeart, greenHeartX3, greenHeartY, 50, 50);
      break;
    case 2:
      c.drawImage(hearth, greenHeartX1, greenHeartY, 50, 50);
      c.drawImage(hearth, greenHeartX2, greenHeartY, 50, 50);
      c.drawImage(deathHeart, greenHeartX3, greenHeartY, 50, 50);
      break;
    case 3:
      c.drawImage(hearth, greenHeartX1, greenHeartY, 50, 50);
      c.drawImage(hearth, greenHeartX2, greenHeartY, 50, 50);
      c.drawImage(hearth, greenHeartX3, greenHeartY, 50, 50);
      break;
    default:
      break;
  }
  switch (pinkHeartCount) {
    case 0:
      c.drawImage(deathHeart, pinkHeartX1, pinkHeartY, 50, 50);
      c.drawImage(deathHeart, pinkHeartX2, pinkHeartY, 50, 50);
      c.drawImage(deathHeart, pinkHeartX3, pinkHeartY, 50, 50);
      break;
    case 1:
      c.drawImage(hearth, pinkHeartX1, pinkHeartY, 50, 50);
      c.drawImage(deathHeart, pinkHeartX2, pinkHeartY, 50, 50);
      c.drawImage(deathHeart, pinkHeartX3, pinkHeartY, 50, 50);
      break;
    case 2:
      c.drawImage(hearth, pinkHeartX1, pinkHeartY, 50, 50);
      c.drawImage(hearth, pinkHeartX2, pinkHeartY, 50, 50);
      c.drawImage(deathHeart, pinkHeartX3, pinkHeartY, 50, 50);
      break;
    case 3:
      c.drawImage(hearth, pinkHeartX1, pinkHeartY, 50, 50);
      c.drawImage(hearth, pinkHeartX2, pinkHeartY, 50, 50);
      c.drawImage(hearth, pinkHeartX3, pinkHeartY, 50, 50);
      break;
    default:
      break;
  }
  switch (orangeHeartCount) {
    case 0:
      c.drawImage(deathHeart, orangeHeartX1, orangeHeartY, 50, 50);
      c.drawImage(deathHeart, orangeHeartX2, orangeHeartY, 50, 50);
      c.drawImage(deathHeart, orangeHeartX3, orangeHeartY, 50, 50);
      break;
    case 1:
      c.drawImage(hearth, orangeHeartX1, orangeHeartY, 50, 50);
      c.drawImage(deathHeart, orangeHeartX2, orangeHeartY, 50, 50);
      c.drawImage(deathHeart, orangeHeartX3, orangeHeartY, 50, 50);
      break;
    case 2:
      c.drawImage(hearth, orangeHeartX1, orangeHeartY, 50, 50);
      c.drawImage(hearth, orangeHeartX2, orangeHeartY, 50, 50);
      c.drawImage(deathHeart, orangeHeartX3, orangeHeartY, 50, 50);
      break;
    case 3:
      c.drawImage(hearth, orangeHeartX1, orangeHeartY, 50, 50);
      c.drawImage(hearth, orangeHeartX2, orangeHeartY, 50, 50);
      c.drawImage(hearth, orangeHeartX3, orangeHeartY, 50, 50);
      break;
    default:
      break;
  }
  switch (grayHeartCount) {
    case 0:
      c.drawImage(deathHeart, grayHeartX1, grayHeartY, 50, 50);
      c.drawImage(deathHeart, grayHeartX2, grayHeartY, 50, 50);
      c.drawImage(deathHeart, grayHeartX3, grayHeartY, 50, 50);
      break;
    case 1:
      c.drawImage(hearth, grayHeartX1, grayHeartY, 50, 50);
      c.drawImage(deathHeart, grayHeartX2, grayHeartY, 50, 50);
      c.drawImage(deathHeart, grayHeartX3, grayHeartY, 50, 50);
      break;
    case 2:
      c.drawImage(hearth, grayHeartX1, grayHeartY, 50, 50);
      c.drawImage(hearth, grayHeartX2, grayHeartY, 50, 50);
      c.drawImage(deathHeart, grayHeartX3, grayHeartY, 50, 50);
      break;
    case 3:
      c.drawImage(hearth, grayHeartX1, grayHeartY, 50, 50);
      c.drawImage(hearth, grayHeartX2, grayHeartY, 50, 50);
      c.drawImage(hearth, grayHeartX3, grayHeartY, 50, 50);
      break;
    default:
      break;
  }
}

var FireArray = [];

var blueOffset = 50; // blue bölgesinin offseti
var greenOffset = -20; // green bölgesinin offseti
var orangeOffset = 40; // orange bölgesinin offseti
var pinkOffset = 30; // pink bölgesinin offseti

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);
  char1idle.draw();
  drawDivider(); // ortadaki dikey çizgi
  drawLeftPartition(); // sol tarafı 3e böl
  drawRightPartition();
  drawHearts(); // kalp çizdirme ama tekrr bakmam gerekiyo
  updateBlueEnemies();
  updateGreenEnemies();
  updateOrangeEnemies();
  updatePinkEnemies();
  updateClickableImages();
  checkGameOver();
  //enemy çizdirme
  //
  //
  //
  //
  for (let i = 0; i < EnemyCircleArrayBlue.length; i++) {
    EnemyCircleArrayBlue[i].draw(0, 0);
  }
  for (let i = 0; i < EnemyCircleArrayGreen.length; i++) {
    EnemyCircleArrayGreen[i].draw(0, 0);
  }
  for (let i = 0; i < EnemyCircleArrayOrange.length; i++) {
    EnemyCircleArrayOrange[i].draw(0, 0);
  }
  for (let i = 0; i < EnemyCircleArrayPink.length; i++) {
    EnemyCircleArrayPink[i].draw(0, 0);
  }
  for (let i = 0; i < ClickableImageArray.length; i++) {
    const img = ClickableImageArray[i];
    c.drawImage(greyImage, img.x, img.y, img.width, img.height);
  }
  //
  //
  //

  for (let i = 0; i < CircleArray.length; i++) {
    let forceInputX = 0;
    let forceInputY = 0;

    for (let j = 0; j < CircleArray[i].activeKey.length; j++) {
      if (w && CircleArray[i].activeKey[j] == "w") {
        if (CircleArray[i].canJump) {
          console.log(CircleArray[i].canJump);
          forceInputY -= jumpForce;
          CircleArray[i].canJump = false;
        }
      }

      if (a && CircleArray[i].activeKey[j] == "a") forceInputX -= InputSpeed;
      if (s && CircleArray[i].activeKey[j] == "s") forceInputY += InputSpeed;
      if (d && CircleArray[i].activeKey[j] == "d") forceInputX += InputSpeed;
      //

      if (Date.now() - lastHitTime > hitCooldownTime) {
        char4walk.draw();
      } else {
        char4hit.draw();
      }

      if (
        space &&
        CircleArray[i].activeKey[j] == "Space" &&
        spaceDown &&
        CircleArray[3].canFire
      ) {
        if (Date.now() - lastHitTime > hitCooldownTime) {
          lastHitTime = Date.now();
          var newFire = new Fire(CircleArray[i].x, CircleArray[i].y);

          FireArray.push(newFire);
          CircleArray[i].canFire = false;
          // ateş edince karakterin canFire özelliği false oluyor ve ateş edemiyor. Bu yüzden ateş etme animasyonunu burda çiziyorum.
        }
      }

      //
    }

    /*if (space && CircleArray[i].activeKey[j] == "Space") {
        if (CircleArray[i].canFire) {
          var newFire = new Fire(CircleArray[i].x, CircleArray[i].y);

          FireArray.push(newFire);
          CircleArray[i].canFire = false;
          char4hit.draw(); // ateş edince karakterin canFire özelliği false oluyor ve ateş edemiyor. Bu yüzden ateş etme animasyonunu burda çiziyorum.
        }
      }
        */

    /*
    if (w && CircleArray[i].activeKey == "w") forceInputY -= InputSpeed;
    if (a && CircleArray[i].activeKey == "a") forceInputX -= InputSpeed;
    if (s && CircleArray[i].activeKey == "s") forceInputY += InputSpeed;
    if (d && CircleArray[i].activeKey == "d") forceInputX += InputSpeed;
*/
    CircleArray[i].draw(forceInputX, forceInputY);
  }

  for (let f = 0; f < FireArray.length; f++) {
    FireArray[f].draw();
  }
  if (CircleArray[0].isWalking) {
    char1walk.draw();
    char2walk.draw();
  } else {
    char1idle.draw();
    char2idle.draw();
  }

  if (CircleArray[2].dy > 1.6 || CircleArray[2].dy < -1.6) {
    char3jump.draw();
  } else {
    char3idle.draw();
  }

  function bordercheck() {
    for (let i = 0; i < CircleArray.length; i++) {
      let circle = CircleArray[i];

      let xMin = 0,
        xMax = canvas.width;
      let yMin = 0,
        yMax = canvas.height;

      // Rengine göre sınırları ayarla
      switch (circle.borderColor) {
        case "Blue":
          xMin = 0;
          xMax = verticalBoxWidth;
          yMin = 0;
          yMax = verticalBoxHeight - blueOffset;
          break;
        case "Green":
          xMin = verticalBoxWidth;
          xMax = verticalBoxWidth * 2;
          yMin = -greenOffset;
          yMax = verticalBoxHeight;
          break;
        case "Pink":
          xMin = 0;
          xMax = leftWidth;
          yMin = topHeight;
          yMax = canvas.height - pinkOffset;
          break;
        case "Orange":
          xMin = innerSquareX;
          xMax = innerSquareX + innerSquareSize;
          yMin = innerSquareY;
          yMax = innerSquareY + innerSquareSize - orangeOffset;

          break;
      }

      // X sınırları
      if (circle.x - circle.radius < xMin) {
        circle.x = xMin + circle.radius;
        circle.dx = -circle.dx;

        if (circle.borderColor == "Orange") {
          circle.direction *= -1;
          circle.dx *= 0.3;
        }
      }
      if (circle.x + circle.radius > xMax) {
        circle.x = xMax - circle.radius;
        circle.dx = -circle.dx;
        if (circle.borderColor == "Orange") {
          circle.direction *= -1;
          circle.dx *= 0.3;
        }
      }

      // Y sınırları
      if (circle.y - circle.radius < yMin) {
        circle.y = yMin + circle.radius;
        circle.dy = -circle.dy;
      }
      if (circle.y + circle.radius > yMax) {
        circle.y = yMax - circle.radius;
        circle.dy = -circle.dy;

        if (circle.borderColor !== "Orange") {
          onGround = true;
        }
      } else {
        onGround = false;
      }
    }
  }

  bordercheck();

  //

  //

  //
}

function drawLeftPartition() {
  // 1. Dikey Sol
  c.fillStyle = "#add8e6"; // açık mavi
  c.fillRect(0, 0, verticalBoxWidth, verticalBoxHeight);

  // 2. Dikey Sağ
  c.fillStyle = "#90ee90"; // açık yeşil
  c.fillRect(verticalBoxWidth, 0, verticalBoxWidth, verticalBoxHeight);

  // 3. Alt Yatay
  c.fillStyle = "#ffcccb"; // açık kırmızı
  c.fillRect(0, verticalBoxHeight, horizontalBoxWidth, horizontalBoxHeight);

  c.drawImage(blueBackground, 0, 0, verticalBoxWidth, verticalBoxHeight);
  c.drawImage(
    greenBackground,
    verticalBoxWidth,
    0,
    verticalBoxWidth,
    verticalBoxHeight
  );

  c.drawImage(
    pinkBackground,
    0,
    verticalBoxHeight,
    horizontalBoxWidth,
    horizontalBoxHeight
  );

  c.strokeStyle = "#8B4513"; // Kahverengi
  c.lineWidth = borderThickness;

  // Blue bölge çerçevesi
  c.strokeRect(
    borderThickness / 2,
    borderThickness / 2,
    verticalBoxWidth - borderThickness,
    verticalBoxHeight - borderThickness
  );

  // Green bölge çerçevesi
  c.strokeRect(
    verticalBoxWidth + borderThickness / 2,
    borderThickness / 2,
    verticalBoxWidth - borderThickness,
    verticalBoxHeight - borderThickness
  );

  // Pink bölge çerçevesi
  c.strokeRect(
    borderThickness / 2,
    verticalBoxHeight + borderThickness / 2,
    horizontalBoxWidth - borderThickness,
    horizontalBoxHeight - borderThickness
  );
}

// Ortadan bir çizgi çekerek canvas'ı görsel olarak ikiye bölebilirsin
function drawDivider() {
  c.beginPath();
  c.moveTo(canvas.width / 2, 0);
  c.lineTo(canvas.width / 2, canvas.height);
  c.strokeStyle;
  c.lineWidth = 2;
  c.stroke();
}

function drawRightPartition() {
  // Dış kare (tam sağ yarı)
  c.fillStyle = "#e0e0e0"; // gri ton
  c.fillRect(canvas.width / 2, 0, rightWidth, canvasHeight);

  // İç kare (canvas yüksekliğinin yarısı)
  c.fillStyle = "#ffa500"; // turuncu
  c.fillRect(innerSquareX, innerSquareY, innerSquareSize, innerSquareSize);
  c.drawImage(grayBackground, canvas.width / 2, 0, rightWidth, canvasHeight);
  c.drawImage(
    orangeBackground,
    innerSquareX,
    innerSquareY,
    innerSquareSize,
    innerSquareSize
  );
  c.drawImage(
    orangeBackground,
    innerSquareX,
    innerSquareY,
    innerSquareSize,
    innerSquareSize
  );
  c.strokeStyle = "#8B4513"; // Kahverengi
  c.lineWidth = borderThickness;

  // Gray bölge çerçevesi
  c.strokeRect(
    canvas.width / 2 + borderThickness / 2,
    borderThickness / 2,
    rightWidth - borderThickness,
    canvasHeight - borderThickness
  );

  // Orange bölge çerçevesi
  c.strokeRect(
    innerSquareX + borderThickness / 2,
    innerSquareY + borderThickness / 2,
    innerSquareSize - borderThickness,
    innerSquareSize - borderThickness
  );
}
/*
document.addEventListener("mousemove", function (event) {
  console.log("X:", event.clientX, "Y:", event.clientY);
});*/

animate();

/*
function bordercheck() {
  for (let i = 0; i < CircleArray.length; i++) {
    // şuan her circleArraydeki objenin borderları aynı onlar için ayrı borderlar yaz
    let circle = CircleArray[i];
    // temel canvasın x kontrolleri ama her kutu bulunduğu renk için ekstra kontrol edilebilir
    if (circle.x + circle.radius > canvas.width) {
      circle.x = canvas.width - circle.radius;
      circle.dx = -circle.dx;
    }

    if (circle.x - circle.radius < 0) {
      circle.x = circle.radius;
      circle.dx = -circle.dx;
    }

    // sonradan eklenen kutuların x ve ybordercheckleri burda daha parçalara bölünmüş kutular için sahip olunan renge göre bordercheck yapıyoruz.
    let xMin, xMax, yMin, yMax;

    if (circle.borderColor === "Blue") {
      // Mavi
      xMin = 0;
      xMax = verticalBoxWidth;
      yMin = 0;
      yMax = verticalBoxHeight;
    } else if (circle.borderColor === "Green") {
      // Yeşil
      xMin = verticalBoxWidth;
      xMax = verticalBoxWidth * 2;
      yMin = 0;
      yMax = verticalBoxHeight;
    } else if (circle.borderColor === "Pink") {
      // Pembe aslında gerek yok ama sonradan bişey eklersem diye pembeyide yazdım.
      xMin = 0;
      xMax = leftWidth;
      yMin = topHeight;
      yMax = canvas.height;
    } else if (circle.borderColor === "Orange") {
      // Turuncu
      xMin = innerSquareX;
      xMax = innerSquareX + innerSquareSize;
      yMin = innerSquareY;
      yMax = innerSquareY + innerSquareSize;
    } else {
      continue;
    }

    //if(circle.x - circle.radius<)
    // temel canvasın y kontrolleri
    if (circle.y + circle.radius > canvas.height) {
      circle.y = canvas.height - circle.radius;
      circle.dy = -circle.dy;
      onGround = true;
    } else {
      onGround = false; // onGround u sürtünme yerde farklı olabilir diye yazdım emin değilim değiştirebilirim.
    }

    if (circle.y - circle.radius < 0) {
      circle.y = circle.radius;
      circle.dy = -circle.dy;
    }
  }
}
*/

// Event listeners
howToPlayButton.addEventListener("click", function () {
  howTo.style.display = "block";
});
