import re

def main():
    with open("AmanSanjana.html", "r") as f:
        content = f.read()
        
    # Check if we already injected
    if "framer-fix-observer" in content:
        print("Observer already injected.")
        return

    observer_script = """
<script id="framer-fix-observer">
(function() {
    console.log("Starting custom MutationObserver to override Framer React hydration...");

    // 1. Inject CSS to hide watermarks and "Buy Now" button
    const style = document.createElement('style');
    style.innerHTML = `
        /* Hide all watermarks based on known URLs */
        img[src*="3vpFOuN5tHb2JuYqzoPGPaRcA"],
        img[src*="missing"],
        img[alt*="Missing Piece Logo"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
        /* Hide Buy Now text and container */
        .framer-JT1sO, .framer-1js350o, .framer-ise8hm,
        a[href*="rzp.io"] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Map of exact replacements for text nodes
    const replacements = {
        "ABHISHEK": "SANJANA",
        "KANIKA": "AMAN",
        "Abhishek": "Sanjana",
        "Kanika": "Aman",
        "Buy Now": "",
        "INR 3999": "",
        "10:00 AM": "11:00 AM - 1:00 PM", // Default to Bhaat time
        "2:00 PM - 5:00 PM": "2:00 PM - 5:00 PM",
        "7:00 PM - 10:00 PM": "7:00 PM - 10:00 PM",
        "10:00 AM - 4:00 PM": "10:00 AM - 4:00 PM",
        "7:00 PM - 9:00 PM": "7:00 PM - 9:00 PM",
        "8:00 PM onwards": "8:00 PM onwards",
        "We are so excited to celebrate our special day with you.": "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness. We are looking forward to see you at the wedding."
    };

    let imageCounter = 0;

    const replaceText = (node) => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim() !== '') {
            let val = node.nodeValue;
            let changed = false;
            
            // Name replacements
            if (val.includes("ABHISHEK")) { val = val.replace(/ABHISHEK/g, "SANJANA"); changed = true; }
            if (val.includes("KANIKA")) { val = val.replace(/KANIKA/g, "AMAN"); changed = true; }
            if (val.includes("Abhishek")) { val = val.replace(/Abhishek/g, "Sanjana"); changed = true; }
            if (val.includes("Kanika")) { val = val.replace(/Kanika/g, "Aman"); changed = true; }
            
            // Event title replacements
            if (val.includes("MEHNDI")) { val = val.replace(/MEHNDI/g, "BHAAT"); changed = true; }
            if (val.includes("Mehendi")) { val = val.replace(/Mehendi/g, "Bhaat"); changed = true; }
            
            // Message replacement
            if (val.includes("We are so excited to celebrate our special day with you.")) {
                val = val.replace("We are so excited to celebrate our special day with you.", replacements["We are so excited to celebrate our special day with you."]);
                changed = true;
                // Try to make it bolder and bigger by targeting its parent element if possible
                if (node.parentElement) {
                    node.parentElement.style.setProperty('font-weight', 'bold', 'important');
                    node.parentElement.style.setProperty('font-size', '1.2em', 'important');
                }
            }

            // Dates and Times updates (React might try to inject old ones)
            if (val.includes("10:00 AM") && !val.includes("-")) { 
                // We know Bhaat is 11-1
                val = val.replace("10:00 AM", "11:00 AM - 1:00 PM"); changed = true; 
            }
            if (val.includes("5th July 2026")) { 
                val = val.replace(/5th July 2026/g, "14th Feb 2027"); changed = true; 
            }

            if (changed) {
                node.nodeValue = val;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Fix images
            if (node.tagName === 'IMG') {
                const src = node.getAttribute('src') || "";
                const srcset = node.getAttribute('srcset') || "";
                
                // For the carousel images, they were originally some other images. 
                // We want to force dulhadulhanimage.jpeg and dulhadulhanimage2.jpeg for the carousel.
                // We can identify them if they have a data-framer-name="Image" or are in a specific container
                // Or we can just replace any image that has 'framerusercontent' but isn't the watermark
                // Actually, the user asked to "use dulhadulhanimage.jpeg 1 and 2 for the image in the 2nd image section and only 2 needed ok"
                // Let's replace any large image that isn't the background with our custom ones.
                if (src.includes('framerusercontent.com/images') && !src.includes('3vpFOuN5tHb2JuYqzoPGPaRcA')) {
                    // Check if it's already one of our images
                    if (!src.includes('dulhadulhanimage')) {
                        const newSrc = (imageCounter % 2 === 0) ? 'dulhadulhanimage.jpeg' : 'dulhadulhanimage2.jpeg';
                        imageCounter++;
                        node.setAttribute('src', newSrc);
                        node.setAttribute('srcset', newSrc);
                        node.style.setProperty('object-position', 'center', 'important');
                    }
                }
            }
            
            for (let child of node.childNodes) {
                replaceText(child);
            }
        }
    };

    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0 || mutation.type === 'characterData') {
                shouldProcess = true;
            }
        });
        
        if (shouldProcess) {
            // Re-run the replace on the whole body just in case
            // Or specifically on added nodes to save performance
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    replaceText(node);
                });
                if (mutation.type === 'characterData') {
                    replaceText(mutation.target);
                }
            });
        }
    });

    observer.observe(document.documentElement, { 
        childList: true, 
        subtree: true,
        characterData: true
    });

    // Initial run
    replaceText(document.documentElement);
    
    // Set parent names explicitly by looking for the current ones
    const updateParents = setInterval(() => {
        const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = textNodes.nextNode())) {
            // Replace the parents names if we find the old ones
            if (node.nodeValue.includes("Rajni Gupta and Mahesh Gupta")) {
                // If it already has it, great. If they were originally something else, say "Mrs. ABC & Mr. XYZ", we should replace it.
                // Assuming we might not know the original parents names, but they were already updated in the HTML previously.
                // Our python script ran earlier so they might be correct in SSR.
            }
            
            // Just in case React hydration reverts dates
            if (node.nodeValue.includes("5th July 2026")) {
                node.nodeValue = node.nodeValue.replace(/5th July 2026/g, "14th Feb 2027");
            }
        }
    }, 1000); // Check every second
})();
</script>
</body>"""

    # Inject right before </body>
    if "</body>" in content:
        content = content.replace("</body>", observer_script)
    else:
        # If no body tag for some reason, just append
        content += observer_script

    with open("AmanSanjana.html", "w") as f:
        f.write(content)
        
    print("Successfully injected MutationObserver into AmanSanjana.html")

if __name__ == "__main__":
    main()
