import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { LeaderboardTeam } from '@/types';

const SSE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

interface UseLeaderboardSSEOptions {
  enabled?: boolean;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: string) => void;
}

/**
 * Hook that establishes an SSE connection to receive real-time leaderboard updates.
 * Automatically updates React Query cache when new data arrives.
 */
export function useLeaderboardSSE(options: UseLeaderboardSSEOptions = {}) {
  const { enabled = true, onConnectionChange, onError } = options;
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    // Don't create duplicate connections
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    console.log('[useLeaderboardSSE] Connecting to SSE...');

    const eventSource = new EventSource(`${SSE_URL}/api/sse/leaderboard`);

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[useLeaderboardSSE] SSE connected');
      onConnectionChange?.(true);

      // Clear any pending reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.onmessage = (event) => {
      console.log('[useLeaderboardSSE] SSE message received');
      try {
        const leaderboard: LeaderboardTeam[] = JSON.parse(event.data);
        console.log('[useLeaderboardSSE] Leaderboard updated:', leaderboard.length, 'teams');

        // Update React Query cache for both 'leaderboard' queries
        queryClient.setQueryData(['leaderboard'], leaderboard);

        // Also invalidate teams query to refresh related data
        queryClient.invalidateQueries({ queryKey: ['teams'] });
      } catch (err) {
        console.error('[useLeaderboardSSE] Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('[useLeaderboardSSE] SSE error:', err);
      onConnectionChange?.(false);
      onError?.('Connection lost. Reconnecting...');

      // Close the errored connection
      eventSource.close();
      eventSourceRef.current = null;

      // Schedule reconnect
      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, 3000);
      }
    };
  }, [enabled, queryClient, onConnectionChange, onError]);

  useEffect(() => {
    connect();

    return () => {
      console.log('[useLeaderboardSSE] Cleaning up SSE connection');

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [connect]);

  return {
    reconnect: connect,
  };
}
