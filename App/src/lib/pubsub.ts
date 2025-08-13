import { EventEmitter } from 'events'

type ChatEvent = { type: 'message' | 'typing'; payload: any }

const emitter = (global as any).__CHAT_EMITTER__ || new EventEmitter()
;(global as any).__CHAT_EMITTER__ = emitter

export function publish(channel: string, event: ChatEvent) {
  emitter.emit(channel, event)
}

export function subscribe(channel: string, handler: (event: ChatEvent) => void) {
  const listener = (e: ChatEvent) => handler(e)
  emitter.on(channel, listener)
  return () => emitter.off(channel, listener)
}
