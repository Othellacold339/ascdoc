import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkUrlReachability } from '../../src/utils/url.js';

describe('checkUrlReachability', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('returns reachable: true for 200 OK', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
    } as Response);

    const result = await checkUrlReachability('https://example.com');
    expect(result.reachable).toBe(true);
    expect(fetch).toHaveBeenCalledWith('https://example.com', expect.any(Object));
  });

  it('returns reachable: true for 301/302 redirects', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 301,
      statusText: 'Moved Permanently',
    } as Response);

    const result = await checkUrlReachability('https://example.com');
    expect(result.reachable).toBe(true);
  });

  it('falls back to GET if HEAD returns 403', async () => {
    // 1st call: HEAD -> 403
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
    } as Response);
    
    // 2nd call: GET -> 200
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    const result = await checkUrlReachability('https://example.com');
    expect(result.reachable).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(vi.mocked(fetch).mock.calls[0][1]?.method).toBe('HEAD');
    expect(vi.mocked(fetch).mock.calls[1][1]?.method).toBe('GET');
  });

  it('returns reachable: false for 404 Not Found', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    const result = await checkUrlReachability('https://example.com');
    expect(result.reachable).toBe(false);
    expect(result.error).toContain('HTTP 404');
  });

  it('returns reachable: false on timeout', async () => {
    vi.mocked(fetch).mockImplementationOnce(() => {
        const error = new Error('The operation was aborted');
        error.name = 'AbortError';
        throw error;
    });

    const result = await checkUrlReachability('https://example.com', 100);
    expect(result.reachable).toBe(false);
    expect(result.error).toBe('Connection timed out');
  });

  it('returns reachable: false on network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('DNS Error'));

    const result = await checkUrlReachability('https://example.com');
    expect(result.reachable).toBe(false);
    expect(result.error).toBe('DNS Error');
  });
});
