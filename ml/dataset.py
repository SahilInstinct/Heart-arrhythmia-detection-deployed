"""
ml/dataset.py
Segmentation, normalization, and balanced loading.    
"""
import numpy as np
import wfdb
from sklearn.utils import resample
from ml import config

def load_record_beats(record_id, data_dir=config.DATA_DIR):
    record_path = f"{data_dir}/{record_id}"
    record = wfdb.rdrecord(record_path)
    annotation = wfdb.rdann(record_path, 'atr')
    
    # Prioritize Modified Limb Lead II (MLII) 
    channel = 0
    if 'MLII' in record.sig_name:
        channel = record.sig_name.index('MLII')
    signal = record.p_signal[:, channel]
    
    # Z-score standardization
    signal = (signal - np.mean(signal)) / (np.std(signal) + 1e-8)
    
    half_window = config.WINDOW_SIZE // 2
    beats,labels = [], []
    
    for r_peak, symbol in zip(annotation.sample, annotation.symbol):
        if symbol in config.CLASS_TO_INDEX:
            start = r_peak - half_window
            end = r_peak + half_window
            
            if start >= 0 and end <= len(signal):
                beat_segment = signal[start:end]
                beats.append(beat_segment)
                labels.append(config.CLASS_TO_INDEX[symbol])
    return np.array(beats, dtype=np.float32), np.array(labels, dtype=np.int32)

def load_split(record_list):
    all_beats, all_labels = [], []
    
    for record_id in record_list:
        beats, labels = load_record_beats(record_id)
        all_beats.append(beats)
        all_labels.append(labels)
    
    X = np.concatenate(all_beats, axis=0)
    y = np.concatenate(all_labels, axis=0)
    return np.expand_dims(X, axis=-1), y  # Add channel dimension for CNN input

def balance_train_split(X_train, y_train , seed=config.RANDOM_SEED):
    """
    Oversamples training classes upto majority class frequency.
    Applied exclusively on training partition. 
    """
    classes, counts = np.unique(y_train, return_counts=True)
    max_count = np.max(counts)
        
    X_bal, y_bal = [], []
    for cls in classes:
        mask = (y_train == cls)
        X_res, y_res = resample(X_train[mask], y_train[mask], replace=True, n_samples=max_count, random_state=seed)
        X_bal.append(X_res)
        y_bal.append(y_res)
    
    X_bal = np.concatenate(X_bal, axis=0)
    y_bal = np.concatenate(y_bal, axis=0)
    idx = np.random.permutation(len(y_bal))
    return X_bal[idx], y_bal[idx]