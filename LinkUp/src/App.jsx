import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  UserPlus,
  UserMinus,
  Check,
  X,
  Trash2
} from 'lucide-react';
import { 
  initDatabase, 
  getCurrentUser, 
  getAllUsers, 
  getAllChats, 
  getChatMessages, 
  addMessage, 
  updateUnreadCount,
  getUserById,
  saveDatabase,
  registerUser,
  createChat,
  chatExists,
  deleteChat
} from './db/database';
import { translations, getTranslation } from './utils/translations';

// --- COMPONENTS ---

const Avatar = ({ src, status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    idle: 'bg-yellow-500'
  };

  return (
    <div className="relative inline-block">
      <img 
        src={src} 
        alt="Avatar" 
        className={`${sizeClasses[size]} rounded-full border-2 border-white object-cover bg-gray-200`}
      />
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`}></span>
      )}
    </div>
  );
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, theme = 'light' }) => {
  const variants = {
    primary: 'bg-[#0088cc] hover:bg-[#0077b3] text-white',
    secondary: theme === 'dark' 
      ? 'bg-[#242f3d] hover:bg-[#2b3642] text-white' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    ghost: theme === 'dark'
      ? 'hover:bg-[#242f3d] text-gray-400 hover:text-white'
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

const Input = ({ placeholder, value, onChange, onKeyDown, type = 'text', className = '', theme = 'light' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={`w-full px-4 py-3 rounded-lg border focus:border-[#0088cc] focus:outline-none transition-colors ${
      theme === 'dark'
        ? 'bg-[#242f3d] text-white border-[#2b3642] placeholder-gray-500'
        : 'bg-white text-gray-900 border-gray-300 placeholder-gray-400'
    } ${className}`}
  />
);

// --- SCREENS ---

const LoginScreen = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    setLoading(true);
    
    // Register user
    try {
      registerUser(name, email);
      setTimeout(() => {
        onLogin();
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0088cc] rounded-full mx-auto mb-4 flex items-center justify-center">
            <MessageSquare className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegister ? 'Створіть акаунт' : 'З поверненням'}
          </h1>
          <p className="text-gray-600">
            {isRegister ? 'Зареєструйтеся у LinkUp' : 'Увійдіть у LinkUp'}
          </p>
        </div>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700 text-sm mb-2 ml-1 font-medium">Ім'я</label>
              <Input 
                placeholder="Ваше ім'я" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                theme="light"
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700 text-sm mb-2 ml-1 font-medium">Email</label>
            <Input 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              theme="light"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-2 ml-1 font-medium">Пароль</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              theme="light"
            />
          </div>
          <Button className="w-full py-3 mt-4" disabled={loading} theme="light">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (isRegister ? 'Зареєструватись' : 'Увійти')}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-gray-600 text-sm">
          {isRegister ? (
            <>
              Вже є акаунт?{' '}
              <span 
                className="text-[#0088cc] cursor-pointer hover:underline font-medium"
                onClick={() => setIsRegister(false)}
              >
                Увійти
              </span>
            </>
          ) : (
            <>
              Немає акаунту?{' '}
              <span 
                className="text-[#0088cc] cursor-pointer hover:underline font-medium"
                onClick={() => setIsRegister(true)}
              >
                Зареєструватись
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

// Helper Component for Sidebar Icons
function SidebarIcon({ icon, isActive, onClick, tooltip, theme = 'light' }) {
  return (
    <div className="relative group w-full flex justify-center">
      {isActive && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0088cc] rounded-l-full" />
      )}
      <button 
        onClick={onClick}
        className={`
          p-3 rounded-lg transition-all duration-300 relative
          ${isActive 
            ? 'bg-[#0088cc] text-white shadow-md' 
            : theme === 'dark'
              ? 'text-gray-400 hover:text-[#0088cc] hover:bg-[#242f3d]'
              : 'text-gray-600 hover:text-[#0088cc] hover:bg-gray-100'
          }
        `}
      >
        {icon}
      </button>
      
      {/* Tooltip */}
      <div className={`absolute left-14 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'bg-[#242f3d] text-white' : 'bg-gray-900 text-white'} text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none font-medium shadow-lg`}>
        {tooltip}
      </div>
    </div>
  );
}

// --- MAIN APP ---

export default function App() {
  // Check if there is a saved login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('linkup_logged_in') === 'true';
  });
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [inputText, setInputText] = useState('');
  const [dbInitialized, setDbInitialized] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem('linkup_language') || 'uk');
  const [theme, setTheme] = useState(localStorage.getItem('linkup_theme') || 'light');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const messagesEndRef = useRef(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('linkup_theme', theme);
  }, [theme]);

  // Login and logout functions
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('linkup_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('linkup_logged_in');
    setSelectedChatId(null);
    setMessages({});
  };

  // Initialize database
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        await initDatabase();
        const currentUserData = getCurrentUser();
        const usersData = getAllUsers();
        const chatsData = getAllChats();
        
        setCurrentUser(currentUserData);
        setUsers(usersData);
        setChats(chatsData);
        setDbInitialized(true);
        
        // If there is a current user in DB or saved login state, automatically log in
        const savedLoginState = localStorage.getItem('linkup_logged_in') === 'true';
        if ((currentUserData || savedLoginState) && !isLoggedIn) {
          setIsLoggedIn(true);
          localStorage.setItem('linkup_logged_in', 'true');
        } else if (!currentUserData && !savedLoginState) {
          // If there is no user and no saved state, log out
          setIsLoggedIn(false);
          localStorage.removeItem('linkup_logged_in');
        }
      } catch (error) {
        console.error('Database loading error:', error);
      }
    };

    loadDatabase();
  }, []);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChatId && dbInitialized) {
      const chatMessages = getChatMessages(selectedChatId);
      setMessages({ [selectedChatId]: chatMessages });
      
      // Clear unread messages
      updateUnreadCount(selectedChatId, 0);
      const updatedChats = getAllChats();
      setChats(updatedChats);
    }
  }, [selectedChatId, dbInitialized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatId]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedChatId || !dbInitialized) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add message to database
    const newMessage = addMessage(selectedChatId, 'me', inputText, time);
    
    // Update state
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    // Update chats list
    const updatedChats = getAllChats();
    setChats(updatedChats);

    setInputText('');
    
    // Simulate reply
    setTimeout(() => {
      const chat = chats.find(c => c.id === selectedChatId);
      if (chat) {
        const replyMessage = addMessage(
          selectedChatId, 
          chat.userId, 
          'Це автоматична відповідь (demo).',
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
        
        setMessages(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), replyMessage]
        }));
        
        const updatedChatsAfterReply = getAllChats();
        setChats(updatedChatsAfterReply);
      }
    }, 2000);
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;
  if (!dbInitialized) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0088cc] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const activeChat = selectedChatId ? chats.find(c => c.id === selectedChatId) : null;
  const activeChatUser = activeChat ? getUserById(activeChat.userId) : null;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('linkup_language', lang);
    setShowLanguageModal(false);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('linkup_theme', newTheme);
    setShowThemeModal(false);
  };

  const handleAddFriend = (userId) => {
    if (!dbInitialized) return;
    
    // Always check current state from database
    const currentChats = getAllChats();
    const existingChat = currentChats.find(c => c.userId === userId);
    
    if (existingChat) {
      // If chat already exists, just navigate to it
      setSelectedChatId(existingChat.id);
      setActiveTab('chats');
      return;
    }
    
    // Create new chat
    const newChat = createChat(userId);
    if (newChat) {
      // Update chats list from database
      const updatedChats = getAllChats();
      setChats(updatedChats);
      
      // Navigate to new chat
      setSelectedChatId(newChat.id);
      setActiveTab('chats');
    }
  };

  const handleRemoveFriendClick = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (!dbInitialized || !userToDelete) return;
    
    const { id: userId } = userToDelete;
    
    // Delete chat
    const deleted = deleteChat(userId);
    
    if (deleted) {
      // Update chats list
      const updatedChats = getAllChats();
      setChats(updatedChats);
      
      // If deleted chat was open, close it
      const deletedChat = chats.find(c => c.userId === userId);
      if (deletedChat && selectedChatId === deletedChat.id) {
        setSelectedChatId(null);
      }
      
      // Clear messages for deleted chat
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[deletedChat?.id];
        return newMessages;
      });
    }
    
    // Close modal window
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setUserToDelete(null);
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-[#0e1621] text-white' : 'bg-gray-100 text-gray-900'} font-sans overflow-hidden`}>
      {/* --- SIDEBAR --- */}
      <div className={`w-20 ${theme === 'dark' ? 'bg-[#17212b] border-[#242f3d]' : 'bg-white border-gray-200'} border-r flex flex-col items-center py-6 flex-shrink-0 z-20`}>
        <div className="w-10 h-10 bg-[#0088cc] rounded-lg flex items-center justify-center mb-8 shadow-md">
          <MessageSquare className="text-white w-6 h-6" />
        </div>

        <nav className="flex-1 flex flex-col gap-6 w-full px-2">
          <SidebarIcon 
            icon={<Users size={24} />} 
            isActive={activeTab === 'users'} 
            onClick={() => { setActiveTab('users'); setSelectedChatId(null); }}
            tooltip={getTranslation('friends', language)}
            theme={theme}
          />
          <SidebarIcon 
            icon={<MessageSquare size={24} />} 
            isActive={activeTab === 'chats'} 
            onClick={() => setActiveTab('chats')}
            tooltip={getTranslation('chats', language)}
            theme={theme}
          />
          <SidebarIcon 
            icon={<Settings size={24} />} 
            isActive={activeTab === 'settings'} 
            onClick={() => { setActiveTab('settings'); setSelectedChatId(null); }}
            tooltip={getTranslation('settings', language)}
            theme={theme}
          />
        </nav>

        <SidebarIcon 
          icon={<LogOut size={24} />} 
          onClick={handleLogout}
          tooltip={getTranslation('logout', language)}
          theme={theme}
        />
      </div>

      {/* --- SECONDARY SIDEBAR (LISTS) --- */}
      <div className={`w-80 ${theme === 'dark' ? 'bg-[#17212b] border-[#242f3d]' : 'bg-white border-gray-200'} border-r flex flex-col flex-shrink-0`}>
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-[#242f3d]' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {activeTab === 'chats' && getTranslation('messages', language)}
            {activeTab === 'users' && getTranslation('users', language)}
            {activeTab === 'settings' && getTranslation('settings', language)}
          </h2>
          {activeTab !== 'settings' && (
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} w-4 h-4`} />
              <input 
                type="text" 
                placeholder={getTranslation('search', language)} 
                className={`w-full ${theme === 'dark' ? 'bg-[#242f3d] text-white placeholder-gray-500 focus:bg-[#2b3642]' : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-white'} text-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0088cc] transition-all`}
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-hide">
          {activeTab === 'chats' && chats.map(chat => {
            const user = getUserById(chat.userId);
            if (!user) return null;
            
            return (
              <div 
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex gap-3 items-center ${
                  selectedChatId === chat.id 
                    ? theme === 'dark'
                      ? 'bg-[#0088cc]/20 border-l-2 border-[#0088cc]'
                      : 'bg-[#e7f3ff] border-l-2 border-[#0088cc]'
                    : theme === 'dark'
                      ? 'hover:bg-[#242f3d]'
                      : 'hover:bg-gray-50'
                }`}
              >
                <Avatar src={user.avatar} status={user.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{chat.timestamp}</span>
                  </div>
                  <p className={`text-sm truncate ${
                    chat.unread > 0 
                      ? theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {chat.lastMessage || getTranslation('noMessages', language) || 'Немає повідомлень'}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-[#0088cc] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                    {chat.unread}
                  </div>
                )}
              </div>
            );
          })}

          {activeTab === 'users' && users.map(user => {
            // Check current chats state
            const hasChat = chats.some(c => c.userId === user.id);
            return (
              <div key={user.id} className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
                theme === 'dark'
                  ? 'bg-[#242f3d] hover:bg-[#2b3642]'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} status={user.status} />
                  <div>
                    <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</h3>
                    <span className={`text-xs capitalize ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {hasChat ? (
                    <>
                      <button 
                        onClick={() => {
                          const existingChat = chats.find(c => c.userId === user.id);
                          if (existingChat) {
                            setSelectedChatId(existingChat.id);
                            setActiveTab('chats');
                          }
                        }}
                        className={`p-2 hover:bg-[#0088cc]/10 hover:text-[#0088cc] rounded-lg transition-colors text-[#0088cc]`}
                        title={getTranslation('openChat', language) || 'Відкрити чат'}
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFriendClick(user.id, user.name);
                        }}
                        className={`p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                        title={getTranslation('removeFriend', language) || 'Видалити з друзів'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleAddFriend(user.id)}
                      className={`p-2 hover:bg-[#0088cc]/10 hover:text-[#0088cc] rounded-lg transition-colors ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      title={getTranslation('addFriend', language) || 'Додати в друзі'}
                    >
                      <UserPlus size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {activeTab === 'settings' && currentUser && (
            <div className="space-y-6 px-2">
              <div className={`flex flex-col items-center p-4 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-[#242f3d] border-[#2b3642]'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <Avatar src={currentUser.avatar} size="xl" />
                <h3 className={`mt-3 text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{currentUser.email}</p>
                <Button variant="ghost" className="mt-2 text-sm" theme={theme}>{getTranslation('edit', language)}</Button>
              </div>

              <div className="space-y-1">
                <p className={`px-2 text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{getTranslation('app', language)}</p>
                
                {/* Notifications */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#242f3d]'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => alert(getTranslation('notifications', language) + ' - Feature in development')}
                >
                  <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTranslation('notifications', language)}</span>
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>›</span>
                </div>
                
                {/* Privacy */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#242f3d]'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => alert(getTranslation('privacy', language) + ' - Feature in development')}
                >
                  <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTranslation('privacy', language)}</span>
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>›</span>
                </div>
                
                {/* Language */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#242f3d]'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setShowLanguageModal(true)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTranslation('language', language)}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({language === 'uk' ? getTranslation('ukrainian', language) : getTranslation('english', language)})
                    </span>
                  </div>
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>›</span>
                </div>
                
                {/* Theme */}
                <div 
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#242f3d]'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setShowThemeModal(true)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTranslation('theme', language)}</span>
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({theme === 'light' ? getTranslation('light', language) : getTranslation('dark', language)})
                    </span>
                  </div>
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>›</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className={`flex-1 flex flex-col min-w-0 ${theme === 'dark' ? 'bg-[#0e1621]' : 'bg-white'}`}>
        {selectedChatId && activeTab === 'chats' ? (
          <>
            {/* Chat Header */}
            <div className={`h-16 border-b flex items-center justify-between px-6 ${
              theme === 'dark'
                ? 'bg-[#17212b] border-[#242f3d]'
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <Avatar src={activeChatUser.avatar} status={activeChatUser.status} />
                <div>
                  <h2 className={`font-semibold text-base leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{activeChatUser.name}</h2>
                  <p className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activeChatUser.status === 'online' ? getTranslation('online', language) : getTranslation('recently', language)}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" className="p-2 rounded-full" theme={theme}><Phone size={18} /></Button>
                <Button variant="ghost" className="p-2 rounded-full" theme={theme}><Video size={18} /></Button>
                <Button variant="ghost" className="p-2 rounded-full" theme={theme}><MoreVertical size={18} /></Button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              className={`flex-1 overflow-y-auto p-4 space-y-2 ${
                theme === 'dark'
                  ? 'bg-[#0e1621]'
                  : 'bg-[#e5ddd5] bg-opacity-30'
              }`}
              style={theme === 'light' ? {backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'} : {}}
            >
              {messages[selectedChatId]?.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                    <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`
                        px-3 py-2 rounded-lg text-sm relative shadow-sm
                        ${isMe 
                          ? theme === 'dark'
                            ? 'bg-[#182533] text-white rounded-br-sm'
                            : 'bg-[#dcf8c6] text-gray-900 rounded-br-sm'
                          : theme === 'dark'
                            ? 'bg-[#242f3d] text-white rounded-bl-sm'
                            : 'bg-white text-gray-900 rounded-bl-sm'
                        }
                      `} style={{boxShadow: theme === 'dark' ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.1)'}}>
                        {msg.text}
                      </div>
                      <span className={`text-[10px] mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${
              theme === 'dark'
                ? 'bg-[#17212b] border-[#242f3d]'
                : 'bg-white border-gray-200'
            }`}>
              <div className="max-w-4xl mx-auto flex gap-2 items-end">
                <div className="flex-1 relative">
                  <Input 
                    placeholder={getTranslation('writeMessage', language)} 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-12"
                    theme={theme}
                  />
                  <div className={`absolute right-3 bottom-3 flex gap-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    {/* Icons like emoji could go here */}
                  </div>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  className={`h-[44px] w-[44px] !p-0 rounded-full flex-shrink-0 ${!inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  theme={theme}
                >
                  <Send size={18} className={inputText.trim() ? "translate-x-0.5" : ""} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center ${
            theme === 'dark'
              ? 'text-gray-400 bg-[#0e1621]'
              : 'text-gray-400 bg-[#e5ddd5] bg-opacity-30'
          }`} style={theme === 'light' ? {backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'} : {}}>
            <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-[#242f3d]' : 'bg-gray-200'} rounded-full flex items-center justify-center mb-4`}>
              <MessageSquare size={32} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{getTranslation('selectChat', language)}</h3>
            <p className={`max-w-xs text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{getTranslation('selectChatDesc', language)}</p>
          </div>
        )}
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLanguageModal(false)}>
          <div className={`${theme === 'dark' ? 'bg-[#17212b]' : 'bg-white'} rounded-2xl p-6 w-full max-w-md mx-4`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTranslation('language', language)}</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleLanguageChange('uk')}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  language === 'uk' 
                    ? 'bg-[#0088cc] text-white' 
                    : theme === 'dark' 
                      ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{getTranslation('ukrainian', language)}</div>
                {language === 'uk' && <Check className="inline ml-2" size={18} />}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  language === 'en' 
                    ? 'bg-[#0088cc] text-white' 
                    : theme === 'dark' 
                      ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{getTranslation('english', language)}</div>
                {language === 'en' && <Check className="inline ml-2" size={18} />}
              </button>
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className={`mt-4 w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} transition-colors`}
            >
              {getTranslation('close', language) || 'Закрити'}
            </button>
          </div>
        </div>
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowThemeModal(false)}>
          <div className={`${theme === 'dark' ? 'bg-[#17212b]' : 'bg-white'} rounded-2xl p-6 w-full max-w-md mx-4`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{getTranslation('theme', language)}</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  theme === 'light' 
                    ? 'bg-[#0088cc] text-white' 
                    : theme === 'dark' 
                      ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{getTranslation('light', language)}</div>
                {theme === 'light' && <Check className="inline ml-2" size={18} />}
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#0088cc] text-white' 
                    : theme === 'dark' 
                      ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div className="font-semibold">{getTranslation('dark', language)}</div>
                {theme === 'dark' && <Check className="inline ml-2" size={18} />}
              </button>
            </div>
            <button
              onClick={() => setShowThemeModal(false)}
              className={`mt-4 w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} transition-colors`}
            >
              {getTranslation('close', language) || 'Закрити'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleCancelDelete}>
          <div className={`${theme === 'dark' ? 'bg-[#17212b]' : 'bg-white'} rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl`} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {getTranslation('removeFriend', language)}
                </h3>
              </div>
            </div>
            
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'uk' 
                ? `Ви впевнені, що хочете видалити ${userToDelete.name} з друзів? Це також видалить всі повідомлення з цим користувачем.`
                : `Are you sure you want to remove ${userToDelete.name} from friends? This will also delete all messages with this user.`
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  theme === 'dark' 
                    ? 'bg-[#242f3d] text-white hover:bg-[#2b3642]' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {getTranslation('cancel', language) || 'Скасувати'}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {getTranslation('delete', language) || 'Видалити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
