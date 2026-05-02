import { describe, expect, it } from 'vitest';

import { createInviteMailer } from './resend-adapter';

describe('invite mailer', () => {
  it('returns mock id without api key', async () => {
    const mailer = createInviteMailer();
    const res = await mailer.sendInvite({ to: 'a@b.com', tripId: 't1', inviteLink: 'https://x' });
    expect(res.id).toContain('mock_invite');
  });
});
