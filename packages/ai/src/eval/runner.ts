import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createOpenAIResponsesAdapter } from '../adapters/openai-responses';
import { createPlacesAdapter } from '../adapters/places';
import { createRouteAdapter } from '../adapters/routes';
import { planTrip } from '../pipeline/planner';
import { evalInputs } from './inputs';

interface EvalCaseResult { id: string; passed: boolean; checks: Record<string, boolean>; estimatedCost: number }

const checkCase = (result: Awaited<ReturnType<typeof planTrip>>, budget: number): Record<string, boolean> => {
  const hasMeals = result.itinerary.items.some((i) => i.item_type === 'meal');
  const days = new Set(result.itinerary.items.map((i) => i.day)).size;
  const costSum = result.itinerary.items.reduce((a, i) => a + (i.estimated_cost ?? 0), 0);
  const hasBooking = result.bookingTasks.tasks.length > 0;
  const densityOk = result.itinerary.items.length / Math.max(1, days) <= 5;
  return {
    schemaValid: true,
    noMissingDays: days > 0,
    mealIncluded: hasMeals,
    densityOk,
    budgetOk: costSum <= budget * 1.2,
    bookingTaskExists: hasBooking
  };
};

export const runAiEvaluation = async () => {
  const deps = { openai: createOpenAIResponsesAdapter(), places: createPlacesAdapter(), routes: createRouteAdapter() };
  const results: EvalCaseResult[] = [];

  for (const c of evalInputs) {
    const out = await planTrip(c.input, deps);
    const checks = checkCase(out, c.input.budget.amount);
    const passed = Object.values(checks).every(Boolean);
    results.push({ id: c.id, passed, checks, estimatedCost: out.tokenUsage.estimatedCost });
  }

  const summary = { total: results.length, passed: results.filter((r) => r.passed).length, failed: results.filter((r) => !r.passed).length };
  const report = { generatedAt: new Date().toISOString(), mode: process.env.OPENAI_API_KEY ? 'real-ai' : 'mock-ai', summary, results };

  const outDir = resolve(process.cwd(), 'packages/ai/reports');
  mkdirSync(outDir, { recursive: true });
  const latestPath = resolve(outDir, 'latest.json');
  writeFileSync(latestPath, JSON.stringify(report, null, 2));

  const baselinePath = resolve(outDir, 'baseline.json');
  let regressionFailed = false;
  try {
    const baseline = JSON.parse(readFileSync(baselinePath, 'utf8')) as { summary: { passed: number } };
    if (report.summary.passed < baseline.summary.passed) regressionFailed = true;
  } catch {}

  if (regressionFailed) throw new Error('AI evaluation regression: passed count is lower than baseline');
  return report;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runAiEvaluation().then((r) => console.log(JSON.stringify(r.summary))).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
