import React from 'react';
import { fieldClass, labelClass } from './components';
import { fieldValue, notebookFields } from './notebook';
import { useFounder } from './useFounder';

const NotebookForm: React.FC<{ slug: string }> = ({ slug }) => {
  const { state, setNotebookField } = useFounder();
  const fields = notebookFields(slug);
  if (!fields.length) return null;

  return (
    <section className="glass p-6 sm:p-8" aria-labelledby="builder-notebook">
      <h2 id="builder-notebook" className="font-display text-2xl font-semibold text-white">Your notebook</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        These lines are the choices for this step. A blueprint draft shows until you change it. What you write is saved with your founder progress.
      </p>
      <div className="mt-5 space-y-4">
        {fields.map((field) => {
          const value = fieldValue(slug, field.id, state.notebook, state.blueprint);
          const fromBlueprint = state.notebook[slug]?.[field.id] === undefined && value.trim().length > 0;
          const shared = {
            id: `${slug}-${field.id}`,
            value,
            placeholder: field.placeholder,
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setNotebookField(slug, field.id, event.target.value);
            },
            className: fieldClass,
          };
          return (
            <div key={field.id}>
              <label htmlFor={shared.id} className={labelClass}>{field.label}</label>
              {field.multiline ? (
                <textarea {...shared} rows={4} />
              ) : (
                <input {...shared} type="text" />
              )}
              {fromBlueprint ? (
                <p className="mt-1 text-xs text-white/45">Showing the blueprint draft. Edit it to keep your own line.</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default NotebookForm;
