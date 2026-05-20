import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppProvider';
import {
  CHAT_QUICK_REPLIES,
  CHAT_THREADS,
  DEMO_AGENT_REPLIES,
  SUPPORT_HOURS,
  type ChatMessage,
  type ChatThread,
} from '../data/chatSupport';
import { fetchChatMessages, fetchChatThreads, postChatMessage } from '../lib/messagesApi';

function nowLabel(): string {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function cloneThreads(): ChatThread[] {
  return CHAT_THREADS.map((t) => ({
    ...t,
    messages: t.messages.map((m) => ({ ...m })),
  }));
}

export function MessagesPage() {
  const { navigateTo, user, isLoggedIn, openAuthModal, authSessionReady } = useApp();
  const [threads, setThreads] = useState<ChatThread[]>(cloneThreads);
  const [activeId, setActiveId] = useState('support');
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesPaneRef = useRef<HTMLDivElement>(null);

  const active = threads.find((t) => t.id === activeId) ?? threads[0];
  const messageCount = active?.messages.length ?? 0;

  const scrollChatToBottom = useCallback(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    pane.scrollTo({ top: pane.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, []);

  useEffect(() => {
    scrollChatToBottom();
  }, [activeId, messageCount, typing, scrollChatToBottom]);

  useEffect(() => {
    if (!authSessionReady) return;
    if (!isLoggedIn) {
      const local = cloneThreads();
      setThreads(local);
      setActiveId(local[0]?.id ?? 'support');
      return;
    }
    void fetchChatThreads().then((apiThreads) => {
      if (!apiThreads?.length) return;
      setThreads(
        apiThreads.map((t) => ({
          ...t,
          messages: [],
        })),
      );
      setActiveId(apiThreads[0].id);
    });
  }, [authSessionReady, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || !activeId) return;
    void fetchChatMessages(activeId).then((msgs) => {
      if (!msgs) return;
      setThreads((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, messages: msgs, preview: msgs.at(-1)?.text ?? t.preview } : t)),
      );
    });
  }, [activeId, isLoggedIn]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !active) return;

    if (isLoggedIn) {
      setDraft('');
      setTyping(true);
      const added = await postChatMessage(active.id, trimmed);
      setTyping(false);
      if (!added) return;
      setThreads((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? {
                ...t,
                preview: added.at(-1)?.text ?? trimmed,
                unread: 0,
                messages: [...t.messages, ...added],
              }
            : t,
        ),
      );
      return;
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: nowLabel(),
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              preview: trimmed,
              unread: 0,
              messages: [...t.messages, userMsg],
            }
          : t,
      ),
    );
    setDraft('');
    setTyping(true);

    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        text: DEMO_AGENT_REPLIES[Math.floor(Math.random() * DEMO_AGENT_REPLIES.length)],
        time: nowLabel(),
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === active.id
            ? {
                ...t,
                preview: reply.text,
                messages: [...t.messages, reply],
              }
            : t,
        ),
      );
      setTyping(false);
    }, 1400);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(draft);
  };

  const selectThread = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
  };

  return (
    <div className="chat-page">
      <div className="chat-page-hero">
        <div className="container">
          <nav className="breadcrumb breadcrumb--on-dark" aria-label="Breadcrumb">
            <button type="button" onClick={() => navigateTo('home')}>
              Home
            </button>
            <span className="sep">/</span>
            <span className="current" aria-current="page">
              Messages
            </span>
          </nav>
          <div className="chat-page-hero-inner">
            <div>
              <h1>Live chat</h1>
              <p>Chat with TOBC support about courses, bookings, and accreditation.</p>
            </div>
            <div className="chat-status-pill" role="status">
              <span className="chat-status-dot" aria-hidden />
              Support online · {SUPPORT_HOURS}
            </div>
          </div>
        </div>
      </div>

      <section className="chat-page-body">
        <div className="container">
          {!isLoggedIn && (
            <p className="chat-guest-banner" role="note">
              <i className="bi bi-info-circle" aria-hidden />
              You can chat as a guest.{' '}
              <button type="button" className="chat-guest-link" onClick={() => openAuthModal('login')}>
                Sign in
              </button>{' '}
              to save conversation history across devices.
            </p>
          )}

          <div className={`chat-shell${mobileShowChat ? ' chat-shell--chat-open' : ''}`}>
            <aside className="chat-sidebar" aria-label="Conversations">
              <div className="chat-sidebar-head">
                <h2>Inbox</h2>
                <button type="button" className="btn btn-secondary btn--sm" disabled title="Coming soon">
                  <i className="bi bi-plus-lg" aria-hidden /> New
                </button>
              </div>
              <ul className="chat-thread-list" role="list">
                {threads.map((thread) => (
                  <li key={thread.id}>
                    <button
                      type="button"
                      className={`chat-thread-item${thread.id === activeId ? ' is-active' : ''}`}
                      onClick={() => selectThread(thread.id)}
                      aria-current={thread.id === activeId ? 'true' : undefined}
                    >
                      <span className="chat-thread-avatar" aria-hidden>
                        <i className="bi bi-headset" />
                      </span>
                      <span className="chat-thread-meta">
                        <span className="chat-thread-top">
                          <span className="chat-thread-title">{thread.title}</span>
                          <span className="chat-thread-time">{thread.messages.at(-1)?.time}</span>
                        </span>
                        <span className="chat-thread-bottom">
                          <span className="chat-thread-preview">{thread.preview}</span>
                          {thread.unread > 0 && (
                            <span className="chat-thread-unread">{thread.unread}</span>
                          )}
                        </span>
                      </span>
                      {thread.online && <span className="chat-thread-online" title="Online" />}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="chat-main">
              {active ? (
                <>
                  <header className="chat-main-head">
                    <button
                      type="button"
                      className="chat-back-btn"
                      aria-label="Back to inbox"
                      onClick={() => setMobileShowChat(false)}
                    >
                      <i className="bi bi-arrow-left" aria-hidden />
                    </button>
                    <div className="chat-main-head-info">
                      <h2>{active.title}</h2>
                      <p>
                        {active.online ? (
                          <>
                            <span className="chat-status-dot chat-status-dot--sm" aria-hidden />
                            Online · {active.subtitle}
                          </>
                        ) : (
                          active.subtitle
                        )}
                      </p>
                    </div>
                    <div className="chat-main-head-actions">
                      <button type="button" className="chat-icon-btn" aria-label="Search in conversation" disabled>
                        <i className="bi bi-search" aria-hidden />
                      </button>
                      <button type="button" className="chat-icon-btn" aria-label="More options" disabled>
                        <i className="bi bi-three-dots" aria-hidden />
                      </button>
                    </div>
                  </header>

                  <div
                    ref={messagesPaneRef}
                    className="chat-messages"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions"
                  >
                    <div className="chat-day-divider">
                      <span>Today</span>
                    </div>
                    {active.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat-bubble-row chat-bubble-row--${msg.sender}`}
                      >
                        {msg.sender === 'agent' && (
                          <span className="chat-bubble-avatar" aria-hidden>
                            <i className="bi bi-person-badge" />
                          </span>
                        )}
                        <div className={`chat-bubble chat-bubble--${msg.sender}`}>
                          <p>{msg.text}</p>
                          <time dateTime={msg.time}>{msg.time}</time>
                        </div>
                      </div>
                    ))}
                    {typing && (
                      <div className="chat-bubble-row chat-bubble-row--agent">
                        <span className="chat-bubble-avatar" aria-hidden>
                          <i className="bi bi-person-badge" />
                        </span>
                        <div className="chat-bubble chat-bubble--typing" aria-label="Support is typing">
                          <span />
                          <span />
                          <span />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="chat-quick-replies" role="group" aria-label="Quick replies">
                    {CHAT_QUICK_REPLIES.map((label) => (
                      <button
                        key={label}
                        type="button"
                        className="chat-quick-reply"
                        onClick={() => void sendMessage(label)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <form className="chat-composer" onSubmit={onSubmit}>
                    <button type="button" className="chat-icon-btn" aria-label="Attach file" disabled>
                      <i className="bi bi-paperclip" aria-hidden />
                    </button>
                    <label className="visually-hidden" htmlFor="chatMessageInput">
                      Type your message
                    </label>
                    <input
                      id="chatMessageInput"
                      type="text"
                      placeholder={
                        user
                          ? `Message as ${user.name.split(' ')[0]}…`
                          : 'Type your message…'
                      }
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="chat-send-btn"
                      aria-label="Send message"
                      disabled={!draft.trim()}
                    >
                      <i className="bi bi-send-fill" aria-hidden />
                    </button>
                  </form>
                </>
              ) : (
                <div className="chat-main-empty">Select a conversation to start chatting.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
