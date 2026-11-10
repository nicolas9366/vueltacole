import subprocess
import time
import Vision
from Foundation import NSURL

def recognize_text(image_path):
    url = NSURL.fileURLWithPath_(image_path)
    request = Vision.VNRecognizeTextRequest.alloc().init()
    request.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
    request.setUsesLanguageCorrection_(True)
    request.setRecognitionLanguages_(["es-ES", "en-US", "zh-Hans"])
    
    handler = Vision.VNImageRequestHandler.alloc().initWithURL_options_(url, None)
    success, error = handler.performRequests_error_([request], None)
    
    if success:
        return [res.topCandidates_(1)[0].string() for res in request.results()]
    else:
        return []

def main():
    url = "https://www.idealista.com/inmueble/111754673/"
    print(f"Opening {url} in browser...")
    subprocess.run(["open", url])
    
    # Wait for the page to load
    time.sleep(8)
    
    image_path = '/tmp/idealista_screen.png'
    print("Capturing screen...")
    subprocess.run(["screencapture", "-x", image_path])
    
    print("Running OCR...")
    lines = recognize_text(image_path)
    
    with open('/tmp/idealista_ocr.txt', 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
        
    print("Done! OCR results saved to /tmp/idealista_ocr.txt")

if __name__ == "__main__":
    main()
