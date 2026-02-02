import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

let socket: Socket | null = null

export function initSocket(userId: string) {
  if (socket) return socket

  socket = io(SOCKET_URL, {
    query: { userId },
  })

  return socket
}

export function getSocket() {
  return socket
}

