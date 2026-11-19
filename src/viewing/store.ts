import type { Memorial, Memory, RoomMessage, ViewingRecord } from './types';

const KEY = 'w3bb.viewings.v1';

export interface ViewingDb {
  records: ViewingRecord[];
}

export function emptyDb(): ViewingDb {
  return { records: [] };
}

export function createAccessCode(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

function readDb(): ViewingDb {
  if (typeof localStorage === 'undefined') return emptyDb();
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '') as ViewingDb;
    if (!raw || !Array.isArray(raw.records)) return emptyDb();
    return raw;
  } catch {
    return emptyDb();
  }
}

function writeDb(db: ViewingDb) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function listMemorials(): Memorial[] {
  return readDb()
    .records
    .map((record) => record.memorial)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function readViewing(code: string): ViewingRecord | null {
  return readDb().records.find((record) => record.memorial.code === code) ?? null;
}

export function saveMemorial(memorial: Memorial): ViewingRecord {
  const db = readDb();
  const index = db.records.findIndex((record) => record.memorial.code === memorial.code);
  const next: ViewingRecord = index >= 0
    ? { ...db.records[index], memorial }
    : { memorial, memories: [], messages: [] };
  if (index >= 0) db.records[index] = next;
  else db.records.push(next);
  writeDb(db);
  return next;
}

export function addMemory(code: string, memory: Memory): ViewingRecord | null {
  const db = readDb();
  const record = db.records.find((item) => item.memorial.code === code);
  if (!record) return null;
  if (!record.memories.some((item) => item.id === memory.id)) record.memories.push(memory);
  writeDb(db);
  return record;
}

export function addRoomMessage(code: string, message: RoomMessage): ViewingRecord | null {
  const db = readDb();
  const record = db.records.find((item) => item.memorial.code === code);
  if (!record) return null;
  if (!record.messages.some((item) => item.id === message.id)) record.messages.push(message);
  writeDb(db);
  return record;
}

export function replaceViewing(record: ViewingRecord) {
  const db = readDb();
  const index = db.records.findIndex((item) => item.memorial.code === record.memorial.code);
  if (index >= 0) db.records[index] = record;
  else db.records.push(record);
  writeDb(db);
}
