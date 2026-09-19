const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// 1. Update Names
content = content.replace(/Swapnil &amp; Ritu/g, 'Aman &amp; Sanjana');
content = content.replace(/>Swapnil<\/span>/g, '>Aman</span>');
content = content.replace(/>Ritu<\/span>/g, '>Sanjana</span>');
content = content.replace(/#SwituKiWedding/g, '#AmanWedsSanjana');

// 2. Update Map Link and Location Name
// Old location name: The Pod Retreat, Harshaguda, Hyderabad
content = content.replace(/The Pod Retreat/g, 'Anandam Green Resort');
content = content.replace(/Harshaguda, Hyderabad/g, 'Sehore');

// Old map links: 
// href="https://www.google.com/maps/search/?api=1&amp;query=The+Pod+Retreat+Harshaguda+Hyderabad"
content = content.replace(
  /href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=The\+Pod\+Retreat\+Harshaguda\+Hyderabad"/g,
  'href="https://www.google.com/maps/place/anandam+green+resort+sehore/data=!4m2!3m1!1s0x397cf5d3bdf3dd2f:0xe869e762579a7173?sa=X&ved=1t:242&ictx=111"'
);
// src="https://www.google.com/maps?q=The+Pod+Retreat+Harshaguda+Hyderabad&amp;output=embed"
content = content.replace(
  /src="https:\/\/www\.google\.com\/maps\?q=The\+Pod\+Retreat\+Harshaguda\+Hyderabad&amp;output=embed"/g,
  'src="https://www.google.com/maps?q=anandam+green+resort+sehore&amp;output=embed"'
);

// 3. Update Events
// Card 1: Haldi -> HALDI CEREMONY (14th Feb | 2:00 PM - 5:00 PM)
// Old: 5th July 2026 | 10:00 AM
content = content.replace(
  /HALDI CEREMONY\s*<\/h2>\s*<div\s*class="([^"]*)">\s*5th July 2026 \| 10:00 AM\s*<\/div>/g,
  'HALDI CEREMONY\n                    </h2>\n                    <div\n                      class="$1"\n                    >\n                      14th Feb 2027 | 2:00 PM - 5:00 PM\n                    </div>'
);

// Card 2: Mehndi -> BHAAT CEREMONY (14th Feb | 11:00 AM - 1:00 PM)
// Old Title: MEHNDI CEREMONY
// Old Time: 5th July 2026 | 4:00 PM
content = content.replace(/MEHNDI CEREMONY/g, 'BHAAT CEREMONY');
content = content.replace(
  /BHAAT CEREMONY\s*<\/h2>\s*<div\s*class="([^"]*)">\s*5th July 2026 \| 4:00 PM\s*<\/div>/g,
  'BHAAT CEREMONY\n                    </h2>\n                    <div\n                      class="$1"\n                    >\n                      14th Feb 2027 | 11:00 AM - 1:00 PM\n                    </div>'
);

// Card 3: Sangeet
// Old Title: SANGEET CELEBRATION
// Old Time: 5th July 2026 | 8:00 PM
content = content.replace(
  /SANGEET CELEBRATION\s*<\/h2>\s*<div\s*class="([^"]*)">\s*5th July 2026 \| 8:00 PM\s*<\/div>/g,
  'SANGEET CELEBRATION\n                    </h2>\n                    <div\n                      class="$1"\n                    >\n                      14th Feb 2027 | 7:00 PM - 10:00 PM\n                    </div>'
);

// Card 4: Wedding
// Old Title: WEDDING CEREMONY
// Old Date: 15th Feb 2027 (We already changed the date earlier to 15th Feb 2027, so we just match that)
// We need to replace the sub-events list.
// Old list: Baraat (6:00 PM), Varmala (8:00 PM), Rituals (11:00 PM)
const oldWeddingList = `<p class="flex justify-between gap-4">
                        <span>✦ Baraat</span>
                        <span class="font-semibold text-red-900">6:00 PM</span>
                      </p>
                      <p class="flex justify-between gap-4">
                        <span>✦ Varmala</span>
                        <span class="font-semibold text-red-900">8:00 PM</span>
                      </p>
                      <p class="flex justify-between gap-4">
                        <span>✦ Rituals</span>
                        <span class="font-semibold text-red-900">11:00 PM</span>
                      </p>`;

const newWeddingList = `<p class="flex justify-between gap-4">
                        <span>✦ Phere</span>
                        <span class="font-semibold text-red-900 text-right">10:00 AM - 4:00 PM</span>
                      </p>
                      <p class="flex justify-between gap-4">
                        <span>✦ Baarat</span>
                        <span class="font-semibold text-red-900 text-right">7:00 PM - 9:00 PM</span>
                      </p>
                      <p class="flex justify-between gap-4">
                        <span>✦ Reception</span>
                        <span class="font-semibold text-red-900 text-right">8:00 PM onwards</span>
                      </p>`;

// Do string replace, carefully ignoring whitespace using a regex
content = content.replace(
  /<p class="flex justify-between gap-4">\s*<span>✦ Baraat<\/span>\s*<span class="font-semibold text-red-900">6:00 PM<\/span>\s*<\/p>\s*<p class="flex justify-between gap-4">\s*<span>✦ Varmala<\/span>\s*<span class="font-semibold text-red-900">8:00 PM<\/span>\s*<\/p>\s*<p class="flex justify-between gap-4">\s*<span>✦ Rituals<\/span>\s*<span class="font-semibold text-red-900">11:00 PM<\/span>\s*<\/p>/,
  newWeddingList
);

fs.writeFileSync('index.html', content);
console.log("Done");
