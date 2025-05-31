import time
from contextlib import contextmanager

@contextmanager
def timer(name="default"):
    start = time.time()
    yield
    elapsed = time.time() - start
    print(f"[{name}] Elapsed: {elapsed:.3f}s")

