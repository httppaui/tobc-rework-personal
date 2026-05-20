export type ChatSender = 'user' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  time: string;
}

export interface ChatThread {
  id: string;
  title: string;
  subtitle: string;
  preview: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

export const SUPPORT_HOURS = 'Mon–Sat, 8:00 AM – 8:00 PM (PHT)';

export const CHAT_THREADS: ChatThread[] = [
  {
    id: 'support',
    title: 'TOBC Support',
    subtitle: 'General help & bookings',
    preview: 'How can we help with your course today?',
    unread: 0,
    online: true,
    messages: [
      {
        id: 'm1',
        sender: 'system',
        text: 'You are connected to TOBC Support. Typical reply time is under 5 minutes during business hours.',
        time: '10:02 AM',
      },
      {
        id: 'm2',
        sender: 'agent',
        text: 'Hi! I’m Mara from TOBC Support. Ask about courses, bookings, payments, or MARINA accreditation.',
        time: '10:02 AM',
      },
    ],
  },
  {
    id: 'booking',
    title: 'Booking assistant',
    subtitle: 'Schedules & confirmations',
    preview: 'Share your booking reference if you have one.',
    unread: 1,
    online: true,
    messages: [
      {
        id: 'b1',
        sender: 'agent',
        text: 'Need help with a schedule change or payment proof? Send your course name or confirmation ID.',
        time: 'Yesterday',
      },
    ],
  },
];

export const CHAT_QUICK_REPLIES = [
  'Help with a booking',
  'MARINA accreditation',
  'Payment & refund',
  'Find a course',
];

export const DEMO_AGENT_REPLIES = [
  'Thanks for your message! A support specialist will follow up shortly. For urgent booking issues, include your course name in your next message.',
  'I’ve noted that. You can also email admin@theonlinebookingcorp.com with screenshots if needed.',
  'During peak hours we reply within a few minutes. Is there anything else about your training booking?',
];
