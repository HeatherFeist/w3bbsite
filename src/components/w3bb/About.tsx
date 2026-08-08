import React from 'react';
import { ABOUT } from '@/data/site';
import Icon from '@/components/w3bb/Icon';
import Reveal from '@/components/w3bb/Reveal';
import SectionHeading from '@/components/w3bb/SectionHeading';

export const About: React.FC = () => (
  <section id="about" className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
    <div className="container">
      <SectionHeading label={ABOUT.label} heading={ABOUT.heading} intro={ABOUT.paragraph} />

      <Reveal className="mt-16 sm:mt-20">
        <h3 className="text-center font-display text-lg font-medium text-white/55">
          {ABOUT.cardsTitle}
        </h3>
      </Reveal>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT.cards.map((card, i) => (
          <Reveal as="li" key={card.title} delay={i * 90}>
            <article className="glass glass-lift group h-full p-6 sm:p-7">
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet/30 to-cyan/20 ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:from-violet/50 group-hover:to-cyan/30">
                <Icon name={card.icon} className="h-5 w-5 text-white" />
              </span>
              <h4 className="mt-5 font-display text-lg font-semibold leading-snug text-white">
                {card.title}
              </h4>
              <p className="mt-2.5 text-sm leading-relaxed text-white/60">{card.description}</p>
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={140}>
        <p className="mx-auto mt-16 max-w-3xl text-center text-lg leading-relaxed text-white/75 sm:text-xl">
          {ABOUT.closing}
        </p>
      </Reveal>
    </div>
  </section>
);

export default About;
