import React, { useState } from 'react';
import { ORG_TYPES, STEPS } from '../catalog';
import { fieldClass, FounderFrame, labelClass, Meter } from '../components';
import { useFounder } from '../useFounder';
import { profileProgress } from '../gamification';
import { readImageFile, uid, videoEmbed } from '../storage';

const ProfilePage: React.FC = () => {
  const { state, updateProfile } = useFounder();
  const profile = state.profile;
  const progress = profileProgress(profile);
  const [ventureName, setVentureName] = useState('');
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [achievement, setAchievement] = useState('');
  const [imageError, setImageError] = useState<string | null>(null);
  const embed = profile.videoUrl ? videoEmbed(profile.videoUrl) : null;
  const skillOptions = STEPS.find((step) => step.key === 'skills')?.options ?? [];
  const interestOptions = STEPS.find((step) => step.key === 'interests')?.options ?? [];

  const toggleList = (key: 'skills' | 'interests', id: string) => {
    const list = profile[key];
    updateProfile({ [key]: list.includes(id) ? list.filter((item) => item !== id) : [...list, id] });
  };

  return (
    <FounderFrame title="Founder profile" description="Your W3BB founder profile, story, ventures, and progress.">
      <p className="micro-label text-cyan">Founder profile</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
        {profile.displayName.trim() || 'Your founder profile'}
      </h1>
      <div className="mt-6 max-w-xl">
        <Meter value={progress.percent} label="Profile progress" />
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {progress.items.map((item) => (
          <li key={item.id} className="text-sm text-white/75">
            <span className={item.done ? 'text-cyan' : 'text-white/45'} aria-hidden="true">{item.done ? '●' : '○'}</span> {item.label}
          </li>
        ))}
      </ul>

      <form className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]" onSubmit={(event) => event.preventDefault()}>
        <div>
          <div className="grid h-48 w-48 place-items-center overflow-hidden rounded-3xl border border-white/10 bg-[#1e1b24]">
            {profile.imageDataUrl ? (
              <img src={profile.imageDataUrl} alt={profile.displayName ? `${profile.displayName} profile photo` : 'Founder profile photo'} className="h-full w-full object-cover" />
            ) : (
              <span className="px-4 text-center text-sm text-white/60">Add a photo</span>
            )}
          </div>
          <label htmlFor="founder-photo" className={`${labelClass} mt-4`}>Profile photo</label>
          <input
            id="founder-photo"
            type="file"
            accept="image/*"
            className="mt-2 block w-full text-sm text-white/75"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void readImageFile(file).then((url) => {
                setImageError(null);
                updateProfile({ imageDataUrl: url });
              }).catch(() => setImageError('That image could not be read. Try a smaller JPG or PNG.'));
            }}
          />
          {imageError ? <p className="mt-2 text-sm text-gold" role="alert">{imageError}</p> : null}
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="founder-name" className={labelClass}>Name</label>
            <input id="founder-name" className={fieldClass} autoComplete="name" value={profile.displayName} onChange={(event) => updateProfile({ displayName: event.target.value })} />
          </div>
          <div>
            <label htmlFor="founder-email" className={labelClass}>Email</label>
            <input id="founder-email" type="email" autoComplete="email" className={fieldClass} value={profile.email} onChange={(event) => updateProfile({ email: event.target.value })} />
          </div>
          <div>
            <label htmlFor="founder-location" className={labelClass}>Location</label>
            <input id="founder-location" className={fieldClass} value={profile.location} onChange={(event) => updateProfile({ location: event.target.value })} placeholder="City, region, or “remote”" />
          </div>
          <div>
            <label htmlFor="founder-org" className={labelClass}>Organization type</label>
            <select id="founder-org" className={fieldClass} value={profile.orgType} onChange={(event) => updateProfile({ orgType: event.target.value as typeof profile.orgType })}>
              {ORG_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="founder-video" className={labelClass}>Intro video URL</label>
            <input id="founder-video" type="url" className={fieldClass} value={profile.videoUrl} placeholder="https://www.youtube.com/watch?v=…" onChange={(event) => updateProfile({ videoUrl: event.target.value })} />
            {embed ? (
              <iframe className="mt-3 aspect-video w-full rounded-2xl border border-white/10" src={embed} title="Founder intro video" allow="fullscreen; picture-in-picture" />
            ) : profile.videoUrl ? (
              <a className="mt-2 inline-block text-sm text-cyan underline" href={profile.videoUrl} rel="noreferrer" target="_blank">Open video link</a>
            ) : null}
          </div>
          <div>
            <label htmlFor="founder-story" className={labelClass}>Story</label>
            <textarea id="founder-story" className={`${fieldClass} min-h-32`} value={profile.story} onChange={(event) => updateProfile({ story: event.target.value })} />
          </div>
        </div>
      </form>

      <ChoiceGroup legend="Skills" options={skillOptions} selected={profile.skills} onToggle={(id) => toggleList('skills', id)} />
      <ChoiceGroup legend="Interests" options={interestOptions} selected={profile.interests} onToggle={(id) => toggleList('interests', id)} />

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-white">Ventures</h2>
        <ul className="mt-4 space-y-3">
          {profile.ventures.map((venture) => (
            <li key={venture.id} className="glass flex items-start justify-between gap-3 px-4 py-3">
              <span>
                <span className="block font-medium text-white">{venture.name}</span>
                <span className="block text-sm text-white/70">{venture.status}{venture.summary ? ` — ${venture.summary}` : ''}</span>
              </span>
              <button type="button" className="text-sm text-white/70 underline" onClick={() => updateProfile({ ventures: profile.ventures.filter((item) => item.id !== venture.id) })}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="venture-name">Venture name</label>
          <input id="venture-name" className={fieldClass} value={ventureName} placeholder="Venture name" onChange={(event) => setVentureName(event.target.value)} />
          <button
            type="button"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#16141a]"
            onClick={() => {
              if (!ventureName.trim()) return;
              updateProfile({ ventures: [...profile.ventures, { id: uid('venture'), name: ventureName.trim(), status: 'Idea', summary: '' }] });
              setVentureName('');
            }}
          >
            Add venture
          </button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-white">Milestones</h2>
        <ul className="mt-4 space-y-3">
          {profile.milestones.map((milestone) => (
            <li key={milestone.id} className="glass flex items-start justify-between gap-3 px-4 py-3">
              <span className="text-white">{milestone.title}</span>
              <button type="button" className="text-sm text-white/70 underline" onClick={() => updateProfile({ milestones: profile.milestones.filter((item) => item.id !== milestone.id) })}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="milestone-title">Milestone</label>
          <input id="milestone-title" className={fieldClass} value={milestoneTitle} placeholder="Milestone" onChange={(event) => setMilestoneTitle(event.target.value)} />
          <button
            type="button"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#16141a]"
            onClick={() => {
              if (!milestoneTitle.trim()) return;
              updateProfile({ milestones: [...profile.milestones, { id: uid('mile'), title: milestoneTitle.trim(), note: '', date: '' }] });
              setMilestoneTitle('');
            }}
          >
            Add milestone
          </button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-white">Achievements</h2>
        <ul className="mt-4 space-y-2">
          {profile.achievements.map((item, index) => (
            <li key={`${item}-${index}`} className="flex items-center justify-between gap-3 text-sm text-white/85">
              <span>{item}</span>
              <button type="button" className="text-white/70 underline" onClick={() => updateProfile({ achievements: profile.achievements.filter((_, itemIndex) => itemIndex !== index) })}>Remove</button>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="achievement">Achievement</label>
          <input id="achievement" className={fieldClass} value={achievement} placeholder="Achievement" onChange={(event) => setAchievement(event.target.value)} />
          <button
            type="button"
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#16141a]"
            onClick={() => {
              if (!achievement.trim()) return;
              updateProfile({ achievements: [...profile.achievements, achievement.trim()] });
              setAchievement('');
            }}
          >
            Add achievement
          </button>
        </div>
      </section>

      <section className="mt-10 glass p-6">
        <h2 className="font-display text-xl font-semibold text-white">Certifications and funding notes</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          Learning-pathway progress and saved sample funding records live in the command center. Trust-Approved Certification is a separate application for the business.
        </p>
        <p className="mt-3 text-sm text-white/80">
          Pathways completed: tracked on the pathways page. Funding records saved: {state.fundingApplications.length}.
        </p>
      </section>
    </FounderFrame>
  );
};

function ChoiceGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset className="mt-10">
      <legend className="font-display text-2xl font-semibold text-white">{legend}</legend>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option.id);
          return (
            <label key={option.id} className={`cursor-pointer rounded-full border px-4 py-2 text-sm ${on ? 'border-cyan bg-cyan/15 text-white' : 'border-white/15 text-white/75'}`}>
              <input className="sr-only" type="checkbox" checked={on} onChange={() => onToggle(option.id)} />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default ProfilePage;
