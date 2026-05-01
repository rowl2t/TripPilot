import { describe, expect, it } from 'vitest';

import { buildReminderPayload } from './booking';

describe('buildReminderPayload', () => {
  it('builds 60/30 min reminders when due_date exists', () => {
    const result = buildReminderPayload({ id: 'task-1', due_date: '2026-07-01' });
    expect(result).toEqual([{ taskId: 'task-1', offsetMinutes: 60 }, { taskId: 'task-1', offsetMinutes: 30 }]);
  });
});
