 "use client"

import { useEffect, useState } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatMain } from "@/components/chat/chat-main"
import { useRouter } from "next/navigation"
import { checkAuth, type AuthUser } from "@/lib/auth-api"
import { getUsersForSidebar, getMessages, sendMessage } from "@/lib/chat-api"
import { initSocket } from "@/lib/socket"

export interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread?: number
  online?: boolean
}

export interface Message {
  id: string
  content: string
  time: string
  sent: boolean
  avatar?: string
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load current user and conversations
  useEffect(() => {
    const init = async () => {
      try {
        const user = await checkAuth()
        setCurrentUser(user)

        const users = await getUsersForSidebar()

        const mappedChats: Chat[] = users.map((u) => ({
          id: u._id,
          name: u.userName,
          avatar: (u.userName || u.email)
            .split(" ")
            .map((part) => part[0]?.toUpperCase())
            .join("")
            .slice(0, 2),
          lastMessage: "",
          time: "",
        }))

        setChats(mappedChats)
        if (mappedChats.length > 0) {
          setSelectedChat(mappedChats[0])
          const msgs = await getMessages(mappedChats[0].id)

          // Set sidebar preview for the first chat
          if (msgs.length > 0) {
            const last = msgs[msgs.length - 1]
            const lastTime = new Date(last.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            setChats((prev) =>
              prev.map((c) =>
                c.id === mappedChats[0].id
                  ? {
                      ...c,
                      lastMessage: last.text || (last.image ? "Image" : ""),
                      time: lastTime,
                    }
                  : c,
              ),
            )
          }

          setMessages(
            msgs.map((m) => ({
              id: m._id,
              content: m.text || "",
              time: new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              sent: m.senderId === user._id,
              avatar: mappedChats[0].avatar,
            }))
          )
        }
      } catch (err) {
        // Not authenticated – go back to login
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    void init()
  }, [router])

  // Initialize socket.io and real-time listeners
  useEffect(() => {
    if (!currentUser) return

    const socket = initSocket(currentUser._id)

    const handleNewMessage = (m: any) => {
      // Only show messages for the currently selected chat
      if (!currentUser) return

      const chatId = m.senderId === currentUser._id ? m.receiverId : m.senderId

      // Update sidebar last message for that chat
      const time = new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                lastMessage: m.text || (m.image ? "Image" : ""),
                time,
              }
            : c,
        ),
      )

      if (!selectedChat || selectedChat.id !== chatId) return

      // Append to currently open conversation

      setMessages((prev) => [
        ...prev,
        {
          id: m._id || `${Date.now()}`,
          content: m.text || "",
          time,
          sent: m.senderId === currentUser._id,
          avatar: selectedChat.avatar,
        },
      ])
    }

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users)
      setChats((prev) =>
        prev.map((c) => ({
          ...c,
          online: users.includes(c.id),
        })),
      )
    }

    socket.on("newMessage", handleNewMessage)
    socket.on("getOnlineUsers", handleOnlineUsers)

    return () => {
      socket.off("newMessage", handleNewMessage)
      socket.off("getOnlineUsers", handleOnlineUsers)
    }
  }, [currentUser, selectedChat])

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat)
    setSidebarOpen(false)

    try {
      if (!currentUser) return

      const msgs = await getMessages(chat.id)

      // Update sidebar preview for this chat
      if (msgs.length > 0) {
        const last = msgs[msgs.length - 1]
        const lastTime = new Date(last.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        setChats((prev) =>
          prev.map((c) =>
            c.id === chat.id
              ? {
                  ...c,
                  lastMessage: last.text || (last.image ? "Image" : ""),
                  time: lastTime,
                }
              : c,
          ),
        )
      }

      setMessages(
        msgs.map((m) => ({
          id: m._id,
          content: m.text || "",
          time: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sent: m.senderId === currentUser._id,
          avatar: chat.avatar,
        })),
      )
    } catch {
      // ignore for now
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedChat || !currentUser) return

    try {
      const newMsg = await sendMessage(selectedChat.id, { text: content })
      const mapped: Message = {
        id: newMsg._id,
        content: newMsg.text || "",
        time: new Date(newMsg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sent: newMsg.senderId === currentUser._id,
        avatar: selectedChat.avatar,
      }

      // Optimistic update; socket "newMessage" will also arrive
      setMessages((prev) => [...prev, mapped])

      // Update sidebar preview for this chat immediately
      setChats((prev) =>
        prev.map((c) =>
          c.id === selectedChat.id
            ? {
                ...c,
                lastMessage: mapped.content,
                time: mapped.time,
              }
            : c,
        ),
      )
    } catch {
      // could show toast
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  if (loading || !selectedChat) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading chats...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        onSelectChat={handleSelectChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Chat Area */}
      <ChatMain
        chat={selectedChat}
        messages={messages}
        onSendMessage={handleSendMessage}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
    </div>
  )
}
