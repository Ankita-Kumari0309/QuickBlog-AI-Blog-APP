# QuickBlog AI-Blog App

[![Live App](https://img.shields.io/badge/Live-App-4CAF50?style=for-the-badge&logo=vercel)](https://quick-blog-ai-blog-app.vercel.app/)

**QuickBlog AI-Blog App** is a modern, AI-powered blogging platform built using the **MERN (MongoDB, Express, React, Node.js)** stack. Users can quickly create, manage, and publish blog posts with the help of **AI (Gemini)**. The app features **JWT-based authentication**, a clean and intuitive dashboard, and a seamless experience for content creation and management.

---

## 🌟 Features

### 1. User Authentication
- Secure **JWT-based login and signup**.
- User sessions and authentication management.

### 2. Dashboard
The dashboard is divided into **four main sections**:

**Home**
- Displays the total number of blog posts.
- Donut chart visualizing blog posts by category.
- Shows the **top 5 recent blogs**.

**Write Blog**
- AI-assisted blog creation with **title, subtitle, and category** input.
- Option to write and publish blogs manually.
- AI generates content automatically using Gemini for faster writing.

**All Blogs**
- View all blogs created by the user.
- Options to **publish/unpublish, edit, or delete** blogs.

**Profile**
- Update **name, bio, and profile image**.
- Manage personal account settings.

### 3. Additional Features
- Responsive and modern design using **Tailwind CSS**.
- Easy **CRUD operations** for blogs.
- RESTful APIs with **secure endpoints**.
- Deployed for production:
  - **Frontend:** Vercel
  - **Backend:** Render

---

## 🛠 Tech Stack

| Layer        | Technology                 |
|--------------|---------------------------|
| Frontend     | React, Tailwind CSS, Axios, React Router DOM, React Icons |
| Backend      | Node.js, Express.js, Mongoose, JWT, Cors, Body-Parser |
| Database     | MongoDB                   |
| AI Model     | Gemini AI                 |
| Charts       | Chart.js / React Chart.js 2 |
| Deployment   | Frontend: Vercel, Backend: Render |

---

## ⚡ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/quickblog-ai.git
cd quickblog-ai
```
### 2. Backend Setup
```cd backend
npm install
```

### 3.Create a .env file with the following variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the backend server:
```npm start
```
### 4. Frontend Setup
```
cd ../frontend
npm install
npm start
```

## 📝 Usage

* Sign Up / Log In to the application.

* Navigate to the Dashboard.

* Home: View statistics, recent blogs, and category-based charts.

* Write Blog: Input blog details (title, subtitle, category) to generate AI content or write manually.

* All Blogs: Manage, publish/unpublish, edit, or delete your blogs.

* Profile: Update personal information and profile image.

## 🖼 Screenshots

Landing Page

<img width="1916" height="972" alt="image" src="https://github.com/user-attachments/assets/c9098ff9-23bb-49b2-91e9-41198b6d3b6b" />


Dashboard Home
<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/758e058f-e283-4f98-b28a-cfb46852b743" />



Write Blog Section

<img width="1913" height="979" alt="image" src="https://github.com/user-attachments/assets/8dbbc245-8ba5-49fa-bce0-586a8bcaa582" />



All Blogs Section

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/2ca552ac-90be-4f1a-8072-b27d474174e1" />


Profile Section

<img width="1917" height="980" alt="image" src="https://github.com/user-attachments/assets/70716d5c-6a0b-4bc0-99cd-4d1029c2e76f" />



## 📚 Libraries & Tools Used

Frontend: React, Tailwind CSS, Axios, React Icons, React Router DOM
Backend: Node.js, Express, Mongoose, JWT, Cors, Body-Parser
AI Integration: Gemini AI
Charts: Chart.js / React Chart.js 2

## 🚀 Deployment

Frontend: Deployed on Vercel

Backend: Deployed on Render

Live App: https://drive.google.com/file/d/1haTQBpTlIVFxsk6iuYaMf1yEQX9T_Yns/view?usp=sharing
