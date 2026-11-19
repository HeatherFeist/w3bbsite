import type { FC } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '@/components/PageShell';
import { usePageMeta } from '@/hooks/usePageMeta';

const PLANS = [
  { name: 'Free memorial', price: 'Free', detail: 'A private service page, condolence wall, rooms, and archive.' },
  { name: 'Premium event', price: '$49', detail: 'One memorial event, for a family that wants the full page for a single service.' },
  { name: 'Funeral home package', price: '$199', detail: 'A package a funeral home can offer families. Checkout is not connected yet.' },
  { name: 'White-label', price: 'Talk with us', detail: 'The same viewer under a funeral home’s own name. Write to us from the contact form.' },
];

const ViewingHome: FC = () => {
  usePageMeta(
    'Remote Viewer',
    'A private page for a funeral or memorial. The family hosts the service, and people far away can watch, leave a memory, and sit in a room together.',
  );

  return (
    <PageShell>
      <article className="container pb-24 pt-32">
        <p className="micro-label text-gold">Remote Viewer</p>
        <h1 className="mt-3 max-w-3xl font-display text-5xl text-white sm:text-6xl">A service people can attend from anywhere.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
          Host a memorial, share one private link, and keep the messages, photos, and rooms after the service ends. This first version is a web page. It does not require a headset.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/viewing/host" className="cta-primary inline-flex items-center justify-center rounded-full px-8 py-4 font-sans text-base font-bold">
            Create a memorial
          </Link>
          <a href="#plans" className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 font-sans text-base font-bold text-white/80">
            See the plans
          </a>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {[
            ['Host dashboard', 'Write the obituary, set the schedule, choose Zoom, Teams, Meet, or Jitsi, and copy a private link.'],
            ['Live service', 'Jitsi plays on the page. Zoom, Teams, and Google Meet open from a join button, because those services do not allow embedding.'],
            ['Condolence wall', 'Family and friends leave a message, a photo, a video link, or an audio link.'],
            ['Rooms and archive', 'After the service, people can sit in Close Family, Friends, Coworkers, or Church Members. The wall stays as the archive.'],
          ].map(([title, body]) => (
            <li key={title} className="glass p-6">
              <h2 className="font-sans text-xl font-bold normal-case text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
            </li>
          ))}
        </ul>

        <section id="plans" className="mt-16">
          <h2 className="font-display text-4xl text-white">Plans</h2>
          <p className="mt-3 max-w-2xl text-white/70">A free memorial can be created now. The paid plans are listed here. Checkout is not connected yet.</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <li key={plan.name} className="glass p-5">
                <p className="text-sm text-gold">{plan.name}</p>
                <p className="mt-2 font-display text-3xl text-white">{plan.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{plan.detail}</p>
              </li>
            ))}
          </ul>
          <Link to="/#contact" className="mt-6 inline-flex font-semibold text-gold">Ask about a funeral home package</Link>
        </section>
      </article>
    </PageShell>
  );
};

export default ViewingHome;
