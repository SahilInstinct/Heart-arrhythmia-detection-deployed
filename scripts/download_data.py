import os
import wfdb

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data","mitdb")
print(DATA_DIR)

def download():
    os.makedirs(DATA_DIR, exist_ok=True)
    print(f"Downloading MIT-BIH Arrhythmia Database into '{DATA_DIR}/'...")
    wfdb.dl_database("mitdb", dl_dir=DATA_DIR)
    print("Download complete.")

if __name__ == "__main__":
    download()
