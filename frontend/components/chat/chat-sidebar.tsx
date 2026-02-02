"use client"

import { useState } from "react"
import { Search, Settings, Moon, Sun, LogOut, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Chat } from "@/app/chat/page"

interface ChatSidebarProps {
  chats: Chat[]
  selectedChat: Chat
  onSelectChat: (chat: Chat) => void
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function ChatSidebar({
  chats,
  selectedChat,
  onSelectChat,
  isOpen,
  onClose,
  darkMode,
  onToggleDarkMode,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside
      className={`
        w-80 bg-card border-r border-border flex flex-col shadow-lg
        fixed md:relative inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 relative">
            <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-primary/70 shadow-md cursor-pointer hover:scale-105 transition-transform">
              <AvatarFallback className="text-primary-foreground font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">John Doe</h3>
              <span className="text-xs text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Settings Dropdown */}
          {showSettings && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors">
                <User className="w-4 h-4" />
                Profile
              </button>
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors">
                <span className="text-sm text-foreground flex items-center gap-3">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  Dark Mode
                </span>
                <button
                  onClick={onToggleDarkMode}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    darkMode ? "bg-primary" : "bg-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      darkMode ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="h-px bg-border" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors">
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`
              w-full px-4 py-4 mx-2 rounded-xl text-left transition-all duration-200
              ${
                selectedChat.id === chat.id
                  ? "bg-sidebar-accent border-l-[3px] border-primary"
                  : "hover:bg-muted border-l-[3px] border-transparent"
              }
            `}
            style={{ width: "calc(100% - 1rem)" }}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 bg-gradient-to-br from-primary to-primary/70 shadow-md">
                  <AvatarFallback className="text-primary-foreground font-semibold">
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-foreground text-sm truncate">
                    {chat.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate pr-2">
                    {chat.lastMessage}
                  </p>
                  {chat.unread && (
                    <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
