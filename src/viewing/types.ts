export type LiveProvider = 'jitsi' | 'zoom' | 'teams' | 'meet';

export type MemoryKind = 'message' | 'photo' | 'video' | 'audio';

export type RoomId = 'family' | 'friends' | 'coworkers' | 'church';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  detail: string;
}

export interface Memorial {
  id: string;
  code: string;
  personName: string;
  dates: string;
  hostName: string;
  obituary: string;
  schedule: ScheduleItem[];
  provider: LiveProvider;
  liveUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  author: string;
  body: string;
  kind: MemoryKind;
  mediaUrl: string;
  createdAt: string;
}

export interface RoomMessage {
  id: string;
  room: RoomId;
  author: string;
  body: string;
  createdAt: string;
}

export interface ViewingRecord {
  memorial: Memorial;
  memories: Memory[];
  messages: RoomMessage[];
}

export const ROOMS: { id: RoomId; label: string; note: string }[] = [
  { id: 'family', label: 'Close Family', note: 'The people who are holding the day together.' },
  { id: 'friends', label: 'Friends', note: 'Stories from the people who knew them outside the house.' },
  { id: 'coworkers', label: 'Coworkers', note: 'A quieter room for the people they worked beside.' },
  { id: 'church', label: 'Church Members', note: 'A room for the congregation and faith community.' },
];

export const PROVIDERS: { id: LiveProvider; label: string; embed: boolean }[] = [
  { id: 'jitsi', label: 'Jitsi Meet', embed: true },
  { id: 'zoom', label: 'Zoom', embed: false },
  { id: 'teams', label: 'Microsoft Teams', embed: false },
  { id: 'meet', label: 'Google Meet', embed: false },
];
