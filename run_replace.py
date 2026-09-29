import re
import sys

def process():
    with open("AmanSanjana.html", "r") as f:
        content = f.read()

    # 1. Names
    content = content.replace("ABHISHEK", "Sanjana") # Abhishek -> Sanjana
    content = content.replace("Abhishek", "Sanjana")
    content = content.replace("KANIKA", "Aman")      # Kanika -> Aman
    content = content.replace("Kanika", "Aman")

    # 2. Buy Now button removal
    # Add display:none to the container of Buy Now
    content = content.replace('class="ssr-variant hidden-4tov0q hidden-faqwma"', 'class="ssr-variant hidden-4tov0q hidden-faqwma" style="display:none !important"')
    content = content.replace('class="framer-JT1sO framer-149jzij framer-v-149jzij framer-1hoq8tr"', 'class="framer-JT1sO framer-149jzij framer-v-149jzij framer-1hoq8tr" style="display:none !important"')
    
    # We also remove the text just in case
    content = content.replace('Buy Now ', '')
    content = content.replace('INR 3999', '')

    # 3. Parents
    new_parents = "Rajni Gupta and Mahesh Gupta<br/>Shri Pradeep Gupta and Smt Sarita Gupta"
    # Wait, the prompt says: 
    # "Parent name is Rajni Gupta and Mahesh Gupta
    # Shri Pradeep Gupta and Smt Sarita Gupta"
    content = content.replace("Smt. Sita Devi &amp; Sm. Om Puri", new_parents)
    content = content.replace("Smt. Lata Devi &amp; Sm. Kamal Kapoor", new_parents)

    # 4. Text block bolder and bigger
    old_text1 = "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness.We are looking forward to see you at the wedding."
    old_text2 = "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness."
    
    new_text = f"<strong style='font-size: 1.2em;'>{old_text1}</strong>"
    if old_text1 in content:
        content = content.replace(old_text1, new_text)
    elif old_text2 in content:
        content = content.replace(old_text2, f"<strong style='font-size: 1.2em;'>{old_text2}</strong>")

    # 5. Events Schedule
    # Events in current site: Engagement, Haldi, Cocktail, Mehendi, Shaadi, Reception
    # Requested: Bhaat, Haldi, Sangeet, Phere, Baarat, Reception
    
    events_map = {
        "Engagement": ("Bhaat", "14 Feb", "11:00 AM - 1:00 PM"),
        "Haldi": ("Haldi", "14 Feb", "2:00 PM - 5:00 PM"),
        "Cocktail": ("Sangeet", "14 Feb", "7:00 PM - 10:00 PM"),
        "Mehendi": ("Phere", "15 Feb", "10:00 AM - 4:00 PM"),
        "Shaadi": ("Baarat", "15 Feb", "7:00 PM - 9:00 PM"),
        "Reception": ("Reception", "15 Feb", "8:00 PM Onwards")
    }

    for old_title, (new_title, new_date, new_time) in events_map.items():
        # Find >old_title</p>
        pattern = r"(>" + old_title + r"</p>.*?<div[^>]*data-framer-name=\"Date and day\"[^>]*>.*?<p[^>]*>)(.*?)(</p>)"
        content = re.sub(pattern, r"\g<1>" + new_date + " | " + new_time + r"\g<3>", content, count=0, flags=re.DOTALL)
        
        # Replace title
        content = content.replace(f">{old_title}</p>", f">{new_title}</p>")

    # 6. Images
    # Replace the carousel images with dulhadulhanimage.jpeg and dulhadulhanimage2.jpeg
    carousel_imgs = [
        "https://framerusercontent.com/images/fKFg2vQEmI70QHKfOSr54pE7KQ4.jpeg",
        "https://framerusercontent.com/images/vXYo7Ef7EIsZJPtxuKuBSurXF4.jpeg",
        "https://framerusercontent.com/images/qHgHJGkX2jaNNoyQgK7oKCf8Kw.jpeg",
        "https://framerusercontent.com/images/tIzCBFSDpiJ9EVtGLkT7djLQPSA.jpeg",
        "https://framerusercontent.com/images/cY7IQeXj6h7Fgv6BdqdJep0Wog.jpeg",
        "https://framerusercontent.com/images/xXnKBz7zAAIjiwGmmUlYMqoQkg.jpeg"
    ]
    
    for i, img in enumerate(carousel_imgs):
        # Even images get 1, odd get 2
        target = "dulhadulhanimage.jpeg" if i % 2 == 0 else "dulhadulhanimage2.jpeg"
        # We replace the image URL (without query params) with our local image URL
        content = re.sub(img + r"[^\"]*", target, content)

    with open("AmanSanjana.html", "w") as f:
        f.write(content)

if __name__ == "__main__":
    process()
