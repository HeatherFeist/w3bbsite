import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';
import { viewingCanSync, pushMemorial } from '../remote';
import { createAccessCode, listMemorials, saveMemorial } from '../store';
import { PROVIDERS, type LiveProvider, type Memorial, type ScheduleItem } from '../types';

function blankSchedule(): ScheduleItem {
  return { id: crypto.randomUUID(), time: '', title: '', detail: '' };
}

const HostDashboard: FC = () => {
  usePageMeta('Host a memorial', 'Create a private memorial page, add the obituary and schedule, and copy a link for the family.');
  const [memorials, setMemorials] = useState<Memorial[]>(() => listMemorials());
  const [personName, setPersonName] = useState('');
  const [dates, setDates] = useState('');
  const [hostName, setHostName] = useState('');
  const [obituary, setObituary] = useState('');
  const [provider, setProvider] = useState<LiveProvider>('jitsi');
  const [liveUrl, setLiveUrl] = useState('');
  const [schedule, setSchedule] = useState<ScheduleItem[]>([blankSchedule()]);
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');

  const create = async () => {
    const name = personName.trim();
    if (!name) return;
    const now = new Date().toISOString();
    const memorial: Memorial = {
      id: crypto.randomUUID(),
      code: createAccessCode(),
      personName: name,
      dates: dates.trim(),
      hostName: hostName.trim(),
      obituary: obituary.trim(),
      schedule: schedule.filter((item) => item.title.trim() || item.time.trim()),
      provider,
      liveUrl: liveUrl.trim(),
      createdAt: now,
      updatedAt: now,
    };
    saveMemorial(memorial);
    const shared = await pushMemorial(memorial);
    setMemorials(listMemorials());
    const url = `${window.location.origin}/viewing/${memorial.code}`;
    setLink(url);
    setNote(shared
      ? 'The private link is saved to the connected database. Anyone with the link can open it.'
      : 'The private link works in this browser. Connect Supabase to share the same page with family on other devices.');
    setPersonName('');
    setDates('');
    setObituary('');
    setLiveUrl('');
    setSchedule([blankSchedule()]);
  };

  return (
    <PageShell>
      <article className="container max-w-3xl pb-24 pt-32">
        <Link to="/viewing" className="text-sm font-semibold text-gold">Remote Viewer</Link>
        <h1 className="mt-3 font-display text-5xl text-white">Host a memorial</h1>
        <p className="mt-4 text-white/70">
          {viewingCanSync()
            ? 'Supabase is connected. New memorials can be opened from the private link on another device.'
            : 'This browser is keeping the memorial. The link below will open it here. Add the Supabase env vars to share it.'}
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void create();
          }}
        >
          <label className="block text-sm font-semibold text-white/80">
            Name
            <input className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" value={personName} onChange={(event) => setPersonName(event.target.value)} required />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Dates
            <input className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" value={dates} onChange={(event) => setDates(event.target.value)} placeholder="1948–2026" />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Your name
            <input className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" value={hostName} onChange={(event) => setHostName(event.target.value)} />
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Obituary
            <textarea className="mt-2 min-h-36 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" value={obituary} onChange={(event) => setObituary(event.target.value)} />
          </label>
          <fieldset>
            <legend className="text-sm font-semibold text-white/80">Service schedule</legend>
            <ul className="mt-2 space-y-3">
              {schedule.map((item) => (
                <li key={item.id} className="grid gap-2 sm:grid-cols-[8rem_1fr]">
                  <input className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-3 text-white" placeholder="2:00" value={item.time} onChange={(event) => setSchedule((rows) => rows.map((row) => row.id === item.id ? { ...row, time: event.target.value } : row))} />
                  <input className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-3 text-white" placeholder="Visitation, service, or reception" value={item.title} onChange={(event) => setSchedule((rows) => rows.map((row) => row.id === item.id ? { ...row, title: event.target.value } : row))} />
                </li>
              ))}
            </ul>
            <button type="button" className="mt-3 text-sm font-semibold text-gold" onClick={() => setSchedule((rows) => [...rows, blankSchedule()])}>Add a time</button>
          </fieldset>
          <label className="block text-sm font-semibold text-white/80">
            Live service
            <select className="mt-2 w-full rounded-xl border border-white/15 bg-[#1e1b24] px-4 py-3 text-white" value={provider} onChange={(event) => setProvider(event.target.value as LiveProvider)}>
              {PROVIDERS.map((item) => <option key={item.id} value={item.id}>{item.label}{item.embed ? ' — plays on the page' : ' — opens in a new window'}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-white/80">
            Meeting link
            <input className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white" value={liveUrl} onChange={(event) => setLiveUrl(event.target.value)} placeholder={provider === 'jitsi' ? 'Leave blank to open a Jitsi room for this memorial' : 'https://'} />
          </label>
          <button type="submit" className="cta-primary rounded-full px-8 py-4 font-sans text-base font-bold">Create the private link</button>
        </form>

        {link ? (
          <div className="mt-8 rounded-2xl border border-gold/40 bg-gold/10 p-5" role="status">
            <p className="font-semibold text-white">Private link</p>
            <p className="mt-2 break-all text-gold">{link}</p>
            <p className="mt-2 text-sm text-white/75">{note}</p>
            <button type="button" className="mt-3 text-sm font-semibold text-white" onClick={() => void navigator.clipboard.writeText(link)}>Copy link</button>
          </div>
        ) : null}

        <section className="mt-12">
          <h2 className="font-sans text-2xl font-bold normal-case text-white">Memorials on this browser</h2>
          <ul className="mt-4 space-y-3">
            {memorials.length === 0 ? <li className="text-white/60">None yet.</li> : null}
            {memorials.map((memorial) => (
              <li key={memorial.code}>
                <Link to={`/viewing/${memorial.code}`} className="glass block p-4">
                  <span className="font-semibold text-white">{memorial.personName}</span>
                  <span className="mt-1 block text-sm text-white/60">{memorial.dates || 'Dates not added'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </PageShell>
  );
};

export default HostDashboard;
