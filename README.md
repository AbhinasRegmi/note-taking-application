# **Note-Taking Application**

## **Overview**

This is a full-stack note-taking application built with **React (frontend), NestJS (backend), and PostgreSQL (database)**. It allows users to create, edit, delete, and categorize notes. Authentication and authroization is session-based, and the app enforces authorization through ownership checks.

### **Deployment**

- Hosted on **Render.com** at **[https://notes.abhinasregmi.com.np](https://notes.abhinasregmi.com.np)**
- It has **1-minute cold start** due to begin on **free tier**

## **Setup Instructions**

### **Prerequisites**

Ensure you have the following installed:

- **Node.js**
- **PostgreSQL** ( postgresql instance connection uri also works )
- **npm**

### **Environment Variables**

A `.env.example` file is provided inside `be` folder with the required environment variables. Copy its contents into a new `.env` file inside `be` and modify the values as needed.

### **Frontend Setup**

1. **Clone the repository**

```sh
git clone https://github.com/AbhinasRegmi/note-taking-application.git
```

2. **Navigate to the frontend directory**

```sh
cd fe
```

3. **Install dependencies**

```sh
npm install
```

4. **Start the server**

If you want to run a development server you will need to modify the `base_url` present at `fe/src/constants/routes.ts` to `http://localhost:8000/api/v1`

```sh
npm run dev
```

No change is required to build the project.

```sh
  npm run build
```

This will generate build file inside `be/client` which will be later used by `node` to server static assets.

### **Backend Setup**

1. **Navigate to backend directory**

```sh
cd be # Or cd ../be if you are inside fe
```

1. **Install dependencies**

```sh
npm install
```

1. **Run database migrations**

```sh
npx prisma migrate dev
```

3. **Start the backend server**

The `development mode` has `CORS` restrictions disabled and different `fe` and `be` url can be present.

```sh
npm run start:dev
```

But for `production mode` we need to build the static assets and keep in `be/client` as mentioned earlier.

```sh
PRODUCTION=true npm run start
```
The server starts at `http://localhost:8000`

## **Engineering Decisions**

### **Tech Stack**

- **Frontend**: React
- **Backend**: NestJS with Prisma ORM.
- **Database**: PostgreSQL

### **Authentication & Authorization**

- **Authentication**: Implemented using **session-based authentication** for secure user sessions. `Email verification` is supported along with `Direct login link` for easier access which is implemented using `signed urls`.
- **Authorization**: Notes are owned by users, and simple ownership checks ensure only the creator can modify them.

### **Features**

- **API Documentation**: Available at **`/docs`**, making it easy to explore and test the API.

- **CRUD**: Application has crud for `notes` and `categories`. User can create notes with multiple categories and edit or delete them later. Categories are listed with total count of notes linked to each category and can be removed if they have no notes.

- **Notfications**: Frontend has robust notifications using the `toaster` for client and server side events as well as errors.

- **Filtering**: Application supports server side filtering based on `title`, `createdAt` and `updatedAt`. Also we can filter notes based on `categories`.

- **Search**: Notes search is powered with `full-text-search` by `postgresql` which tokenizes key word and ranks the search for `title` and `content`.

- **Logging**: Backend has robust logging mechanism for `errors`, `info` and every `request` accepted by the server with `request path` and `method` accessed by the request. 

- **Asynchronous Event Driven Architecture**: Some features like `sending email` are decoupled from the contoller with `events` to have faster responses.

- **Static assets**: The frontend is also served at `/` from the `nestjs` backend.

- **Test**: Using jest for unit testing.

## **Assumptions**

- **Users own their notes**, and there are no shared notes.
- **Categories are user-defined**, meaning each user can create and assign categories.
- **Pagination and filtering** happen on the **server side** for efficiency.
- **No admin roles**, only regular users.
