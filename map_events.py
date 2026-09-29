import re
with open("AmanSanjana.html", "r") as f:
    content = f.read()

# Replace Abhishek with Sanjana
content = content.replace("ABHISHEK", "SANJANA")
content = content.replace("Abhishek", "Sanjana")

# Replace Kanika with Aman
content = content.replace("KANIKA", "AMAN")
content = content.replace("Kanika", "Aman")

# Buy Now removal
# The 'Buy Now' button is inside a container. We can just hide the container.
content = content.replace('class="ssr-variant hidden-4tov0q hidden-faqwma"', 'class="ssr-variant hidden-4tov0q hidden-faqwma" style="display:none !important"')
content = content.replace('class="framer-JT1sO framer-149jzij framer-v-149jzij framer-1hoq8tr"', 'class="framer-JT1sO framer-149jzij framer-v-149jzij framer-1hoq8tr" style="display:none !important"')

# Text block
old_text = "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness.We are looking forward to see you at the wedding."
new_text = "<b style='font-size: 1.1em;'>" + old_text + "</b>"
content = content.replace("We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness.We are looking forward to see you at the wedding.", new_text)
# Also try without the last sentence if it doesn't match exactly
content = content.replace("We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives. The affection shown to us by so many people since our roka has been incredibly moving, and has touched us both deeply. We would like to take this opportunity to thank everyone most sincerely for their kindness.", new_text)


# Parent names
content = content.replace("Smt. Sita Devi &amp; Sm. Om Puri", "Rajni Gupta and Mahesh Gupta, Shri Pradeep Gupta and Smt Sarita Gupta")
content = content.replace("Smt. Lata Devi &amp; Sm. Kamal Kapoor", "Rajni Gupta and Mahesh Gupta, Shri Pradeep Gupta and Smt Sarita Gupta")

with open("AmanSanjana_mod.html", "w") as f:
    f.write(content)
