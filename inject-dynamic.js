const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Remove the old script completely (anything between <!-- Scratch Card and Countdown Logic --> and </script>)
content = content.replace(/<!-- Scratch Card and Countdown Logic -->[\s\S]*?<\/script>/g, '');

const robustScript = `
    <!-- Scratch Card and Countdown Logic (React-compatible) -->
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
      (function() {
        let initialized = false;
        
        function initScratchCard() {
          if (initialized) return;
          
          // Find the SAVE THE DATE section container
          // It's a relative container with max-w-md and h-32
          const containers = document.querySelectorAll('div.relative.mx-auto.w-full.max-w-md.h-32.rounded-2xl');
          if (containers.length === 0) return;
          
          const container = containers[0];
          const canvas = container.querySelector('canvas');
          if (!canvas) return;

          initialized = true;

          // Inject flowers if not present
          if (!document.getElementById('flower-left')) {
            const flowerHTML = \`
              <div class="flower-anim-container" style="left: -40px;">
                <img id="flower-left" src="assets/falling-daisy-DWyrh5i3.png" class="absolute w-16 h-16 object-contain" style="top: 50%; margin-top: -32px;"/>
              </div>
              <div class="flower-anim-container" style="right: -40px;">
                <img id="flower-right" src="assets/falling-rose-petal-CzrX2ZBd.png" class="absolute w-16 h-16 object-contain" style="top: 50%; margin-top: -32px;"/>
              </div>
            \`;
            container.insertAdjacentHTML('beforeend', flowerHTML);
          }

          // Setup canvas overlay
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          const setupCanvas = () => {
            const rect = container.getBoundingClientRect();
            // Match canvas drawing buffer to actual displayed size
            canvas.width = rect.width;
            canvas.height = rect.height;
            
            ctx.fillStyle = '#C89F5C'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
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
            let clientX = evt.clientX;
            let clientY = evt.clientY;
            if (evt.touches && evt.touches.length > 0) {
              clientX = evt.touches[0].clientX;
              clientY = evt.touches[0].clientY;
            }
            return {
              x: clientX - rect.left,
              y: clientY - rect.top
            };
          };

          const erase = (pos) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2, false);
            ctx.fill();
          };

          // Find countdown container
          let countdownContainer = null;
          let hiddenDivs = document.querySelectorAll('div.opacity-0.h-0.overflow-hidden');
          hiddenDivs.forEach(div => {
            if (div.innerText.includes('Days') || div.innerText.includes('Hours')) {
              countdownContainer = div;
            }
          });

          const checkReveal = () => {
            if (isRevealed) return;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparentPixels = 0;
            for (let i = 3; i < pixels.length; i += 4) {
              if (pixels[i] === 0) transparentPixels++;
            }
            const percentage = (transparentPixels / (pixels.length / 4)) * 100;
            
            if (percentage > 40) {
              isRevealed = true;
              canvas.style.transition = 'opacity 1s ease-out';
              canvas.style.opacity = '0';
              setTimeout(() => { canvas.style.display = 'none'; }, 1000);
              
              if(countdownContainer) {
                countdownContainer.classList.remove('opacity-0', 'h-0', 'translate-y-8', 'pointer-events-none');
                countdownContainer.classList.add('opacity-100');
              }

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
        }

        // --- Active Countdown Logic ---
        function startCountdown() {
          const targetDate = new Date("Feb 15, 2027 00:00:00").getTime();
          
          setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) return;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // React renders these dynamically, so we find them by looking at the spans with tracking-widest
            const labels = document.querySelectorAll('span.tracking-widest.uppercase');
            labels.forEach(label => {
              const text = label.innerText.trim().toLowerCase();
              const numSpan = label.previousElementSibling?.querySelector('span.tabular-nums');
              if (numSpan) {
                if (text === 'days') numSpan.innerText = String(days).padStart(2, '0');
                if (text === 'hours') numSpan.innerText = String(hours).padStart(2, '0');
                if (text === 'minutes') numSpan.innerText = String(minutes).padStart(2, '0');
                if (text === 'seconds') numSpan.innerText = String(seconds).padStart(2, '0');
              }
            });
          }, 1000);
        }

        // Use MutationObserver to wait for React to mount the envelope and the rest of the app
        const observer = new MutationObserver(() => {
          if (!initialized) {
            initScratchCard();
          }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Also run a setInterval just in case
        const intervalId = setInterval(() => {
          if (initialized) {
            clearInterval(intervalId);
          } else {
            initScratchCard();
          }
        }, 500);

        // Start countdown loop independent of scratch initialization
        startCountdown();
      })();
    </script>
`;

content = content.replace('</body>', robustScript + '\n  </body>');
fs.writeFileSync('index.html', content);
