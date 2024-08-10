let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    this.paper = paper;

    // Touch event listeners
    paper.addEventListener('touchstart', (e) => this.touchStart(e));
    document.addEventListener('touchmove', (e) => this.touchMove(e));
    document.addEventListener('touchend', () => this.touchEnd());

    // Mouse event listeners
    document.addEventListener('mousemove', (e) => this.mouseMove(e));
    paper.addEventListener('mousedown', (e) => this.mouseDown(e));
    window.addEventListener('mouseup', () => this.mouseUp());
  }

  touchStart(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    this.paper.style.zIndex = highestZ;
    highestZ += 1;
    
    const touch = e.touches[0];
    this.mouseTouchX = touch.clientX;
    this.mouseTouchY = touch.clientY;
    this.prevMouseX = touch.clientX;
    this.prevMouseY = touch.clientY;
  }

  touchMove(e) {
    e.preventDefault();
    if (!this.holdingPaper) return;
    const touch = e.touches[0];
    
    this.mouseX = touch.clientX;
    this.mouseY = touch.clientY;
    
    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;
    
    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;
    
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    this.updatePaperPosition();
  }

  touchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  mouseMove(e) {
    if (!this.rotating) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }
      
    const dirX = e.clientX - this.mouseTouchX;
    const dirY = e.clientY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = 180 * angle / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      this.updatePaperPosition();
    }
  }

  mouseDown(e) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    this.paper.style.zIndex = highestZ;
    highestZ += 1;
    
    if (e.button === 0) {
      this.mouseTouchX = this.mouseX;
      this.mouseTouchY = this.mouseY;
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
    }
    if (e.button === 2) {
      this.rotating = true;
    }
  }

  mouseUp() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  updatePaperPosition() {
    this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
