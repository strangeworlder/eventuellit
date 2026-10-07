#!/usr/bin/env python3
"""
Diegetic PDF Generator for Tabletop RPG Props.
Converts HTML/CSS documents into print-ready PDF files using headless Chrome or Edge.
"""

import os
import sys
import argparse
import subprocess
from pathlib import Path

# Common browser executable candidates
BROWSER_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "google-chrome",
    "chromium",
    "chrome",
    "msedge"
]

def find_browser() -> str:
    """Find available Chrome or Edge binary."""
    for path in BROWSER_CANDIDATES:
        if os.path.isabs(path) and os.path.isfile(path):
            return path
        # Try finding in PATH
        found = subprocess.run(["where" if os.name == "nt" else "which", path], capture_output=True, text=True)
        if found.returncode == 0:
            lines = [l.strip() for l in found.stdout.strip().splitlines() if l.strip()]
            if lines:
                return lines[0]
    raise FileNotFoundError("Could not find Google Chrome or Microsoft Edge executable.")

def html_to_pdf(browser_path: str, html_path: Path, output_pdf_path: Path) -> bool:
    """Renders HTML file into PDF using headless browser."""
    html_abs = html_path.resolve()
    pdf_abs = output_pdf_path.resolve()
    
    pdf_abs.parent.mkdir(parents=True, exist_ok=True)
    
    file_url = html_abs.as_uri()
    
    cmd = [
        browser_path,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--run-all-compositor-stages-before-draw",
        "--allow-file-access-from-files",
        f"--print-to-pdf={pdf_abs}",
        file_url
    ]
    
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if proc.returncode != 0:
            print(f"[ERROR] Failed to convert {html_path.name}: {proc.stderr}")
            return False
            
        if pdf_abs.is_file():
            size_kb = pdf_abs.stat().st_size / 1024
            print(f"[OK] Generated: {pdf_abs.name} ({size_kb:.1f} KB)")
            return True
        else:
            print(f"[ERROR] PDF was not created: {pdf_abs}")
            return False
    except subprocess.TimeoutExpired:
        print(f"[ERROR] Conversion timed out for {html_path.name}")
        return False
    except Exception as e:
        print(f"[ERROR] Unexpected exception: {e}")
        return False

def build_all(browser_path: str, root_dir: Path):
    """Compiles all handouts in metadata/jakso-9/handouts/html/ into pdf/."""
    html_dir = root_dir / "metadata" / "jakso-9" / "handouts" / "html"
    pdf_dir = root_dir / "metadata" / "jakso-9" / "handouts" / "pdf"
    
    if not html_dir.exists():
        print(f"[ERROR] HTML source directory not found: {html_dir}")
        sys.exit(1)
        
    html_files = sorted(html_dir.glob("*.html"))
    if not html_files:
        print(f"[WARN] No .html files found in {html_dir}")
        return
        
    print(f"--- Compiling {len(html_files)} handouts using {browser_path} ---")
    success_count = 0
    for html_file in html_files:
        # Determine output filename (replace .html with .pdf)
        pdf_name = html_file.stem + ".pdf"
        out_pdf = pdf_dir / pdf_name
        if html_to_pdf(browser_path, html_file, out_pdf):
            success_count += 1
            
    print(f"--- Finished: {success_count}/{len(html_files)} PDFs built successfully ---")

def main():
    parser = argparse.ArgumentParser(description="Diegetic HTML-to-PDF compiler for tabletop handouts.")
    parser.add_argument("input", nargs="?", help="Input HTML file path")
    parser.add_argument("output", nargs="?", help="Output PDF file path (optional)")
    parser.add_argument("--all", action="store_true", help="Compile all handouts in metadata/jakso-9/handouts/html/")
    
    args = parser.parse_args()
    
    try:
        browser = find_browser()
    except Exception as e:
        print(f"[CRITICAL] {e}")
        sys.exit(1)
        
    # Repository root is parent of tools/
    repo_root = Path(__file__).resolve().parent.parent
    
    if args.all:
        build_all(browser, repo_root)
    elif args.input:
        in_path = Path(args.input)
        if not in_path.is_file():
            print(f"[ERROR] Input file does not exist: {in_path}")
            sys.exit(1)
        if args.output:
            out_path = Path(args.output)
        else:
            out_path = in_path.with_suffix(".pdf")
        html_to_pdf(browser, in_path, out_path)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
