'use client';

import { Bot, LoaderCircle, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type ChatLanguage = 'en' | 'es' | 'zh';

const chatCopy = {
  en: {
    initial:
      'Hi, I am your wedding concierge. Ask me about the itinerary, menus, activities, where to stay, or what to explore in Turks and Caicos.',
    eyebrow: 'AI Concierge',
    title: 'Ask about the wedding weekend',
    close: 'Close wedding concierge',
    thinking: 'Thinking through your wedding question...',
    placeholder: 'Ask about the menus, activities, timing, or Turks and Caicos...',
    button: 'Wedding Concierge',
    error: 'Unable to reach the wedding concierge right now.',
    starters: [
      'What should I know about the wedding weekend schedule?',
      'What activity should I choose for November 24?',
      'What are the reception dinner options?',
    ],
  },
  es: {
    initial:
      'Hola, soy tu concierge de boda. Pregúntame sobre el itinerario, menús, actividades, hospedaje o qué explorar en Turks and Caicos.',
    eyebrow: 'Concierge IA',
    title: 'Pregunta sobre la boda',
    close: 'Cerrar concierge de boda',
    thinking: 'Pensando en tu pregunta...',
    placeholder: 'Pregunta sobre menús, actividades, horarios o Turks and Caicos...',
    button: 'Concierge de boda',
    error: 'No se puede contactar al concierge de boda ahora.',
    starters: [
      '¿Qué debo saber sobre la agenda de la boda?',
      '¿Qué actividad debería elegir para el 24 de noviembre?',
      '¿Cuáles son las opciones de cena?',
    ],
  },
  zh: {
    initial:
      '你好，我是你的婚礼礼宾助手。可以问我行程、菜单、活动、住宿，或特克斯和凯科斯有什么好探索。',
    eyebrow: 'AI 礼宾助手',
    title: '询问婚礼周末信息',
    close: '关闭婚礼礼宾助手',
    thinking: '正在思考你的婚礼问题...',
    placeholder: '询问菜单、活动、时间安排或特克斯和凯科斯...',
    button: '婚礼礼宾助手',
    error: '现在无法连接婚礼礼宾助手。',
    starters: [
      '婚礼行程需要了解什么？',
      '11月24日我应该选择哪个活动？',
      '婚宴晚餐有哪些选择？',
    ],
  },
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function WeddingChat({
  language = 'en',
  defaultOpen = false,
}: {
  language?: ChatLanguage;
  defaultOpen?: boolean;
}) {
  const t = chatCopy[language];
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: t.initial,
    },
  ]);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewportRef.current?.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  async function sendMessage(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const conversation = [...messages, userMessage];
      const response = await fetch('/api/wedding-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(t.error);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Missing response body.');
      }

      const assistantId = generateId();
      setMessages((current) => [...current, { id: assistantId, role: 'assistant', content: '' }]);

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const event of events) {
          if (!event.startsWith('data: ')) {
            continue;
          }

          const payload = JSON.parse(event.slice(6)) as {
            type: 'text' | 'done' | 'error';
            text?: string;
            error?: string;
          };

          if (payload.type === 'text' && payload.text) {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantId
                  ? { ...message, content: message.content + payload.text! }
                  : message,
              ),
            );
          }

          if (payload.type === 'error') {
            throw new Error(payload.error || 'Unknown chat error.');
          }
        }
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.error;

      setMessages((current) => {
        const lastAssistantIndex = [...current]
          .reverse()
          .findIndex((entry) => entry.role === 'assistant' && entry.content === '');

        if (lastAssistantIndex >= 0) {
          const targetIndex = current.length - 1 - lastAssistantIndex;
          return current.map((entry, index) =>
            index === targetIndex ? { ...entry, content: message } : entry,
          );
        }

        return [
          ...current,
          {
            id: generateId(),
            role: 'assistant',
            content: message,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-[#89a9d8] bg-[#f9fbff] shadow-[0_24px_80px_rgba(42,78,136,0.28)]">
          <div className="flex items-center justify-between bg-[linear-gradient(135deg,#5f86c7,#8ea9dc)] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/18 p-2">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-white/75">{t.eyebrow}</p>
                <p className="font-semibold">{t.title}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/12 p-2 transition hover:bg-white/20"
              aria-label={t.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={viewportRef} className="max-h-[24rem] space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm leading-6',
                    message.role === 'user'
                      ? 'bg-[#5f86c7] text-white'
                      : 'border border-[#d8e3f8] bg-white text-slate-700',
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-[1.25rem] border border-[#d8e3f8] bg-white px-4 py-3 text-sm text-slate-600">
                  <LoaderCircle className="h-4 w-4 animate-spin text-[#5f86c7]" />
                  {t.thinking}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#d8e3f8] bg-white/80 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {t.starters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void sendMessage(starter)}
                  className="rounded-full border border-[#c8d7f3] bg-[#eef4ff] px-3 py-1.5 text-xs font-medium text-[#45689d] transition hover:bg-[#dde9ff]"
                >
                  {starter}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage(input);
                  }
                }}
                placeholder={t.placeholder}
                className="min-h-[68px] resize-none rounded-[1.2rem] border-[#c8d7f3] bg-[#f7faff]"
              />
              <Button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="h-auto rounded-[1.2rem] bg-[#5f86c7] px-4 hover:bg-[#5076b8]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,#45689d,#8ea9dc)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(42,78,136,0.28)] transition hover:scale-[1.01]"
      >
        <Sparkles className="h-4 w-4" />
        {t.button}
      </button>
    </div>
  );
}
