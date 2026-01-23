// Translations
export const translations = {
  uk: {
    // General
    welcome: 'З поверненням',
    login: 'Увійти',
    register: 'Зареєструватись',
    name: "Ім'я",
    email: 'Email',
    password: 'Пароль',
    createAccount: 'Створити акаунт',
    alreadyHaveAccount: 'Вже є акаунт?',
    noAccount: 'Немає акаунту?',
    
    // Navigation
    chats: 'Чати',
    messages: 'Повідомлення',
    users: 'Користувачі',
    friends: 'Друзі',
    settings: 'Налаштування',
    logout: 'Вийти',
    
    // Settings
    notifications: 'Сповіщення',
    privacy: 'Конфіденційність',
    language: 'Мова',
    theme: 'Тема',
    edit: 'Редагувати',
    app: 'Додаток',
    
    // Themes
    light: 'Світла',
    dark: 'Темна',
    
    // Languages
    ukrainian: 'Українська',
    english: 'Англійська',
    
    // Chat
    selectChat: 'Оберіть чат',
    selectChatDesc: 'Виберіть користувача зі списку зліва, щоб почати спілкування',
    writeMessage: 'Напишіть повідомлення...',
    online: 'В мережі',
    recently: 'Був(ла) недавно',
    search: 'Пошук...',
    noMessages: 'Немає повідомлень',
    
    // Statuses
    statusOnline: 'online',
    statusOffline: 'offline',
    statusIdle: 'idle',
    
    // General
    close: 'Закрити',
    addFriend: 'Додати в друзі',
    openChat: 'Відкрити чат',
    friendAdded: 'Користувача додано в друзі',
    removeFriend: 'Видалити з друзів',
    removeFriendConfirm: 'Ви впевнені, що хочете видалити {name} з друзів? Це також видалить всі повідомлення.',
    cancel: 'Скасувати',
    delete: 'Видалити'
  },
  en: {
    // General
    welcome: 'Welcome back',
    login: 'Login',
    register: 'Register',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    createAccount: 'Create account',
    alreadyHaveAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    
    // Navigation
    chats: 'Chats',
    messages: 'Messages',
    users: 'Users',
    friends: 'Friends',
    settings: 'Settings',
    logout: 'Logout',
    
    // Settings
    notifications: 'Notifications',
    privacy: 'Privacy',
    language: 'Language',
    theme: 'Theme',
    edit: 'Edit',
    app: 'App',
    
    // Themes
    light: 'Light',
    dark: 'Dark',
    
    // Languages
    ukrainian: 'Ukrainian',
    english: 'English',
    
    // Chat
    selectChat: 'Select chat',
    selectChatDesc: 'Select a user from the list on the left to start chatting',
    writeMessage: 'Write a message...',
    online: 'Online',
    recently: 'Recently',
    search: 'Search...',
    noMessages: 'No messages',
    
    // Statuses
    statusOnline: 'online',
    statusOffline: 'offline',
    statusIdle: 'idle',
    
    // General
    close: 'Close',
    addFriend: 'Add friend',
    openChat: 'Open chat',
    friendAdded: 'User added to friends',
    removeFriend: 'Remove friend',
    removeFriendConfirm: 'Are you sure you want to remove {name} from friends? This will also delete all messages.',
    cancel: 'Cancel',
    delete: 'Delete'
  }
};

// Function to get translation
export function getTranslation(key, lang = 'uk') {
  const langTranslations = translations[lang] || translations.uk;
  return langTranslations[key] || key;
}
