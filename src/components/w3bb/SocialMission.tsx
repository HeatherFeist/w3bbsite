import React from 'react';
import { MISSION, IMAGES } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const SocialMission: React.FC = () => (
  <section id="mission" className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32 lg:py-40">
    <img
      src={IMAGES.orbField}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen"
      loading="lazy"
      decoding="async"
    />
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, #07080C 0%, rgba(7,8,12,0.55) 40%, rgba(7,8,12,0.75) 70%, #07080C 100%)',
      }}
      aria-hidden="true"
    />

    <div className="container relative">
      <SectionHeading label={MISSION.label} heading={MISSION.heading} intro={MISSION.paragraph} />

      <Reveal className="mt-14">
        <h3 className="text-center font-display text-lg font-medium text-white/55">
          {MISSION.supportTitle}
        </h3>
      </Reveal>

      <ul className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSION.support.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={i * 80}
            className={i === 3 ? 'lg:col-start-1 lg:col-end-2' : undefined}
          >
            <article className="glass glass-lift group flex h-full items-center gap-4 p-5 sm:p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-inset ring-white/10 transition-colors duration-500 group-hover:ring-gold/40">
                <Icon name={item.icon} className="h-5 w-5 text-gold" />
              </span>
              <h4 className="font-display text-base font-semibold leading-snug text-white sm:text-lg">
                {item.title}
              </h4>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={140}>
        <p className="mx-auto mt-14 max-w-3xl text-center text-lg leading-relaxed text-white/75 sm:text-xl">
          {MISSION.closing}
        </p>
      </Reveal>
    </div>
  </section>
);

export default SocialMission;
