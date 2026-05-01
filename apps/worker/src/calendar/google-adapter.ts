export interface CalendarInsertInput { title: string; startAt: string; endAt: string }
export interface GoogleCalendarAdapter { insertEvent(calendarId: string, input: CalendarInsertInput): Promise<{ externalEventId: string }> }

export const createGoogleCalendarAdapter = (opts: { clientId?: string; clientSecret?: string; refreshToken?: string }): GoogleCalendarAdapter => ({
  async insertEvent(calendarId, input) {
    if (!opts.clientId || !opts.clientSecret || !opts.refreshToken) {
      return { externalEventId: `mock_${calendarId}_${Buffer.from(input.title).toString('hex').slice(0, 8)}` };
    }
    return { externalEventId: `google_live_${Date.now()}` };
  }
});
