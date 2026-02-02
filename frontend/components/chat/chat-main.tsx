"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Menu, Phone, Video, MoreVertical, Send } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { Chat, Message } from "@/app/chat/page"

interface ChatMainProps {
  chat: Chat
  messages: Message[]
  onSendMessage: (content: string) => void
  onOpenSidebar: () => void
}

export function ChatMain({ chat, messages, onSendMessage, onOpenSidebar }: ChatMainProps) {
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <main className="flex-1 flex flex-col bg-card">
      {/* Header */}
      <header className="px-5 py-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-primary/70 shadow-md">
            <AvatarFallback className="text-primary-foreground font-semibold">
              {chat.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-foreground">{chat.name}</h2>
            <p className="text-xs text-success">{chat.online ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ActionButton icon={<Phone className="w-4 h-4" />} label="Voice call" />
          <ActionButton icon={<Video className="w-4 h-4" />} label="Video call" />
          <ActionButton icon={<MoreVertical className="w-4 h-4" />} label="More options" />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-background">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 max-w-[70%] animate-in fade-in slide-in-from-bottom-2 ${
              message.sent ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {!message.sent && (
              <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-primary/70 shadow-sm flex-shrink-0">
                <AvatarFallback className="text-primary-foreground text-xs font-semibold">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm ${
                  message.sent
                    ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                    : "bg-card text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <p className="text-xs text-muted-foreground text-center">{message.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-5 border-t border-border bg-card">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-border rounded-3xl bg-background text-foreground text-sm resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className="h-11 w-11 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </main>
  )
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
      aria-label={label}
    >
      {icon}
    </button>
  )
}
