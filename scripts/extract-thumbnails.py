#!/usr/bin/env python3
import subprocess
import os

FFMPEG = "/private/tmp/pyvenv/lib/python3.14/site-packages/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1"
COMMIT = "9d30bd1"

def extract_frame_from_git(git_path: str, out_path: str, timestamp: str = "00:00:03"):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    git_cmd = ["git", "show", f"{COMMIT}:{git_path}"]
    ffmpeg_cmd = [
        FFMPEG,
        "-y",
        "-ss", timestamp,
        "-i", "-",
        "-frames:v", "1",
        "-q:v", "2",
        out_path
    ]
    
    p1 = subprocess.Popen(git_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    p2 = subprocess.Popen(ffmpeg_cmd, stdin=p1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    p1.stdout.close()
    _, stderr = p2.communicate()
    
    if p2.returncode == 0 and os.path.exists(out_path) and os.path.getsize(out_path) > 0:
        print(f"Extracted {out_path} ({os.path.getsize(out_path)} bytes)")
        return True
    else:
        # Retry at 00:00:01 if 3s is beyond duration
        ffmpeg_cmd[3] = "00:00:01"
        p1 = subprocess.Popen(git_cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        p2 = subprocess.Popen(ffmpeg_cmd, stdin=p1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        p1.stdout.close()
        p2.communicate()
        if p2.returncode == 0 and os.path.exists(out_path) and os.path.getsize(out_path) > 0:
            print(f"Extracted (1s) {out_path} ({os.path.getsize(out_path)} bytes)")
            return True
        print(f"Failed to extract {git_path}")
        return False

# 1. Cinematic Video Editor (1 to 18)
for i in range(1, 19):
    git_file = f"public/images/cinematic-video-editor/{i}.mp4"
    out_file = f"public/images/cinematic-video-editor/{i}.jpg"
    extract_frame_from_git(git_file, out_file)

# 2. Content Creator (1 to 16)
for i in range(1, 17):
    git_file = f"public/images/content-creator/{i}.mp4"
    out_file = f"public/images/content-creator/{i}.jpg"
    extract_frame_from_git(git_file, out_file)

# 3. Project video files
projects = [
    ("zen-tactics", [1, 7, 8, 17]),
    ("modern-football", [1, 7, 8, 17]),
    ("hlv-online", [1, 7, 8, 17]),
    ("hlv-online-classic", [1, 7, 8, 17]),
    ("tactics-duo", [1, 7]),
    ("zen-cine-esports", [1, 6]),
    ("cup-hoc-xem-bong", [1, 7, 8]),
    ("hlv-onlive", [1]),
]

for proj, nums in projects:
    for num in nums:
        git_file = f"public/images/{proj}/{num}.mp4"
        out_file = f"public/images/{proj}/{num}.jpg"
        extract_frame_from_git(git_file, out_file)
