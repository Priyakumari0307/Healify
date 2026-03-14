import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Flame, 
  CheckCircle2, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  Clock,
  ChevronDown,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Nutrition', 'Fitness', 'Sleep', 'Mental Health', 'Hydration'];

const ALL_TIPS = [
  { id: 1, title: 'Eat more leafy greens', description: 'Spinach, kale, and other greens are packed with vitamins and minerals essential for your body.', category: 'Nutrition', emoji: '🥗', readTime: '2 min' },
  { id: 2, title: 'Take a 15-minute walk', description: 'A short walk after meals can significantly improve digestion and boost your metabolic rate.', category: 'Fitness', emoji: '🚶', readTime: '3 min' },
  { id: 3, title: 'No screens before bed', description: 'Blue light from phones inhibits melatonin production. Try reading a book instead.', category: 'Sleep', emoji: '🌙', readTime: '4 min' },
  { id: 4, title: 'Try 5 mins of meditation', description: 'Focusing on your breath for just 5 minutes can lower stress and improve concentration.', category: 'Mental Health', emoji: '🧘', readTime: '5 min' },
  { id: 5, title: 'Drink water before meals', description: 'Drinking a glass of water before you eat can help with appetite control and hydration.', category: 'Hydration', emoji: '💧', readTime: '1 min' },
  { id: 6, title: 'Stretch every morning', description: 'Morning stretching improves flexibility and gets your blood flowing for the day ahead.', category: 'Fitness', emoji: '🤸', readTime: '2 min' },
  { id: 7, title: 'Limit processed sugars', description: 'High sugar intake leads to energy crashes. Opt for natural fruits when you have a sweet tooth.', category: 'Nutrition', emoji: '🍎', readTime: '3 min' },
  { id: 8, title: 'Keep your room cool', description: 'The ideal temperature for deep sleep is around 18°C (65°F). Keep it cool and dark.', category: 'Sleep', emoji: '❄️', readTime: '2 min' },
  { id: 9, title: 'Practice gratitude daily', description: 'Writing down 3 things you are grateful for can rewire your brain for positivity.', category: 'Mental Health', emoji: '✨', readTime: '3 min' },
  { id: 10, title: 'Carry a water bottle', description: 'Having water always at hand makes it much easier to reach your daily hydration goals.', category: 'Hydration', emoji: '🥤', readTime: '1 min' },
  { id: 11, title: 'Eat protein with every meal', description: 'Protein helps you feel full longer and supports muscle repair after exercise.', category: 'Nutrition', emoji: '🍗', readTime: '4 min' },
  { id: 12, title: 'Consistent sleep schedule', description: 'Going to bed and waking up at the same time helps regulate your internal clock.', category: 'Sleep', emoji: '⏰', readTime: '3 min' },
];

const categoryStyles = {
  'Nutrition': { color: 'text-green-600', bg: 'bg-green-100', badge: 'bg-green-50 text-green-700' },
  'Fitness': { color: 'text-blue-600', bg: 'bg-blue-100', badge: 'bg-blue-50 text-blue-700' },
  'Sleep': { color: 'text-amber-600', bg: 'bg-amber-100', badge: 'bg-amber-50 text-amber-700' },
  'Mental Health': { color: 'text-purple-600', bg: 'bg-purple-100', badge: 'bg-purple-50 text-purple-700' },
  'Hydration': { color: 'text-teal-600', bg: 'bg-teal-100', badge: 'bg-teal-50 text-teal-700' },
};

