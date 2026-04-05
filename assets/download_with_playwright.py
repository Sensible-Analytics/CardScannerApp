#!/usr/bin/env python3
import os
import sys
import time
import requests
import json
from pathlib import Path
from urllib.parse import quote_plus
from playwright.sync_api import sync_playwright


def search_bing(query, limit=100):
    print(f"Searching Bing: {query}")
    search_url = (
        f"https://www.bing.com/images/search?q={quote_plus(query)}+business+card"
    )
    image_urls = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            page.goto(search_url, timeout=30000)
            time.sleep(2)

            for _ in range(5):
                page.evaluate("window.scrollBy(0, 800)")
                time.sleep(1)

            iusc_elements = page.query_selector_all(".iusc")

            for el in iusc_elements:
                m = el.get_attribute("m")
                if m:
                    try:
                        data = json.loads(m)
                        img_url = data.get("turl", "") or data.get("murl", "")
                        if (
                            img_url
                            and img_url.startswith("http")
                            and "bing.net" in img_url
                        ):
                            image_urls.append(img_url)
                    except:
                        pass

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

    seen = set()
    unique = []
    for url in image_urls:
        if url not in seen and len(url) > 50:
            seen.add(url)
            unique.append(url)

    print(f"  Found {len(unique)} images")
    return unique[:limit]


def download_image(url, filepath, min_size=5000):
    if Path(filepath).exists():
        return False

    try:
        headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}
        response = requests.get(url, headers=headers, timeout=15, stream=True)
        response.raise_for_status()

        content = response.content
        if len(content) < min_size:
            return False

        with open(filepath, "wb") as f:
            f.write(content)

        return True
    except:
        return False


def main():
    print("Business Card Image Downloader")
    print("=" * 50)

    output_dir = Path("e2e/assets/business_cards_web")
    output_dir.mkdir(parents=True, exist_ok=True)

    queries = ["business card", "visiting card", "professional contact card"]

    all_urls = []
    for query in queries:
        urls = search_bing(query, limit=80)
        all_urls.extend(urls)
        time.sleep(1)

    all_urls = list(set(all_urls))
    print(f"\nTotal unique URLs: {len(all_urls)}")

    downloaded = 0
    failed = 0

    print("\nDownloading...")
    for i, url in enumerate(all_urls):
        ext = ".jpg"
        filename = f"card_{i + 300:04d}{ext}"
        filepath = output_dir / filename

        if download_image(url, filepath):
            downloaded += 1
            if downloaded % 20 == 0:
                print(f"  Progress: {downloaded} images")
        else:
            failed += 1

        if (i + 1) % 20 == 0:
            print(f"  Processed {i + 1}/{len(all_urls)}")

        time.sleep(0.2)

        if downloaded >= 100000:
            break

    print("\n" + "=" * 50)
    print("RESULTS")
    print("=" * 50)

    images = list(output_dir.glob("*.jpg")) + list(output_dir.glob("*.png"))
    print(f"Downloaded: {len(images)} images")
    print(f"Failed: {failed} URLs")
    print(f"Location: {output_dir.absolute()}")

    if images:
        sizes = [f.stat().st_size for f in images]
        print(f"Total: {sum(sizes) // 1024 // 1024}MB")
        print(f"\nSamples:")
        for f in sorted(images)[:5]:
            print(f"  {f.name} ({f.stat().st_size // 1024}KB)")

    return len(images)


if __name__ == "__main__":
    count = main()
    sys.exit(0 if count >= 50 else 1)
