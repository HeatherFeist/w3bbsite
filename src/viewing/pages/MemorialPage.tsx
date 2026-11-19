import { useEffect, useState, type FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { liveView } from '../live';
import { pullViewing, pushMemory, pushMessage, viewingCanSync } from '../remote';
import { addMemory, addRoomMessage, readViewing, replaceViewing } from '../store';
import { ROOMS, type Memory, type MemoryKind, type RoomId, type RoomMessage, type ViewingRecord } from '../types';

type Tab = 'service' | 'wall' | 'rooms' | 'archive';

function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function photoDataUrl(file: File): Promise<string> {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not read that photo.');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
}

const MemorialPage: FC = () => {
  const { code = '' } = useParams();
  const [record, setRecord] = useState<ViewingRecord | null>(null);
  const [missing, setMissing] = useState(false);
  const [tab, setTab] = useState<Tab>('service');
  const [author, setAuthor] = useState(() => {
    try {
      return sessionStorage.getItem('w3bb.viewing.name') ?? '';
    } catch {
      return '';
    }
  });
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<MemoryKind>('message');
  const [mediaUrl, setMediaUrl] = useState('');
  const [room, setRoom] = useState<RoomId>('family');
  const [roomBody, setRoomBody] = useState('');
  const [error, setError] = useState('');

  usePageMeta(
    record ? `In memory of ${record.memorial.personName}` : 'Memorial',
    'A private memorial page with the service, condolences, rooms, and archive.',
  );

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      const remote = await pullViewing(code);
      const local = readViewing(code);
      if (cancel) return;
      const next = remote ?? local;
      if (remote) replaceViewing(remote);
      setRecord(next);
      setMissing(!next);
    };
    void load();
    const timer = window.setInterval(() => void load(), 8000);
    return () => {
      cancel = true;
      window.clearInterval(timer);
    };
  }, [code]);

  const rememberName = (value: string) => {
    setAuthor(value);
    try {
      sessionStorage.setItem('w3bb.viewing.name', value);
    } catch {
      /* The name still fills the form for this visit. */
    }
  };

  const postMemory = async () => {
    if (!record) return;
    const name = author.trim();
    const text = body.trim();
    if (!name || (!text && !mediaUrl)) {
      setError('Add your name and a memory.');
      return;
    }
    const memory: Memory = {
      id: uid('memory'),
      author: name,
      body: text,
      kind,
      mediaUrl,
      createdAt: new Date().toISOString(),
    };
    const saved = addMemory(code, memory) ?? { ...record, memories: [...record.memories, memory] };
    replaceViewing(saved);
    setRecord(saved);
    setBody('');
    setMediaUrl('');
    setError('');
    await pushMemory(code, memory);
  };

  const postRoom = async () => {
    if (!record) return;
    const name = author.trim();
    const text = roomBody.trim();
    if (!name || !text) {
      setError('Add your name and a note for the room.');
      return;
    }
    const message: RoomMessage = {
      id: uid('room'),
      room,
      author: name,
      body: text,
      createdAt: new Date().toISOString(),
    };
    const saved = addRoomMessage(code, message) ?? { ...record, messages: [...record.messages, message] };
    replaceViewing(saved);
    setRecord(saved);
    setRoomBody('');
    setError('');
    await pushMessage(code, message);
  };

  if (missing) {
    return (
      <PageShell>
        <article className="container pb-24 pt-32">
          <h1 className="font-display text-5xl text-white">This private link does not open a memorial.</h1>
          <p className="mt-4 max-w-xl text-white/70">Ask the host for the link again. If they created it on another browser without Supabase, it stays on that browser.</p>
          <Link to="/viewing" className="mt-6 inline-flex font-semibold text-gold">About Remote Viewer</Link>
        </article>
      </PageShell>
    );
  }

  if (!record) {
    return (
      <PageShell>
        <article className="container pb-24 pt-32">
          <p className="text-white/70" role="status">Opening the memorial.</p>
        </article>
      </PageShell>
    );
  }

  const { memorial } = record;
  const live = liveView(memorial.provider, memorial.liveUrl, memorial.code);
  const roomNotes = record.messages.filter((message) => message.room === room);

  return (
    <PageShell>
      <article className="container pb-24 pt-32">
        <p className="micro-label text-gold">In memory</p>
        <h1 className="mt-3 font-display text-5xl text-white sm:text-6xl">{memorial.personName}</h1>
        {memorial.dates ? <p className="mt-3 text-lg text-white/70">{memorial.dates}</p> : null}
        {memorial.hostName ? <p className="mt-2 text-sm text-white/55">Hosted by {memorial.hostName}</p> : null}
        {!viewingCanSync() ? (
          <p className="mt-4 max-w-2xl text-sm text-white/55">Memories written here stay in this browser until Supabase is connected.</p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Memorial sections">
          {([
            ['service', 'Service'],
            ['wall', 'Condolences'],
            ['rooms', 'Rooms'],
            ['archive', 'Archive'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === id ? 'bg-gold text-[#241a08]' : 'border border-white/15 text-white/80'}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'service' ? (
          <div className="mt-8 grid gap-6">
            {memorial.obituary ? (
              <section className="glass p-6">
                <h2 className="font-sans text-2xl font-bold normal-case text-white">Obituary</h2>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-white/80">{memorial.obituary}</p>
              </section>
            ) : null}
            {memorial.schedule.length ? (
              <section className="glass p-6">
                <h2 className="font-sans text-2xl font-bold normal-case text-white">Schedule</h2>
                <ol className="mt-4 space-y-3">
                  {memorial.schedule.map((item) => (
                    <li key={item.id}>
                      <p className="font-semibold text-white">{item.time ? `${item.time} — ` : ''}{item.title}</p>
                      {item.detail ? <p className="text-sm text-white/70">{item.detail}</p> : null}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
            <section className="glass p-6">
              <h2 className="font-sans text-2xl font-bold normal-case text-white">Live service</h2>
              <p className="mt-2 text-sm text-white/70">{live.note}</p>
              {live.mode === 'frame' ? (
                <iframe title={`Service for ${memorial.personName}`} src={live.src} allow="camera; microphone; display-capture; fullscreen" className="mt-4 h-[28rem] w-full rounded-xl border border-white/10" />
              ) : null}
              {live.href ? (
                <a href={live.href} target="_blank" rel="noopener noreferrer" className="cta-primary mt-4 inline-flex rounded-full px-6 py-3 font-sans font-bold">
                  Join the service
                </a>
              ) : (
                <p className="mt-4 text-sm text-white/60">The host has not added a meeting link yet.</p>
              )}
            </section>
          </div>
        ) : null}

        {tab === 'wall' ? (
          <section className="mt-8">
            <h2 className="font-sans text-2xl font-bold normal-case text-white">Condolence wall</h2>
            <form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); void postMemory(); }}>
              <input className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" placeholder="Your name" value={author} onChange={(event) => rememberName(event.target.value)} />
              <textarea className="min-h-28 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" placeholder="A message, a story, or a note about the photo or recording" value={body} onChange={(event) => setBody(event.target.value)} />
              <div className="flex flex-wrap gap-2">
                {(['message', 'photo', 'video', 'audio'] as const).map((item) => (
                  <button key={item} type="button" className={`rounded-full px-4 py-2 text-sm ${kind === item ? 'bg-white text-[#16141a]' : 'border border-white/15 text-white/75'}`} onClick={() => { setKind(item); setMediaUrl(''); }}>{item}</button>
                ))}
              </div>
              {kind === 'photo' ? (
                <input type="file" accept="image/*" className="text-sm text-white/70" onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  void photoDataUrl(file).then(setMediaUrl).catch(() => setError('That photo could not be read.'));
                }} />
              ) : null}
              {kind === 'video' || kind === 'audio' ? (
                <input className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" placeholder="https:// link to the video or audio" value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
              ) : null}
              {error ? <p className="text-sm text-[#ffb3a0]" role="alert">{error}</p> : null}
              <button type="submit" className="cta-primary w-fit rounded-full px-6 py-3 font-sans font-bold">Leave this memory</button>
            </form>
            <ul className="mt-8 space-y-4">
              {record.memories.slice().reverse().map((memory) => <MemoryCard key={memory.id} memory={memory} />)}
            </ul>
          </section>
        ) : null}

        {tab === 'rooms' ? (
          <section className="mt-8">
            <h2 className="font-sans text-2xl font-bold normal-case text-white">Rooms</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">Stay in the room that fits. These notes remain with the memorial after the service.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ROOMS.map((item) => (
                <button key={item.id} type="button" className={`rounded-full px-4 py-2 text-sm ${room === item.id ? 'bg-gold text-[#241a08]' : 'border border-white/15 text-white/80'}`} onClick={() => setRoom(item.id)}>{item.label}</button>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/60">{ROOMS.find((item) => item.id === room)?.note}</p>
            <form className="mt-4 grid gap-3" onSubmit={(event) => { event.preventDefault(); void postRoom(); }}>
              <input className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" placeholder="Your name" value={author} onChange={(event) => rememberName(event.target.value)} />
              <textarea className="min-h-24 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" placeholder="A note for this room" value={roomBody} onChange={(event) => setRoomBody(event.target.value)} />
              <button type="submit" className="cta-primary w-fit rounded-full px-6 py-3 font-sans font-bold">Send to this room</button>
            </form>
            <ul className="mt-6 space-y-3">
              {roomNotes.map((message) => (
                <li key={message.id} className="glass p-4">
                  <p className="text-sm text-gold">{message.author}</p>
                  <p className="mt-1 whitespace-pre-wrap text-white/85">{message.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {tab === 'archive' ? (
          <section className="mt-8">
            <h2 className="font-sans text-2xl font-bold normal-case text-white">Memory archive</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">Everything left on the wall stays with this memorial.</p>
            <ul className="mt-6 space-y-4">
              {record.memories.length === 0 ? <li className="text-white/60">No memories yet.</li> : null}
              {record.memories.map((memory) => <MemoryCard key={memory.id} memory={memory} />)}
            </ul>
          </section>
        ) : null}
      </article>
    </PageShell>
  );
};

const MemoryCard: FC<{ memory: Memory }> = ({ memory }) => (
  <li className="glass p-5">
    <p className="text-sm text-gold">{memory.author} · {memory.kind}</p>
    {memory.body ? <p className="mt-2 whitespace-pre-wrap text-white/85">{memory.body}</p> : null}
    {memory.kind === 'photo' && memory.mediaUrl.startsWith('data:image') ? (
      <img src={memory.mediaUrl} alt="" className="mt-3 max-h-80 rounded-xl object-contain" />
    ) : null}
    {(memory.kind === 'video' || memory.kind === 'audio') && /^https:\/\//.test(memory.mediaUrl) ? (
      <a href={memory.mediaUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex font-semibold text-gold">Open the {memory.kind}</a>
    ) : null}
  </li>
);

export default MemorialPage;
