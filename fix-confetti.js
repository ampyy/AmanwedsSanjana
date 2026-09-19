const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const newScript = `
    <script>
      (function() {
        let initialized = false;
        let scratchCompleted = false;

        function injectFlowersAndConfetti() {
          const containers = document.querySelectorAll('div.relative.mx-auto.w-full.max-w-md.h-32.rounded-2xl');
          if (containers.length === 0) return false;
          const container = containers[0];

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
          return true;
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

        startCountdown();

        // Check if React removed the canvas (meaning scratch is complete)
        setInterval(() => {
          if (scratchCompleted) return;
          
          const containers = document.querySelectorAll('div.relative.mx-auto.w-full.max-w-md.h-32.rounded-2xl');
          if (containers.length > 0) {
            injectFlowersAndConfetti();
            
            const canvas = containers[0].querySelector('canvas');
            
            if (!canvas) {
              if (!document.getElementById('flower-left')) {
                // React destroyed them during re-render! Re-inject them!
                injectFlowersAndConfetti();
                // Force layout reflow
                void container.offsetWidth;
              }

              // Canvas is gone! Trigger animations!
              scratchCompleted = true;
              
              const fLeft = document.getElementById('flower-left');
              const fRight = document.getElementById('flower-right');
              if(fLeft) { fLeft.classList.add('active'); fLeft.parentElement.classList.add('active'); }
              if(fRight) { fRight.classList.add('active'); fRight.parentElement.classList.add('active'); }
              
              // Trigger Confetti
              if (window.confetti) {
                confetti({
                  particleCount: 150,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#C89F5C', '#ffffff', '#FFD700', '#FF69B4']
                });
              }
            }
          }
        }, 300);

        // Load canvas-confetti library
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
        document.head.appendChild(script);

      })();
    </script>
`;

content = content.replace(/<script>\s*\(function\(\) \{[\s\S]*?\}\)\(\);\s*<\/script>/, newScript);
fs.writeFileSync('index.html', content);
console.log('updated index html');
