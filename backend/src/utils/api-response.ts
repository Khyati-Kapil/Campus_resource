export const ok = <T>(data: T) => ({ success: true, data });

export const fail = (code: string, message: string, requestId?: string) => ({
  success: false,
  error: { code, message, requestId }
});
