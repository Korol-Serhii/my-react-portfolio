import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, ShoppingBag, Heart, Home, User, 
  ArrowRight, Menu, Minus, Plus, CreditCard, Settings, 
  LogOut, MapPin, Bell, ChevronRight, X, Mail, Lock
} from 'lucide-react';

// --- MOCK DATABASE (MOCK DB) ---
const INITIAL_DB = {
  users: [
    {
      id: 1,
      name: 'Олена Петренко',
      email: 'olena.p@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60',
      address: 'Київ, вул. Хрещатик, 1'
    }
  ],
  plants: [
    {
      id: 1,
      name: 'Сукулент',
      category: 'Кімнатні',
      price: 25,
      image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      description: 'Невибаглива рослина, ідеальна для новачків.'
    },
    {
      id: 2,
      name: 'Драцена',
      category: 'Кімнатні',
      price: 45,
      image: 'https://images.unsplash.com/photo-1596547609858-69df6d3890a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      description: 'Елегантна рослина з довгим листям.'
    },
    {
      id: 3,
      name: 'Монстера',
      category: 'Тропічні',
      price: 30,
      image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      description: 'Популярна тропічна рослина з великим листям.'
    },
    {
      id: 4,
      name: 'Алое Вера',
      category: 'Лікувальні',
      price: 18,
      image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      description: 'Відома своїми лікувальними властивостями.'
    },
    {
      id: 5,
      name: 'Кактус',
      category: 'Вуличні',
      price: 12,
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f9bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      description: 'Стійкий до засухи та сонця.'
    },
    {
      id: 6,
      name: 'Фікус Лірата',
      category: 'Тропічні',
      price: 55,
      image: 'https://images.unsplash.com/photo-1612479633808-1c4b4ce6d2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      description: 'Велике листя у формі скрипки.'
    }
  ],
  cart: [],
  favorites: []
};

const CATEGORIES = ['Рекомендовані', 'Кімнатні', 'Вуличні', 'Садові', 'Тропічні'];

// --- HELPER COMPONENTS ---

