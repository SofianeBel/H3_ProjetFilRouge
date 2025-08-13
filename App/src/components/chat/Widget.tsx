'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface ChatMessage {
  id?: string
  content: string
  senderType: 'VISITOR' | 'ADMIN' | 'BOT'
  createdAt?: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const eventRef = useRef<EventSource | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // Restore conversation from storage
  useEffect(() => {
    const saved = localStorage.getItem('chat:conversationId')
    if (saved) setConversationId(saved)
  }, [])

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  // SSE subscribe
  useEffect(() => {
    if (!conversationId || !open) return
    if (eventRef.current) {
      eventRef.current.close()
      eventRef.current = null
    }
    const es = new EventSource(`/api/chat/${conversationId}/events`)
    eventRef.current = es
    es.addEventListener('message', () => {})
    es.addEventListener('message:new', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('open', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    es.addEventListener('message', () => {})
    // Our API emits event types via pubsub: type in event name
    es.addEventListener('message', (e: MessageEvent) => {
      try {
        const payload = JSON.parse((e as any).data)
        setMessages((prev) => [...prev, payload])
      } catch {}
    })
    es.addEventListener('typing', () => {})

    es.onerror = () => {
      // keep silent; SSE will auto-retry
    }

    return () => {
      es.close()
      eventRef.current = null
    }
  }, [conversationId, open])

  const handleStart = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.message || 'Erreur démarrage chat')
      setConversationId(json.conversationId)
      localStorage.setItem('chat:conversationId', json.conversationId)
    } catch (e: any) {
      setError(e?.message || 'Erreur démarrage')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!conversationId || !content.trim()) return
    const toSend = content.trim()
    setContent('')
    setMessages((prev) => [...prev, { content: toSend, senderType: 'VISITOR' }])
    try {
      await fetch(`/api/chat/${conversationId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: toSend }),
      })
    } catch {}
  }

  return (
    <div>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700"
          aria-label="Ouvrir le chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-indigo-600 text-white flex items-center justify-between">
            <div className="font-semibold">Assistant Cyna</div>
            <button onClick={() => setOpen(false)} className="hover:text-gray-200" aria-label="Fermer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 flex flex-col gap-3">
            {!conversationId ? (
              <>
                <p className="text-sm text-gray-600">Démarrez la conversation. Laissez vos infos si vous souhaitez être recontacté.</p>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom (optionnel)"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email (optionnel)"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Démarrage…' : 'Commencer'}
                </button>
              </>
            ) : (
              <>
                <div ref={listRef} className="flex-1 overflow-auto space-y-3 pr-1">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.senderType === 'VISITOR' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${m.senderType === 'VISITOR' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Écrire un message…"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button onClick={handleSend} className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700" aria-label="Envoyer">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
