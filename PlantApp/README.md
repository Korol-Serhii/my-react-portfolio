# 🌱 PlantApp - Plant Store

Modern mobile app for buying plants with a beautiful interface and full functionality.

![PlantApp Screenshot](./Foto.png)

## ✨ Features

- 🏠 **Home page** with plant catalog
- 🔍 **Search and filtering** by categories, price, and sorting
- ❤️ **Favorite plants** - save selected items
- 🛒 **Shopping cart** with ability to change item quantities
- 👤 **User profile** with settings
- 🔐 **Authentication** (simulated)

## 🚀 Quick Start

### Installing Dependencies

```bash
npm install
```

### Running the Project

```bash
npm run dev
```

The project will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🛠️ Technologies

- **React 18** - UI library
- **Vite** - build tool
- **Tailwind CSS** - styling
- **Lucide React** - icons

## 📱 Functionality

### Home Page
- Browse plants with horizontal scrolling
- Filter by categories
- Search by name
- Add to favorites
- Add to cart

### Shopping Cart
- View items in cart
- Change item quantities
- Calculate total amount
- Calculate delivery

### Favorites
- View saved plants
- Remove from favorites
- Quick add to cart

### Profile
- View user information
- Profile settings
- Log out

## 📝 Notes

- Data is stored in component state (not persistent)
- Authentication is simulated (user is logged in by default)
- Plant images are loaded from Unsplash

## 📄 License

MIT