const NavButton = ({ icon: Icon, isActive, onClick, badge, isCount }) => (
  <button 
    onClick={onClick}
    className={`relative transition-all duration-300 flex flex-col items-center gap-1 ${isActive ? 'text-green-500 -translate-y-1' : 'hover:text-gray-500'}`}
  >
     <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
     {isActive && <span className="w-1 h-1 bg-green-500 rounded-full" />}
     {badge && !isCount && badge !== 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
     {isCount && badge > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">{badge}</span>}
  </button>
);

const MenuLink = ({ icon: Icon, label, onClick, active, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${active ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="flex-1 text-left font-medium">{label}</span>
    {badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const ProfileMenuItem = ({ icon: Icon, label, sub, badge, isDanger, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition ${isDanger ? 'text-red-500' : 'text-gray-700'}`}
  >
    <div className={`p-2 rounded-xl ${isDanger ? 'bg-red-50' : 'bg-green-50'}`}>
      <Icon className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-green-600'}`} />
    </div>
    <div className="flex-1 text-left">
      <div className="font-semibold">{label}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
    {badge && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{badge}</span>}
    {!badge && !isDanger && <ChevronRight className="w-4 h-4 text-gray-300" />}
  </button>
);

// --- MAIN COMPONENT ---

export default function App() {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [activeNav, setActiveNav] = useState('Home');
  const [currentUser] = useState(INITIAL_DB.users[0]);
  const [plants] = useState(INITIAL_DB.plants);
  const [cartItems, setCartItems] = useState(INITIAL_DB.cart);
  const [favorites, setFavorites] = useState(INITIAL_DB.favorites);
  
  const [activeCategory, setActiveCategory] = useState('Рекомендовані');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter State
  const [sortOrder, setSortOrder] = useState('default'); // 'default', 'asc', 'desc'
  const [priceRange, setPriceRange] = useState(100);

  // --- LOGIC ---

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveNav('Home');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const isLiked = (id) => favorites.some(fav => fav.plantId === id);

  const toggleLike = (id) => {
    if (isLiked(id)) {
      setFavorites(prev => prev.filter(fav => fav.plantId !== id));
    } else {
      setFavorites(prev => [...prev, { plantId: id }]);
    }
  };

  const addToCart = (plant) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.plantId === plant.id);
      if (existing) {
        return prev.map(item => 
          item.plantId === plant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { plantId: plant.id, quantity: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.plantId === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const plant = plants.find(p => p.id === item.plantId);
      return total + (plant ? plant.price * item.quantity : 0);
    }, 0);
  };

  // --- RENDER FUNCTIONS ---

  const renderLoginScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white h-full relative z-40">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Home className="w-12 h-12 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">З поверненням!</h1>
      <p className="text-gray-400 mb-8 text-center">Увійдіть у свій обліковий запис</p>
      
      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
          <Mail className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="email" 
            placeholder="Email"
            defaultValue="olena.p@example.com"
            className="bg-transparent border-none outline-none text-gray-700 w-full"
            required 
          />
        </div>
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
          <Lock className="w-5 h-5 text-gray-400 mr-3" />
          <input 
            type="password" 
            placeholder="Пароль"
            defaultValue="password"
            className="bg-transparent border-none outline-none text-gray-700 w-full"
            required 
          />
        </div>
        
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 transition mt-4">
          Увійти
        </button>
      </form>
      
      <p className="mt-8 text-gray-400 text-sm">
        Немає акаунту? <span className="text-green-500 font-bold cursor-pointer">Зареєструватися</span>
      </p>
    </div>
  );

  const renderSideMenu = () => (
    <div className={`absolute inset-0 z-50 overflow-hidden pointer-events-none ${isMenuOpen ? 'pointer-events-auto' : ''}`}>
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={() => setIsMenuOpen(false)}
      ></div>
      <div className={`relative bg-white w-3/4 h-full p-6 shadow-2xl flex flex-col transform transition-transform duration-300 pointer-events-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsMenuOpen(false)} className="self-end p-2 bg-gray-100 rounded-full mb-6 hover:bg-gray-200">
          <X className="w-6 h-6 text-gray-800" />
        </button>
        
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
          <img src={currentUser.avatar} alt="Profile" className="w-14 h-14 rounded-full border-2 border-green-500" />
          <div>
            <h3 className="font-bold text-gray-800">{currentUser.name}</h3>
            <p className="text-xs text-gray-400">Premium Member</p>
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <MenuLink icon={Home} label="Головна" onClick={() => { setActiveNav('Home'); setIsMenuOpen(false); }} active={activeNav === 'Home'} />
          <MenuLink icon={ShoppingBag} label="Кошик" onClick={() => { setActiveNav('Cart'); setIsMenuOpen(false); }} active={activeNav === 'Cart'} />
          <MenuLink icon={Heart} label="Улюблене" onClick={() => { setActiveNav('Favorites'); setIsMenuOpen(false); }} active={activeNav === 'Favorites'} />
          <MenuLink icon={Settings} label="Налаштування" />
          <MenuLink icon={Bell} label="Сповіщення" badge="2" />
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-semibold p-3 hover:bg-red-50 rounded-xl transition mt-auto">
          <LogOut className="w-5 h-5" />
          Вийти
        </button>
      </div>
    </div>
  );

  const renderFilterModal = () => (
    <div className={`absolute inset-0 z-50 flex items-end justify-center pointer-events-none`}>
      {/* Backdrop - Fixed pointer-events */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsFilterOpen(false)}
      ></div>
      
      {/* Panel */}
      <div className={`bg-white w-full rounded-t-3xl p-6 transform transition-transform duration-300 pointer-events-auto shadow-2xl ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Фільтри</h2>
          <button onClick={() => { setSortOrder('default'); setPriceRange(100); }} className="text-sm text-green-500 font-semibold">
            Скинути
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Сортування</h3>
          <div className="flex gap-3">
             <button 
               onClick={() => setSortOrder('asc')}
               className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition ${sortOrder === 'asc' ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600'}`}
             >
               Дешевші
             </button>
             <button 
               onClick={() => setSortOrder('desc')}
               className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition ${sortOrder === 'desc' ? 'bg-green-500 text-white border-green-500' : 'border-gray-200 text-gray-600'}`}
             >
               Дорожчі
             </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Ціна (макс.)</h3>
            <span className="font-bold text-gray-800 text-lg">${priceRange}</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="5"
            value={priceRange} 
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        <button 
          onClick={() => setIsFilterOpen(false)}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-black transition"
        >
          Застосувати
        </button>
      </div>
    </div>
  );

  const renderHome = () => {
    let filteredPlants = plants.filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Рекомендовані' ? true : plant.category === activeCategory;
      const matchesPrice = plant.price <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortOrder === 'asc') {
      filteredPlants.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      filteredPlants.sort((a, b) => b.price - a.price);
    }

    return (
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
        <div className="flex overflow-x-auto px-6 pb-4 gap-6 scrollbar-hide mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap pb-2 text-sm font-semibold transition-colors relative
                ${activeCategory === cat ? 'text-green-500' : 'text-gray-300 hover:text-gray-400'}`}
            >
              {cat.toUpperCase()}
              {activeCategory === cat && <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-full" />}
            </button>
          ))}
        </div>

        <div className="flex overflow-x-auto px-6 gap-6 pb-8 pt-2 scrollbar-hide snap-x">
          {filteredPlants.length > 0 ? filteredPlants.map((plant) => (
            <div 
              key={plant.id} 
              className="snap-center shrink-0 w-56 h-80 bg-gray-100 rounded-3xl p-4 relative group cursor-pointer transition-all hover:shadow-lg duration-300"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); toggleLike(plant.id); }}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full cursor-pointer transition-colors ${isLiked(plant.id) ? 'bg-red-50' : 'bg-white/80 backdrop-blur-sm'}`}
              >
                <Heart className={`w-4 h-4 transition-colors ${isLiked(plant.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
              </button>
              
              <div className="h-44 w-full mb-4 flex items-center justify-center relative">
                 <img src={plant.image} alt={plant.name} className="h-full w-full object-cover rounded-2xl shadow-md transform group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="space-y-1">
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md uppercase tracking-wider">{plant.category}</span>
                  <h3 className="text-lg font-bold text-gray-800">{plant.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-gray-900">${plant.price}</span>
                    <button onClick={() => addToCart(plant)} className="bg-gray-900 hover:bg-green-500 text-white p-2 rounded-xl transition-colors">
                       <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
              </div>
            </div>
          )) : (
            <div className="w-full h-40 flex items-center justify-center text-gray-400">
              Нічого не знайдено
            </div>
          )}
        </div>

        <div className="px-6 mt-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Нещодавно переглянуті</h2>
          <div className="space-y-4">
             {plants.slice(0, 3).map(plant => (
               <div key={`recent-${plant.id}`} className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                  <img src={plant.image} alt={plant.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                     <h4 className="font-bold text-gray-800">{plant.name}</h4>
                     <p className="text-xs text-gray-400 line-clamp-1">{plant.description}</p>
                  </div>
                  <span className="font-bold text-green-600">${plant.price}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFavorites = () => {
    const likedPlants = plants.filter(p => isLiked(p.id));

    return (
      <div className="flex-1 overflow-y-auto pb-24 px-6 pt-2 scrollbar-hide">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ваші вподобання</h2>
        {likedPlants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Heart className="w-16 h-16 mb-4 opacity-20" />
            <p>Список порожній</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {likedPlants.map(plant => (
              <div key={plant.id} className="bg-gray-100 rounded-3xl p-4 relative">
                <button onClick={() => toggleLike(plant.id)} className="absolute top-3 right-3 bg-red-50 p-2 rounded-full">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
                <img src={plant.image} className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm" alt={plant.name}/>
                <h3 className="font-bold text-gray-800">{plant.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-600 font-bold">${plant.price}</span>
                  <button onClick={() => addToCart(plant)} className="p-2 bg-gray-900 rounded-lg text-white">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCart = () => {
    const fullCart = cartItems.map(item => {
      const plant = plants.find(p => p.id === item.plantId);
      return { ...plant, qty: item.quantity };
    });
    const total = getCartTotal();
    const shipping = fullCart.length > 0 ? 5.00 : 0;

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
         <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6 scrollbar-hide">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Мій кошик</h2>
            
            {fullCart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                <p>Кошик порожній</p>
              </div>
            ) : (
              <div className="space-y-4">
                {fullCart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 items-center">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-sm text-green-600 font-semibold">${item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <button onClick={() => updateCartQty(item.id, -1)} className="p-1 hover:text-red-500"><Minus className="w-3 h-3"/></button>
                          <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="p-1 hover:text-green-500"><Plus className="w-3 h-3"/></button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
         </div>

         {fullCart.length > 0 && (
           <div className="bg-white p-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Проміжна сума</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Доставка</span>
                  <span>${shipping}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-100">
                  <span>Разом</span>
                  <span>${total + shipping}</span>
                </div>
              </div>
              <button className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition flex items-center justify-center gap-2">
                <span>Оформити замовлення</span>
                <ArrowRight className="w-5 h-5" />
              </button>
           </div>
         )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="flex-1 overflow-y-auto pb-24 px-6 pt-2 scrollbar-hide">
       <div className="flex flex-col items-center mb-8">
         <div className="w-24 h-24 rounded-full p-1 border-2 border-green-500 mb-4">
           <img src={currentUser.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
         </div>
         <h2 className="text-2xl font-bold text-gray-800">{currentUser.name}</h2>
         <p className="text-gray-400 text-sm">{currentUser.email}</p>
       </div>

       <div className="space-y-3">
         <ProfileMenuItem icon={ShoppingBag} label="Мої замовлення" />
         <ProfileMenuItem icon={MapPin} label="Адреса доставки" sub={currentUser.address} />
         <ProfileMenuItem icon={CreditCard} label="Методи оплати" />
         <ProfileMenuItem icon={Bell} label="Сповіщення" badge="2" />
         <ProfileMenuItem icon={Settings} label="Налаштування" />
         <ProfileMenuItem icon={LogOut} label="Вийти" isDanger onClick={handleLogout} />
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden h-[850px] relative flex flex-col">
        
        {/* Render Side Menu */}
        {isAuthenticated && renderSideMenu()}
        
        {/* Render Filter Modal */}
        {renderFilterModal()}

        {/* Auth Check */}
        {!isAuthenticated ? (
          renderLoginScreen()
        ) : (
          <>
            {/* Header */}
            {(activeNav === 'Home' || activeNav === 'Favorites') && (
              <div className="p-6 pb-2">
                <div className="flex justify-between items-center mb-6">
                  {/* Menu Button Functionality */}
                  <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <Menu className="w-6 h-6 text-gray-800" />
                  </button>
                  <button onClick={() => setActiveNav('Profile')} className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm transition transform active:scale-95">
                     <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                  </button>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 leading-tight mb-6">
                  Знайдіть свої <br />
                  <span className="text-green-500">улюблені рослини</span>
                </h1>

                <div className="flex gap-4 mb-6">
                  <div className="flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-3">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Пошук..." 
                      className="bg-transparent border-none outline-none text-gray-700 w-full placeholder-gray-400"
                    />
                  </div>
                  <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-2xl transition shadow-lg shadow-green-200"
                  >
                    <SlidersHorizontal className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}

            {/* Content Switcher */}
            {activeNav === 'Home' && renderHome()}
            {activeNav === 'Favorites' && renderFavorites()}
            {activeNav === 'Cart' && renderCart()}
            {activeNav === 'Profile' && renderProfile()}

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center text-gray-300 z-40">
              <NavButton icon={Home} isActive={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
              <NavButton icon={Heart} isActive={activeNav === 'Favorites'} onClick={() => setActiveNav('Favorites')} badge={favorites.length > 0} />
              <NavButton icon={ShoppingBag} isActive={activeNav === 'Cart'} onClick={() => setActiveNav('Cart')} badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)} isCount={true} />
              <NavButton icon={User} isActive={activeNav === 'Profile'} onClick={() => setActiveNav('Profile')} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}
