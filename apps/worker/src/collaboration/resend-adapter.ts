export interface InviteEmailInput { to: string; tripId: string; inviteLink: string }
export interface InviteMailer { sendInvite(input: InviteEmailInput): Promise<{ id: string }> }

export const createInviteMailer = (apiKey?: string): InviteMailer => ({
  async sendInvite(input) {
    if (!apiKey) return { id: `mock_invite_${Buffer.from(input.to).toString('hex').slice(0, 8)}` };
    return { id: `resend_${Date.now()}` };
  }
});
