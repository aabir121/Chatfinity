# Chatfinity: Real-time Chat Application

Chatfinity is a basic chat application built using React for the frontend, .NET Core for the backend, and SignalR as the real-time communication mechanism. The main goal of this personal pet project is to facilitate real-time chat communication between users.

## Installation

1. Clone the repository: `git clone https://github.com/aabir121/social_network.git`
2. Navigate to the frontend directory: `cd Chatfinity/frontend`
3. Install frontend dependencies: `npm install`
4. Navigate to the backend directory: `cd ../backend`
5. Install backend dependencies: `dotnet restore`

## Usage

1. Start the backend server: `dotnet run` (within the backend directory)
2. Start the frontend development server: `npm start` (within the frontend directory)
3. Access the application at `http://localhost:3000` in your web browser.

## Technologies Used

- Frontend: React, React Bootstrap, React Icons, React Redux, React Spinners, UUID
- Backend: .NET Core, SignalR
- Database: MongoDB (using MongoDB driver for .NET Core)

## Features

- User authentication: Users can create accounts by providing a username, password, and basic information. They can also upload an avatar and customize their profiles.
- Real-time communication: Chatfinity uses SignalR to facilitate real-time communication between users.
- Private messaging: Users can send private messages to each other.
- General chat room: Users can participate in a general chat room with all users.
- Message management: Users can delete their own messages and update them.
- Mobile compatibility: The application is optimized for mobile devices and different screen sizes.

## Project Structure

- Frontend: The frontend code is located in the `frontend` directory. It is built using React and utilizes various libraries and frameworks mentioned in the Technologies Used section.
- Backend: The backend code is located in the `backend` directory. It is built using .NET Core and SignalR. The application follows the Onion Architecture and implements a Command Pattern. The MongoDB driver for .NET Core is used for connecting to the MongoDB database.

## Contributing

Contributions to Chatfinity are welcome! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Make changes and commit them: `git commit -m 'Add some feature'`
4. Push the changes to your branch: `git push origin feature-name`
5. Submit a pull request.


## Contact

For any questions or support, feel free to reach out to me at aabir121@gmail.com.

