import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { EmojiReactionWithUsers } from '@shared/schema';

type AddReactionParams = {
  ticketId: number;
  emoji: string;
  createdBy: string;
}

type RemoveReactionParams = {
  ticketId: number;
  reactionId: number;
  username: string;
}

export function useEmojiReactions(ticketId: number) {
  const [reactions, setReactions] = useState<EmojiReactionWithUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const isConnecting = useRef(false);

  // Function to fetch reactions via REST API
  const fetchReactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest({
        url: `/api/tickets/${ticketId}/reactions`,
        method: 'GET'
      });
      setReactions(data as EmojiReactionWithUsers[] || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reactions'));
      console.error('Error fetching reactions:', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  // Function to add a reaction
  const addReaction = useCallback(async (params: AddReactionParams) => {
    try {
      const data = await apiRequest({
        url: `/api/tickets/${params.ticketId}/reactions`,
        method: 'POST',
        data: {
          emoji: params.emoji,
          createdBy: params.createdBy,
          users: [params.createdBy]
        }
      });
      return data as EmojiReactionWithUsers;
    } catch (err) {
      console.error('Error adding reaction:', err);
      throw err;
    }
  }, []);

  // Function to remove a reaction
  const removeReaction = useCallback(async (params: RemoveReactionParams) => {
    try {
      const data = await apiRequest({
        url: `/api/tickets/${params.ticketId}/reactions/${params.reactionId}/users/${params.username}`,
        method: 'DELETE'
      });
      return data as EmojiReactionWithUsers | null;
    } catch (err) {
      console.error('Error removing reaction:', err);
      throw err;
    }
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    // Skip if no ticket ID or already connecting
    if (!ticketId || isConnecting.current) return;
    
    const connectWebSocket = () => {
      isConnecting.current = true;
      
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
        isConnecting.current = false;
        
        // Subscribe to ticket reactions
        socket.send(JSON.stringify({
          type: 'subscribe',
          ticketId
        }));
      };
      
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'reactions' && data.ticketId === ticketId) {
            setReactions(data.reactions || []);
          }
        } catch (err) {
          console.error('Error processing WebSocket message:', err);
        }
      };
      
      socket.onclose = () => {
        console.log('WebSocket connection closed');
        isConnecting.current = false;
        
        // Attempt to reconnect after delay
        setTimeout(() => {
          if (socketRef.current === socket) {
            socketRef.current = null;
          }
        }, 3000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnecting.current = false;
      };
      
      socketRef.current = socket;
    };
    
    connectWebSocket();
    
    // Initial fetch via REST API (as backup)
    fetchReactions();
    
    // Cleanup
    return () => {
      const socket = socketRef.current;
      if (socket) {
        // Unsubscribe
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'unsubscribe',
            ticketId
          }));
        }
        
        // Close socket
        socket.close();
        socketRef.current = null;
      }
    };
  }, [ticketId, fetchReactions]);

  return {
    reactions,
    loading,
    error,
    addReaction,
    removeReaction,
    refetch: fetchReactions
  };
}