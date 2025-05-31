# Express TSOA API

This project is a simple Express API built with TypeScript and TSOA. It demonstrates how to create a RESTful API with a focus on a basic post creation endpoint.

## Project Structure

```
express-tsoa-api
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers           # Contains the controllers for handling requests
│   │   └── PostController.ts # Controller for post-related endpoints
│   ├── models                # Contains the data models
│   │   └── Post.ts           # Model defining the structure of a post
│   ├── routes                # Contains the route definitions
│   │   └── routes.ts         # Sets up the application routes
│   └── types                 # Contains additional types and interfaces
│       └── index.ts          # Type definitions used throughout the application
├── package.json              # NPM configuration file
├── tsconfig.json             # TypeScript configuration file
├── tsoa.json                 # TSOA configuration file
└── README.md                 # Project documentation
```

## Installation

To get started, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd express-tsoa-api
npm install
```

## Running the Application

To run the application, use the following command:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Create Post

- **Endpoint:** `POST /posts`
- **Description:** Creates a new post.
- **Request Body:**
  ```json
  {
    "title": "Post Title",
    "content": "Post Content"
  }
  ```
- **Response:**
  ```json
  {
    "id": "1",
    "title": "Post Title",
    "content": "Post Content"
  }
  ```

## License

This project is licensed under the MIT License.