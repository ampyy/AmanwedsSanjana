const fs = require('fs');
const path = require('path');

const filePath = path.join('/Users/amanpandey/AmanwedsSanjana', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove React bundle script
content = content.replace(
  /<script\s+type="module"\s+crossorigin=""\s+src="\/assets\/index-DPQS9H4w\.js"\s*><\/script>/,
  '<!-- React Script Removed to prevent hydration conflicts with Scratch Card -->'
);

// 2. Update Dates
content = content.replace(/6th July 2026/g, '15th Feb 2027');
content = content.replace(/5th – 6th July 2026/g, '14th – 15th Feb 2027');

// 3. Add id to canvas
content = content.replace(
  /<canvas\s+class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"/g,
  '<canvas\n                    id="scratch-canvas"\n                    class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"'
);

// 4. Add id to countdown container
content = content.replace(
  /<div\s+class="transition-all duration-1000 opacity-0 translate-y-8 pointer-events-none h-0 overflow-hidden"\s+aria-hidden="true"\s*>/g,
  '<div\n                id="countdown-container"\n                class="transition-all duration-1000 opacity-0 translate-y-8 pointer-events-none h-0 overflow-hidden"\n                aria-hidden="true"\n              >'
);

// 5. Add ids to countdown spans
// We need to inject id="cd-days", id="cd-hours", id="cd-minutes", id="cd-seconds"
// Since they all look exactly the same:
// <span class="font-cinzel text-2xl sm:text-4xl text-rose-deep tabular-nums">00</span>
let numMatches = 0;
const ids = ['cd-days', 'cd-hours', 'cd-minutes', 'cd-seconds'];
content = content.replace(
  /<span\s+class="font-cinzel text-2xl sm:text-4xl text-rose-deep tabular-nums"\s*>00<\/span>/g,
  (match) => {
    const replacement = `<span\n                        id="${ids[numMatches]}"\n                        class="font-cinzel text-2xl sm:text-4xl text-rose-deep tabular-nums"\n                        >00</span\n                      >`;
    numMatches++;
    return replacement;
  }
);

// 6. Inject Script and Styles before </body>
const scriptAndStyles = `
    <!-- Scratch Card and Countdown Logic -->
    <style>
      .flower-anim-container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100px;
        pointer-events: none;
        z-index: 20;
        opacity: 0;
        transition: opacity 1s ease-in-out;
        overflow: hidden;
      }
      #flower-left {
        left: -100px;
        transform: translateY(50px) rotate(-20deg);
        transition: left 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1s;
      }
      #flower-right {
        right: -100px;
        transform: translateY(50px) rotate(20deg);
        transition: right 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1s;
      }
      .flower-anim-container.active {
        opacity: 1;
      }
      #flower-left.active {
        left: 0px;
        transform: translateY(0) rotate(0deg);
      }
      #flower-right.active {
        right: 0px;
        transform: translateY(0) rotate(0deg);
      }
    </style>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        // --- Countdown Logic ---
        const targetDate = new Date("Feb 15, 2027 00:00:00").getTime();
        
        function updateCountdown() {
          const now = new Date().getTime();
          const distance = targetDate - now;

          if (distance < 0) return;

          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          const eDays = document.getElementById("cd-days");
          const eHours = document.getElementById("cd-hours");
          const eMins = document.getElementById("cd-minutes");
          const eSecs = document.getElementById("cd-seconds");
          
          if(eDays) eDays.innerText = String(days).padStart(2, '0');
          if(eHours) eHours.innerText = String(hours).padStart(2, '0');
          if(eMins) eMins.innerText = String(minutes).padStart(2, '0');
          if(eSecs) eSecs.innerText = String(seconds).padStart(2, '0');
        }
        
        setInterval(updateCountdown, 1000);
        updateCountdown();

        // --- Scratch Card Logic ---
        const canvas = document.getElementById('scratch-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const countdownContainer = document.getElementById('countdown-container');
        
        // Setup Canvas size
        const setupCanvas = () => {
          const rect = canvas.parentElement.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
          
          // Fill overlay
          ctx.fillStyle = '#C89F5C'; // gold-soft color
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add Text
          ctx.fillStyle = '#ffffff';
          ctx.font = '24px Cinzel, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('Scratch to Reveal', canvas.width / 2, canvas.height / 2);
        };
        
        setupCanvas();
        window.addEventListener('resize', setupCanvas);

        let isDrawing = false;
        let isRevealed = false;

        const getMousePos = (canvas, evt) => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          let clientX = evt.clientX;
          let clientY = evt.clientY;
          
          if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
          }
          
          return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
          };
        };

        const erase = (pos) => {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2, false);
          ctx.fill();
        };

        const checkReveal = () => {
          if (isRevealed) return;
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          let transparentPixels = 0;
          for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) {
              transparentPixels++;
            }
          }
          const percentage = (transparentPixels / (pixels.length / 4)) * 100;
          
          if (percentage > 50) {
            isRevealed = true;
            canvas.style.transition = 'opacity 1s ease-out';
            canvas.style.opacity = '0';
            
            setTimeout(() => {
              canvas.style.display = 'none';
            }, 1000);
            
            // Show countdown
            if(countdownContainer) {
              countdownContainer.classList.remove('opacity-0', 'h-0', 'translate-y-8', 'pointer-events-none');
              countdownContainer.classList.add('opacity-100');
            }

            // Show flowers
            const fLeft = document.getElementById('flower-left');
            const fRight = document.getElementById('flower-right');
            if(fLeft) { fLeft.classList.add('active'); fLeft.parentElement.classList.add('active'); }
            if(fRight) { fRight.classList.add('active'); fRight.parentElement.classList.add('active'); }
          }
        };

        const startDrawing = (e) => {
          if (isRevealed) return;
          isDrawing = true;
          erase(getMousePos(canvas, e));
        };
        const draw = (e) => {
          if (!isDrawing || isRevealed) return;
          e.preventDefault();
          erase(getMousePos(canvas, e));
        };
        const stopDrawing = () => {
          if (!isDrawing) return;
          isDrawing = false;
          checkReveal();
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        window.addEventListener('mouseup', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing, {passive: false});
        canvas.addEventListener('touchmove', draw, {passive: false});
        window.addEventListener('touchend', stopDrawing);
      });
    </script>
`;

// Inject flower divs right inside the relative container that holds the canvas
// The container is: <div class="relative mx-auto w-full max-w-md h-32 ...">
const flowerHTML = `
                  <div class="flower-anim-container" style="left: -40px;">
                    <img id="flower-left" src="/assets/falling-daisy-DWyrh5i3.png" class="absolute w-16 h-16 object-contain" style="top: 50%; margin-top: -32px;"/>
                  </div>
                  <div class="flower-anim-container" style="right: -40px;">
                    <img id="flower-right" src="/assets/falling-rose-petal-CzrX2ZBd.png" class="absolute w-16 h-16 object-contain" style="top: 50%; margin-top: -32px;"/>
                  </div>
`;

content = content.replace(
  /<div\n\s*class="relative mx-auto w-full max-w-md h-32 rounded-2xl overflow-hidden border-2 border-gold-soft shadow-elegant select-none"\n\s*>/,
  (match) => match + flowerHTML
);

content = content.replace('</body>', scriptAndStyles + '\n  </body>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated index.html with Scratch Card logic!');
