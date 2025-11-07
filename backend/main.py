from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from typing import List

app = FastAPI()

# uvicorn main:app --reload --host 0.0.0.0 --port 8000


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.usernames: dict[WebSocket, str] = {}

    async def connect(self, websocket: WebSocket, username: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.usernames[websocket] = username

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.usernames:
            del self.usernames[websocket]

    async def broadcast(self, message: str):
        # Send raw text message to all connections
        to_remove: List[WebSocket] = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                # schedule removal
                to_remove.append(connection)
        for c in to_remove:
            self.disconnect(c)


manager = ConnectionManager()


@app.websocket("/ws/{username}")
async def websocket_endpoint(websocket: WebSocket, username: str):
    """WebSocket endpoint. Connect using ws://localhost:8000/ws/{username}

    Sends/receives plain text messages. Server broadcasts the message to all connected clients
    in the format: JSON string like: {"type":"message","user":"alice","message":"hello"}
    Also sends join/leave notifications with type "join"/"leave".
    """
    await manager.connect(websocket, username)
    # Notify others about join
    join_payload = {"type": "join", "user": username, "message": f"{username} joined the chat"}
    import json

    await manager.broadcast(json.dumps(join_payload))

    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast incoming message as JSON with username
            payload = {"type": "message", "user": username, "message": data}
            await manager.broadcast(json.dumps(payload))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        leave_payload = {"type": "leave", "user": username, "message": f"{username} left the chat"}
        await manager.broadcast(json.dumps(leave_payload))
    except Exception:
        # ensure cleanup on unexpected errors
        manager.disconnect(websocket)
        leave_payload = {"type": "leave", "user": username, "message": f"{username} left the chat"}
        await manager.broadcast(json.dumps(leave_payload))
