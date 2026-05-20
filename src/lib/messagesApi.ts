import { apiRequest } from './api';

export type ApiChatThread = {
  id: string;
  title: string;
  subtitle: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
};

export type ApiChatMessage = {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  time: string;
};

export async function fetchChatThreads(): Promise<ApiChatThread[] | null> {
  const result = await apiRequest<{ threads: ApiChatThread[] }>('/api/messages/threads');
  return result.ok ? result.data.threads : null;
}

export async function fetchChatMessages(threadId: string): Promise<ApiChatMessage[] | null> {
  const result = await apiRequest<{ messages: ApiChatMessage[] }>(
    `/api/messages/threads/${encodeURIComponent(threadId)}/messages`,
  );
  return result.ok ? result.data.messages : null;
}

export async function postChatMessage(
  threadId: string,
  text: string,
): Promise<ApiChatMessage[] | null> {
  const result = await apiRequest<{ messages: ApiChatMessage[] }>(
    `/api/messages/threads/${encodeURIComponent(threadId)}/messages`,
    { method: 'POST', body: JSON.stringify({ text }) },
  );
  return result.ok ? result.data.messages : null;
}
