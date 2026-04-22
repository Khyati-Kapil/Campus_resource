type Task<T> = () => Promise<T>;

class LockManager {
  private chains = new Map<string, Promise<void>>();

  async runExclusive<T>(key: string, task: Task<T>): Promise<T> {
    const prior = this.chains.get(key) ?? Promise.resolve();

    let release!: () => void;
    const next = new Promise<void>((resolve) => {
      release = resolve;
    });

    // Chain ensures tasks for the same key execute sequentially.
    this.chains.set(
      key,
      prior
        .catch(() => undefined)
        .then(() => next)
    );

    await prior;
    try {
      return await task();
    } finally {
      release();
      // Cleanup if nobody appended after us.
      if (this.chains.get(key) === next) {
        this.chains.delete(key);
      }
    }
  }
}

export const lockManager = new LockManager();

