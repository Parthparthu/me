import os
import glob
from PIL import Image

frames_dir = 'temp_gif_frames'
output_path = os.path.join('docs', 'assets', 'readme', 'liquid-sculpture-demo.gif')

frame_files = sorted(glob.glob(os.path.join(frames_dir, 'frame_*.png')))
print(f"Found {len(frame_files)} frames.")

if not frame_files:
    raise RuntimeError("No frames found")

images = []
# Resize to 740 width for optimal balance of sharpness and github loading speed (< 3.5MB)
target_width = 700

for i, f in enumerate(frame_files):
    im = Image.open(f).convert('RGB')
    w, h = im.size
    target_height = int(h * (target_width / w))
    im_resized = im.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Quantize to 80 colors with diffusion for smooth liquid gradients
    im_quant = im_resized.quantize(colors=80, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG)
    images.append(im_quant)

print(f"Saving animated GIF to {output_path}...")
images[0].save(
    output_path,
    save_all=True,
    append_images=images[1:],
    duration=100,
    loop=0,
    optimize=True
)

size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"Done! GIF size: {size_mb:.2f} MB")
