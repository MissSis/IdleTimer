import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import type { TimerProps } from '../Timer';
import validateJson from './validateTimerFile';
import timerStore from './TimerStore';
import type { Unsubscriber } from 'svelte/store';

const fileName = 'timers.json';

// The amount of seconds before a new change will be written to a file.
// With this delay multiple changes can be bundled into one write operation.
const writeDelay = 1000;

export default class PersistencyManager {
  unsubscribe: Unsubscriber;
  currentTimeout: NodeJS.Timeout | null = null;
  successfulInitialized = false;

  async init(): Promise<void> {
    this.unsubscribe = timerStore.subscribe(timers => {
      if (this.currentTimeout != null) {
        clearTimeout(this.currentTimeout);
      }
      this.currentTimeout = setTimeout(() => {
        this.write(timers);
      }, writeDelay);
    });

    try {
      const timers: TimerProps[] = JSON.parse(await readTextFile(fileName, {
        dir: BaseDirectory.AppData,
      }));
      const uniqueIds = new Set(timers.map(timer => timer.id)).size === timers.length;
      if (!validateJson(timers)) {
        throw new Error('Invalid timer file');
      } else if (!uniqueIds) {
        throw new Error('Some ids in the file are not unique!');
      }
      timerStore.set(timers);
      this.successfulInitialized = true;

    } catch (e) {
      if (typeof e !== 'string' || !e.includes('The system cannot find the file specified')) {
        throw e;
      }
      this.successfulInitialized = true;
      this.write([]);
    }
  }

  private write(timers: TimerProps[]) {
    if (this.successfulInitialized) {
      writeTextFile(fileName, JSON.stringify(timers), {
        dir: BaseDirectory.AppData,
      });
    }
  }

  close() {
    this.unsubscribe();
  }
}