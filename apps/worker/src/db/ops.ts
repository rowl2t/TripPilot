export interface WorkerDbAdapter {
  updateAiRun: (params: { idempotencyKey: string; status: 'success' | 'failed'; error?: string }) => Promise<void>;
  updateSavedLinkStatus: (savedLinkId: string, status: 'queued' | 'processing' | 'completed' | 'failed', error?: string) => Promise<void>;
  updateTripStatus: (tripId: string, status: 'draft' | 'planning' | 'planned' | 'failed') => Promise<void>;
  insertAuditLog: (params: { actorUserId?: string; action: string; targetType: string; targetId?: string; metadata?: Record<string, unknown> }) => Promise<void>;
}

export const createNoopDbAdapter = (): WorkerDbAdapter => ({
  updateAiRun: async () => undefined,
  updateSavedLinkStatus: async () => undefined,
  updateTripStatus: async () => undefined,
  insertAuditLog: async () => undefined
});
