
# 90's Chat Room

This project is a nostalgic recreation of a 1990s PC communication chat room. It's designed to bring back the feel of the early days of online chatting with a simple interface reminiscent of those times.

## Demo

https://90-s-chat-room.vercel.app

## Features

- **Real-Time Messaging**: Users can send and receive messages in real-time, mimicking the experience of a 90s chat room.
- **Nickname System**: Users can change their nickname by typing `N` or `N username` in the chat.
- **Scrolling Chat History**: Chat messages automatically scroll when they overflow the chat box.
- **Random Nickname Assignment**: When users first join, they are assigned a random nickname from a predefined list.

## Technology Stack

- **Next.js**: The framework used to build the React-based web application.
- **Vercel**: The platform used for deployment.
- **MicroCMS**: Used as the backend to store and retrieve chat messages.
- **Polling**: Instead of using WebSockets, this project uses a polling mechanism to retrieve messages at regular intervals. This approach is chosen to keep the project free of charge, avoiding the cost implications of maintaining a persistent connection.

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
   NEXT_PUBLIC_PC_COMMUNICATION_NICKNAMES=nickname1,nickname2,nickname3
   NEXT_PUBLIC_FETCH_INTERVAL=3000
   NEXT_PUBLIC_DELETE_INTERVAL=60000
   NEXT_PUBLIC_SEND_INTERVAL=1000
   ```

    - `NEXT_PUBLIC_PC_COMMUNICATION_NICKNAMES`: A comma-separated list of possible nicknames.
    - `NEXT_PUBLIC_FETCH_INTERVAL`: Interval in milliseconds to fetch new messages.
    - `NEXT_PUBLIC_DELETE_INTERVAL`: Interval in milliseconds to delete old messages.
    - `NEXT_PUBLIC_SEND_INTERVAL`: Interval in milliseconds to send queued messages.

4. Run the development server:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## Deployment

To deploy this project using Vercel, follow these steps:

1. Push the repository to your GitHub (or another supported platform).
2. Import the repository into Vercel.
3. Set up the environment variables in Vercel.
4. Deploy the project.

## Limitations

- **Polling Mechanism**: This project uses polling instead of WebSockets to keep the operation cost-free. While this approach works, it may not be as efficient as WebSockets for real-time applications.
- **Free Tier Limitations**: The application is designed to operate within the free tiers of Vercel and MicroCMS, which may introduce certain limitations on the number of requests and storage.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

Special thanks to the open-source community and the developers of Next.js, Vercel, and MicroCMS for providing the tools and platforms that made this project possible.
