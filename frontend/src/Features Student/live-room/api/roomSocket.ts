import type { RoomEvent } from '../types'

export function emitRoomEvent(roomId: string, event: RoomEvent): Promise<void> {
  void roomId
  void event
  return new Promise((resolve) => setTimeout(resolve, 80))
}
