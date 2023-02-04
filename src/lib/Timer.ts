export interface TimerProps {
  id: string;
  title: string;
  accumulated?: number;
  time?: number;
}

export enum TimerInfo {
  time,
  accumulatedTime,
}

function roundMillis(direction: 'floor' | 'ceil') {
  return (millis: number) => {
    if (direction === 'floor') return Math.floor(millis);
    else if (direction === 'ceil') return Math.ceil(millis);
    else return 0;
  };
}

export function millisToString(millis: number) {
  const round = roundMillis(millis < 0 ? 'ceil' : 'floor');
  const negative = millis < 0;

  const hours = round(millis / 3600000);
  millis -= hours * 3600000;
  const minutes = round(millis / 60000);
  millis -= minutes * 60000;
  const seconds = round(millis / 1000);

  return `${negative ? '-' : ''}
    ${String(Math.abs(hours)).padStart(2, '0')}\
    :${String(Math.abs(minutes)).padStart(2, '0')}\
    :${String(Math.abs(seconds)).padStart(2, '0')}`.replace(/\s+/g, '');
}

export function invalidTimeChange(time: string) {
  return time.search(/^(\d+h)?(\d+m)?(\d+s)?$/) === -1 || time === '';
}

export function extractTimeChange(input: string): number | null {
  if (invalidTimeChange(input)) {
    return null;
  }
  let timeChange = 0;
  const hours = input.match(/\d*h/);
  if (hours != null) {
    timeChange += parseInt(hours[0].slice(0, -1)) * 3600000;
  }
  const minutes = input.match(/\d*m/);
  if (minutes != null) {
    timeChange += parseInt(minutes[0].slice(0, -1)) * 60000;
  }
  const seconds = input.match(/\d*s/);
  if (seconds != null) {
    timeChange += parseInt(seconds[0].slice(0, -1)) * 1000;
  }

  return timeChange;
}

export interface RemoveTimerEvent {
  id: string;
}

export type TimerUpdateEvent = {
  [Prop in keyof TimerProps as Exclude<Prop, 'id'>]?: TimerProps[Prop];
} & {
  id: string;
}