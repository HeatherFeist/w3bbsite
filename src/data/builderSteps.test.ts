import { describe, expect, it } from 'vitest';
import { BUILDER } from '@/data/site';
import { BUILDER_STEP_DETAILS, builderStepPath, builderStepsInOrder } from '@/data/builderSteps';
import { matchesAppRoute } from '@/lib/routes';

describe('Business Builder step pages', () => {
  it('has one detail route for each builder step, in the same order', () => {
    expect(BUILDER_STEP_DETAILS.map((step) => step.n)).toEqual(BUILDER.steps.map((step) => step.n));
    const ordered = builderStepsInOrder();
    expect(ordered.map((step) => step.title)).toEqual([
      'Naming and branding',
      'Product development',
      'Asset generation',
      'Business logic',
      'Customer journey design',
      'Operational structure',
      'Multimedia creation',
      'Launch preparation',
    ]);
    expect(ordered.map((step) => step.to)).toEqual([
      '/builder/naming-branding',
      '/builder/product-development',
      '/builder/asset-generation',
      '/builder/business-logic',
      '/builder/customer-journey',
      '/builder/operational-structure',
      '/builder/multimedia',
      '/builder/launch-preparation',
    ]);
  });

  it('sends every step card, tool, and related link to a real route', () => {
    for (const step of BUILDER_STEP_DETAILS) {
      expect(matchesAppRoute(builderStepPath(step.n)), step.slug).toBe(true);
      expect(matchesAppRoute(step.tool.to), step.tool.to).toBe(true);
      expect(matchesAppRoute(step.pathway.to), step.pathway.to).toBe(true);
      expect(matchesAppRoute(`/launch/coach?step=${step.slug}`)).toBe(true);
      for (const link of step.related) {
        expect(matchesAppRoute(link.to), link.to).toBe(true);
      }
      expect(step.tasks.length).toBeGreaterThan(0);
      expect(step.deliverables.length).toBeGreaterThan(0);
      expect(step.why.length).toBeGreaterThan(40);
    }
  });
});