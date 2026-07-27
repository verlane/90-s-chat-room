
# 90's Chat Room

This project is a nostalgic recreation of a 1990s PC communication chat room. It's designed to bring back the feel of the early days of online chatting with a simple interface reminiscent of those times.

## Demo

https://90-s-chat-room.vercel.app

<img src="https://github.com/user-attachments/assets/766c1a94-5b95-4189-a0f2-d1b2581cb8c8" alt="Demo" width="406"/>

## Features

- **Real-Time Messaging**: Users can send and receive messages in real-time, mimicking the experience of a 90s chat room.
- **Nickname System**: Users can change their nickname by typing `N` or `N username` in the chat.
- **Scrolling Chat History**: Chat messages automatically scroll when they overflow the chat box.
- **Random Nickname Assignment**: When users first join, they are assigned a random nickname from a predefined list.
- **Message Timestamps**: Each chat message shows a small timestamp of when it was sent.
- **Stale System Log Cleanup**: Join/rename notifications older than 24 hours are hidden from the chat view. Old join notifications are also periodically deleted from the backend to conserve microCMS's free-tier content quota (rename notifications are kept).
- **Bandwidth-Efficient Polling**: Polling pauses while the browser tab is in the background and resumes immediately when it becomes visible again. New messages are fetched incrementally instead of re-fetching the full history on every poll, keeping data transfer well within microCMS's free-tier limits.

## Technology Stack

- **Next.js**: The framework used to build the React-based web application.
- **Vercel**: The platform used for deployment.
- **MicroCMS**: Used as the backend to store and retrieve chat messages.
- **Polling**: Instead of using WebSockets, this project uses a polling mechanism to retrieve messages at regular intervals. This approach is chosen to keep the project free of charge, avoiding the cost implications of maintaining a persistent connection.
- **Vitest**: Unit tests for message utilities and cleanup logic.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/verlane/90-s-chat-room.git
   cd 90s-chat-room
   ```

2. Install the dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file at the root of your project with the following contents:

   ```plaintext
   MICROCMS_SERVICE_DOMAIN=hoge
   MICROCMS_API_KEY=hogehoge
   NEXT_PUBLIC_PC_COMMUNICATION_NICKNAMES=nickname1,nickname2,nickname3
   NEXT_PUBLIC_FETCH_INTERVAL=3000
   NEXT_PUBLIC_DELETE_INTERVAL=60000
   NEXT_PUBLIC_SEND_INTERVAL=1000
   ```

    - `MICROCMS_SERVICE_DOMAIN`: MicroCMS Domain.
    - `MICROCMS_API_KEY`: MicroCMS API Key.
    - `NEXT_PUBLIC_PC_COMMUNICATION_NICKNAMES`: A comma-separated list of possible nicknames.
    - `NEXT_PUBLIC_FETCH_INTERVAL`: Interval in milliseconds to fetch new messages.
    - `NEXT_PUBLIC_DELETE_INTERVAL`: Interval in milliseconds to delete old messages.
    - `NEXT_PUBLIC_SEND_INTERVAL`: Interval in milliseconds to send queued messages.

4. Run the development server:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

5. Run the tests:

   ```bash
   yarn test
   ```

## Deployment

To deploy this project using Vercel, follow these steps:

1. Push the repository to your GitHub (or another supported platform).
2. Import the repository into Vercel.
3. Set up the environment variables in Vercel.
4. Deploy the project.

## Limitations

- **Polling Mechanism**: This project uses polling instead of WebSockets to keep the operation cost-free. While this approach works, it may not be as efficient as WebSockets for real-time applications.
- **Free Tier Limitations**: The application is designed to operate within the free tiers of Vercel and MicroCMS, which may introduce certain limitations on the number of requests and storage. Incremental polling, background-tab pausing, and periodic stale-log cleanup help reduce usage, but very active rooms may still approach microCMS's free-tier content and data transfer limits.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

Special thanks to the open-source community and the developers of Next.js, Vercel, and MicroCMS for providing the tools and platforms that made this project possible.
