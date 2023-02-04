import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs'
import type { TimerProps, TimerUpdateEvent } from '../Timer';
import validateJson from './validateTimerFile';

const fileName = 'timers.json';

export default class PersistencyManager {
  timers: TimerProps[] = [];

  async init(): Promise<void> {
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
      this.timers = timers;

    } catch (e) {
      if (typeof e !== 'string' || !e.includes('The system cannot find the file specified')) {
        throw e;
      }
      this.write();
    }
  }

  private write() {
    writeTextFile(fileName, JSON.stringify(this.timers), {
      dir: BaseDirectory.AppData,
    });
  }

  updateTimer(event: TimerUpdateEvent): boolean {
    const timer = this.timers.find(t => t.id === event.id);
    if (!timer) {
      return false;
    }

    Object.keys(event).forEach(key => {
      if (key == 'id' || event[key] === undefined) return;
      timer[key] = event[key];
    });

    this.write();
    return true;
  }

  createTimer(timer: TimerProps): boolean {
    if (this.timers.find(t => t.id === timer.id)) {
      return false;
    }

    this.timers.push(structuredClone(timer));
    this.write();
    return true;
  }

  deleteTimer(id: string): boolean {
    const timerIndex = this.timers.findIndex(t => t.id === id);
    if (timerIndex === -1) {
      return false;
    }
    this.timers.splice(timerIndex, 1);
    this.write();
    return true;
  }
}