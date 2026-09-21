#!/usr/bin/env python3
"""
Crop sponsor logo assets to their exact true visual graphic bounds,
ignoring sub-visual transparent noise artifacts (alpha < 10).
Saves:
- Raw original files in public/logos/sponsors/original/
- Exact-cropped resource files in public/logos/sponsors/cropped/
- Exact-cropped production files in public/logos/sponsors/
"""

import os
import numpy as np
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPONSORS_DIR = os.path.join(BASE_DIR, "public", "logos", "sponsors")
ORIGINAL_DIR = os.path.join(SPONSORS_DIR, "original")
CROPPED_DIR = os.path.join(SPONSORS_DIR, "cropped")

os.makedirs(ORIGINAL_DIR, exist_ok=True)
os.makedirs(CROPPED_DIR, exist_ok=True)

def process():
    for i in range(1, 11):
        filename = f"{i}.png"
        src_path = os.path.join(ORIGINAL_DIR, filename)
        if not os.path.exists(src_path):
            print(f"Skipping {filename}: source not found in original/.")
            continue

        im = Image.open(src_path).convert("RGBA")
        arr = np.array(im)
        alpha = arr[:, :, 3]
        
        # Zero out sub-visual noise (< 4% opacity)
        arr[alpha < 10, 3] = 0
        clean_im = Image.fromarray(arr)
        
        mask = arr[:, :, 3] >= 10
        y, x = np.where(mask)
        min_x, max_x = x.min(), x.max()
        min_y, max_y = y.min(), y.max()
        
        # Crop precisely to true visible graphic bounds
        tight = clean_im.crop((min_x, min_y, max_x + 1, max_y + 1))
        
        # Save to cropped/ and production public/logos/sponsors/
        tight.save(os.path.join(CROPPED_DIR, filename), "PNG", optimize=True)
        tight.save(os.path.join(SPONSORS_DIR, filename), "PNG", optimize=True)
        print(f"Cropped {filename} to exact graphic size: ({tight.width}x{tight.height})")

if __name__ == "__main__":
    process()