const HealthTips = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [completedDates, setCompletedDates] = useState([]);
  const [savedTips, setSavedTips] = useState([]);
  const [dailyTipIndex, setDailyTipIndex] = useState(0);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [achievement, setAchievement] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDates = JSON.parse(localStorage.getItem('healify_completed_dates') || '[]');
    const saved = JSON.parse(localStorage.getItem('healify_saved_tips') || '[]');
    
    setCompletedDates(savedDates);
    setSavedTips(saved);

    const dayOfYear = Math.floor(new Date() / 8.64e7);
    setDailyTipIndex(dayOfYear % ALL_TIPS.length);
  }, []);

  // Calculate current streak
  const calculateStreak = (dates) => {
    if (dates.length === 0) return 0;
    const sortedDates = [...dates].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let currentDate = new Date();
    
    // Check if today is done or yesterday was done
    const todayStr = new Date().toDateString();
    const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
    
    if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) return 0;

    let checkDate = dates.includes(todayStr) ? new Date() : new Date(Date.now() - 86400000);
    
    while (dates.includes(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  const streak = calculateStreak(completedDates);

  const handleMarkAsDone = () => {
    const today = new Date().toDateString();
    if (completedDates.includes(today)) return;

    const newDates = [...completedDates, today];
    setCompletedDates(newDates);
    localStorage.setItem('healify_completed_dates', JSON.stringify(newDates));

    const newStreak = calculateStreak(newDates);
    
    // Achievement System
    if (newStreak === 1) {
      showAchievement("Great start! Keep going! 🚀", "Beginner");
    } else if (newStreak === 3) {
      showAchievement("3 Day Streak! Armature Enthusiast! 🏅", "Armature");
    } else if (newStreak === 7) {
      showAchievement("7 Day Streak! Health Champion! 🏆", "Champion");
    }
  };

  const showAchievement = (message, title) => {
    setAchievement({ message, title });
    setTimeout(() => setAchievement(null), 5000);
  };

  const handleNextTip = () => {
    setDailyTipIndex((prev) => (prev + 1) % ALL_TIPS.length);
  };

  const toggleSave = (tip) => {
    let newSaved;
    if (savedTips.some(t => t.id === tip.id)) {
      newSaved = savedTips.filter(t => t.id !== tip.id);
    } else {
      newSaved = [...savedTips, tip];
    }
    setSavedTips(newSaved);
    localStorage.setItem('healify_saved_tips', JSON.stringify(newSaved));
  };

  const isTodayDone = completedDates.includes(new Date().toDateString());

  const filteredTips = activeTab === 'All' 
    ? ALL_TIPS 
    : ALL_TIPS.filter(tip => tip.category === activeTab);

  // Week View Logic
  const getWeekDays = () => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 for Mon, 6 for Sun
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        dateStr: d.toDateString(),
        isToday: d.toDateString() === now.toDateString(),
        isPast: d < now && d.toDateString() !== now.toDateString()
      };
    });
  };

  const weekDays = getWeekDays();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative">
      {/* Achievement Notification */}
      {achievement && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{achievement.title} Unlocked!</p>
              <p className="text-gray-900 font-bold">{achievement.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* App Header */}
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Lightbulb size={24} className="text-[#2563EB]" />
            <h1 className="text-xl font-bold text-gray-900">Health Tips</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">Healify</span>
          <Activity size={20} className="text-[#2563EB]" />
        </div>
      </header>

      <div className="max-w-[900px] mx-auto px-4 py-8">
        
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Stay Healthy</h2>
            <p className="text-gray-600">Daily tips to keep you healthy and informed</p>
          </div>
          
          <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-sm w-fit leading-none">
            <span className="text-lg">🔥</span>
            <span>{streak} Day Streak — Keep it up!</span>
          </div>
        </div>

        {/* Daily Tip Widget */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">Tip of the Day</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{ALL_TIPS[dailyTipIndex].title}</h2>
              <p className="text-gray-700">{ALL_TIPS[dailyTipIndex].description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleMarkAsDone}
                disabled={isTodayDone}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm ${
                  isTodayDone 
                    ? 'bg-green-500 text-white cursor-not-allowed opacity-90' 
                    : 'bg-[#2563EB] text-white hover:bg-blue-700 active:scale-95'
                }`}
              >
                {isTodayDone ? (
                  <><CheckCircle2 size={18} /> Marked Done</>
                ) : (
                  '✓ Mark as Done'
                )}
              </button>
              <button 
                onClick={handleNextTip}
                className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 transition-all flex items-center gap-2"
              >
                Next Tip <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Streak Tracker */}
        <section className="mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-900 font-bold mb-4 text-left">Your Week</h3>
          <div className="flex justify-between items-center max-w-sm">
            {weekDays.map((day) => {
              const isDone = completedDates.includes(day.dateStr);
              let circleColor = 'bg-gray-100 text-gray-400';
              
              if (isDone) {
                circleColor = 'bg-green-500 text-white';
              } else if (day.isToday) {
                circleColor = 'bg-blue-600 text-white ring-4 ring-blue-100';
              } else if (day.isPast) {
                circleColor = 'bg-gray-200 text-gray-400'; // Gray for missed days
              }
              
              return (
                <div key={day.dateStr} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${circleColor}`}>
                    {isDone ? <CheckCircle2 size={16} /> : day.name[0]}
                  </div>
                  <span className={`text-xs font-medium ${day.isToday ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                    {day.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="mb-8 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === category 
                    ? 'bg-[#2563EB] text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Tip Feed */}
        <section className="space-y-4 mb-12 min-h-[400px]">
          {filteredTips.map(tip => (
            <div 
              key={tip.id} 
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className={`w-14 h-14 rounded-xl shrink-0 flex items-center justify-center text-2xl ${categoryStyles[tip.category].bg}`}>
                {tip.emoji}
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${categoryStyles[tip.category].badge}`}>
                    {tip.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Clock size={12} />
                    <span>{tip.readTime}</span>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 truncate">{tip.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">{tip.description}</p>
              </div>

              <button 
                onClick={() => toggleSave(tip)}
                className={`p-3 rounded-xl transition-all ${
                  savedTips.some(t => t.id === tip.id)
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                {savedTips.some(t => t.id === tip.id) ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
              </button>
            </div>
          ))}
        </section>

        {/* Saved Tips Section */}
        <section className="border-t border-gray-200 pt-8">
          <button 
            onClick={() => setIsSavedOpen(!isSavedOpen)}
            className="flex items-center justify-between w-full text-left mb-6 py-2 px-1 hover:bg-gray-50 rounded-lg transition-all"
          >
            <div className="flex items-center gap-3">
              <Bookmark className="text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900">Saved Tips ({savedTips.length})</h3>
            </div>
            <ChevronDown 
              size={24} 
              className={`text-gray-400 transition-transform duration-300 ${isSavedOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isSavedOpen && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {savedTips.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                  <Bookmark className="mx-auto text-gray-300 mb-2" size={40} />
                  <p className="text-gray-500">No tips saved yet. Explore the feed above!</p>
                </div>
              ) : (
                savedTips.map(tip => (
                  <div key={tip.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-xl ${categoryStyles[tip.category].bg}`}>
                      {tip.emoji}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h5 className="font-bold text-gray-900 text-sm truncate">{tip.title}</h5>
                      <p className="text-gray-500 text-xs">{tip.category}</p>
                    </div>
                    <button 
                      onClick={() => toggleSave(tip)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default HealthTips;
