# 👨‍👩‍👧‍👦 FamilySpace

A modern, feature-rich family management application built with Nuxt 3, Vue 3, and Firebase. Keep your family connected, organized, and engaged with shared calendars, lists, messaging, and more.

![Nuxt](https://img.shields.io/badge/Nuxt-4.0-00DC82?style=flat&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.0-FFCA28?style=flat&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### 🏠 **Dashboard**
- Personalized family homepage with quick stats
- Upcoming events and birthday reminders
- Recent family conversations
- Family member overview with roles

### 📅 **Shared Calendar**
- Interactive month-view calendar powered by FullCalendar
- Create and manage family events
- RSVP system with yes/no/maybe responses
- Multi-family support for extended families

### 📝 **Shared Lists**
- Shopping and to-do lists with real-time sync
- Item completion tracking with progress bars
- Color-coded lists with custom icons
- Collaborative list management

### 💬 **Family Messaging**
- Direct messaging between family members
- Unread message notifications
- Family-scoped conversations
- Real-time message delivery

### 📰 **Family Feed**
- Share moments and updates
- Like and comment on posts
- Photo sharing capabilities
- Family timeline view

### ⏰ **Time Capsules**
- Create scheduled messages for the future
- Private capsule delivery system
- Birthday and milestone messages
- Recipient-specific capsules

### 👥 **Family Management**
- Multi-family support
- Role-based permissions (admin/member)
- Family invitations via secure links
- Join request system

### 🎯 **Additional Features**
- User profiles with customization
- Privacy controls
- Mobile-responsive design with optimized navigation
- Dark mode support
- Comprehensive help and support pages

## 🛠️ Tech Stack

- **Frontend Framework**: Nuxt 3 (Vue 3)
- **Styling**: TailwindCSS with custom components
- **State Management**: Pinia
- **Backend/Database**: Firebase (Firestore, Authentication)
- **Calendar**: FullCalendar
- **Icons**: Font Awesome
- **Routing**: Vue Router

## 📋 Prerequisites

- Node.js 18+ or Bun
- Firebase project with Firestore and Authentication enabled
- npm, pnpm, yarn, or bun package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd family-app
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### 3. Firebase Configuration

Create a Firebase project at [Firebase Console](https://console.firebase.google.com/) and enable:
- Firestore Database
- Authentication (Email/Password)

Create a `plugins/firebase.js` file with your Firebase configuration:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      firestore: db,
      auth: auth
    }
  };
});
```

### 4. Deploy Firestore Rules

Deploy the security rules from `Firestore.rules` to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🗂️ Project Structure

```
family-app/
├── assets/              # Static assets
├── components/          # Vue components
│   ├── calendar/       # Calendar-specific components
│   ├── dashboard/      # Dashboard widgets
│   ├── lists/          # List management components
│   └── ...
├── composables/        # Vue composables
├── layouts/            # Layout components
├── middleware/         # Route middleware
├── pages/              # Application pages
│   ├── calendar.vue
│   ├── dashboard.vue
│   ├── lists.vue
│   ├── messages/
│   └── ...
├── plugins/            # Nuxt plugins
├── public/             # Public static files
├── stores/             # Pinia stores
│   ├── auth.ts
│   └── lists.ts
├── utils/              # Utility functions
├── Firestore.rules     # Firebase security rules
└── nuxt.config.ts      # Nuxt configuration
```

## 🔐 Security

The application implements comprehensive Firestore security rules including:
- Family-scoped data access
- Role-based permissions (admin/member)
- User authentication requirements
- Data validation rules
- Privacy controls

## 🎨 Design Philosophy

FamilySpace follows modern UI/UX best practices:
- **Glassmorphism**: Frosted glass effects for depth
- **Gradient Accents**: Vibrant color schemes
- **Micro-interactions**: Smooth animations and transitions
- **Mobile-First**: Responsive design with optimized mobile navigation
- **Accessibility**: Clear typography and intuitive layouts

## 📱 Mobile Navigation

The app features a sophisticated mobile navigation system:
- **Primary Navigation**: Home, Calendar, Lists, Chat (bottom bar)
- **Secondary Navigation**: More menu with Feed, Family, Capsules, Profile, Support
- **Adaptive Design**: Different layouts for mobile and desktop

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support, please visit the in-app Support page or contact the development team.

---

**Built with ❤️ for families**
