# 💬 WebSocket: Expo, NestJS, Next.js

This monorepo contains three separate applications using WebSockets:
- **Expo (React Native)**: A mobile app for real-time communication.
- **NestJS**: A backend WebSocket server.
- **Next.js**: A frontend web app utilizing WebSockets.

## 🧬 Project Structure
```
WebSocket/
│   ├── Expo/     # React Native app with WebSocket client
│   ├── Nest/     # WebSocket gateway using NestJS
│   ├── Next/     # Web app with WebSocket client
├── README.md     # Project documentation
```

## 🛠️ Features
### 1. **Expo (React Native)**
- Connects to the WebSocket server.
- Listens for real-time messages.
- Sends messages via WebSockets.

### 2. **NestJS (Backend Server)**
- Implements WebSocket gateway using `@nestjs/websockets` and `socket.io`.
- Broadcasts messages to connected clients.
- Manages WebSocket connections efficiently.

### 3. **Next.js (Web Frontend)**
- Establishes WebSocket connection.
- Displays incoming real-time messages.
- Sends messages through WebSockets.

## 🚀 Getting Started

### Instalation

```sh
git clone https://github.com/Sworzen1/WebSocket.git
```

### Running the Applications
#### Start NestJS WebSocket Server
```sh
cd Nest
```

```sh
yarn install
```

```sh
yarn start:dev
```

#### Start Next.js Web Application
```sh
cd Next
```

```sh
npm install
```

```sh
npm run dev
```

#### Start Expo React Native App
```sh
cd Expo
```

```sh
yarn install
```

```sh
yarn start
```

### Example WebSocket Flow
1. Client connects to the server.
2. User sends a message from Expo or Next.js.
3. NestJS receives the message and broadcasts it to all clients.
4. Clients receive and display the message in real-time.

## 📈 Future Improvements
- Authentication for WebSocket connections.
- Improved UI/UX for message handling.
- Database integration for persistent messaging.

## License
This project is licensed under the MIT License.
