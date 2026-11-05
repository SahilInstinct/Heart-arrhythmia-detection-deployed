"""
ml/model.py
MSHAN implementation in Keras.    
"""

import tensorflow as tf
from tensorflow.keras import layers, regularizers, Model
from ml import config

def temporal_attention(x):
    att = layers.Conv1D(filters=1, kernel_size=1, activation='sigmoid')(x)
    return layers.Multiply()([x, att])


def channel_attention(x):
    channels = x.shape[-1]
    gap = layers.GlobalAveragePooling1D()(x)
    fc1 = layers.Dense(channels // 8, activation='relu')(gap)
    weights = layers.Dense(channels, activation='sigmoid')(fc1)
    weights = layers.Reshape((1, int(channels)))(weights)
    return layers.Multiply()([x, weights])


def build_mshan(input_shape=config.WINDOW_SIZE, num_classes=config.NUM_CLASSES):
    inputs = layers.Input(shape=(input_shape, 1))
    
    #Multi-Scale stage 1 (Kernels: 7, 13, 19)
    c1_7 = layers.Conv1D( 32, 7, padding='same', activation='relu')(inputs)
    c1_13 = layers.Conv1D(32, 13, padding='same', activation='relu')(inputs)
    c1_19 = layers.Conv1D(32, 19, padding='same', activation='relu')(inputs)
    b1 = layers.Concatenate(axis=-1)([c1_7, c1_13, c1_19]) #96 channels
    
    # Hierarchical Attention
    t_att = temporal_attention(b1)
    c_att = channel_attention(t_att)
    
    # Multi-Scale stage 2 (Kernels: 11, 17, 23)
    c2_11 = layers.Conv1D(64, 11, padding='same', activation='relu')(c_att)
    c2_17 = layers.Conv1D(64, 17, padding='same', activation='relu')(c_att)
    c2_23 = layers.Conv1D(64, 23, padding='same', activation='relu')(c_att)
    b2 = layers.Concatenate(axis=-1)([c2_11, c2_17, c2_23]) #192 channels
    
    # Residual Shortcut & Layer Normalization
    shortcut = layers.Conv1D(192, 1, padding='same')(b1)
    res = layers.Add()([b2, shortcut])
    norm = layers.LayerNormalization(epsilon=1e-6)(res)
    
    # Temporal Recurrent Modelling
    gru1 = layers.GRU(128, return_sequences=True)(norm)
    gru2 = layers.GRU(64, return_sequences=False)(gru1)
    
    # Classification Head
    dense = layers.Dense(35, activation='relu', kernel_regularizer=regularizers.l2(config.L2_REG))(gru2)
    drop = layers.Dropout(config.DROPOUT_RATE)(dense)
    outputs = layers.Dense(num_classes, activation='softmax', name="prediction")(drop)

    return Model(inputs=inputs, outputs=outputs, name="MSHAN")    
    
    