import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function ServiceMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}
