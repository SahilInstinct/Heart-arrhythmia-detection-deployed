'''
Test the MSHAN model.
'''
import numpy as np
from ml.model import build_mshan
from ml import config

def test_mshan_forward_pass():
    model = build_mshan()
    dummy_input = np.random.rand(4, config.WINDOW_SIZE, 1).astype(np.float32)
    prediction = model(dummy_input)
    
    assert prediction.shape == (4, config.NUM_CLASSES)
    assert np.allclose(np.sum(prediction.numpy(), axis=1), 1.0, atol=1e-5)

