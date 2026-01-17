
import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Plus, 
  Trophy, 
  Settings, 
  Coins, 
  Crown, 
  Sun, 
  Moon, 
  Monitor, 
  Search,
  Upload,
  Box,
  Rocket,
  MessageSquare,
  X,
  Github,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Server,
  Key,
  History,
  Terminal,
  Download,
  ShieldCheck,
  Zap,
  Copy,
  Cpu
} from 'lucide-react';
import { Theme, UserStats, Achievement, GameProject, DeploymentRecord } from './types';
import { askBobroAI } from './services/geminiService';

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Первые шаги', description: 'Зайти в Боброблокс в первый раз', rewardType: 'bobrobuck', rewardAmount: 10, completed: true, difficulty: 'easy' },
  { id: '2', title: 'Строитель', description: 'Создать свою первую игру', rewardType: 'bobrobuck', rewardAmount: 50, completed: false, difficulty: 'easy' },
  { id: '3', title: 'Мастер Unity', description: 'Успешно импортировать 3D проект из Unity', rewardType: 'bubr', rewardAmount: 5, completed: false, difficulty: 'hard' },
  { id: '4', title: 'Вирусный хит', description: 'Набрать 1000 игроков в своей игре', rewardType: 'bubr', rewardAmount: 20, completed: false, difficulty: 'hard' },
];

const MOCK_GAMES: GameProject[] = [
  { id: 'g1', title: 'Бобриные Гонки', type: '3D', author: 'Admin', thumbnail: 'https://picsum.photos/seed/bobr1/400/300', status: 'published', engine: 'Unity' },
  { id: 'g2', title: 'Лесной Прыгун', type: '2D', author: 'User123', thumbnail: 'https://picsum.photos/seed/bobr2/400/300', status: 'published', engine: 'Custom' },
  { id: 'g3', title: 'Побег из Плотины', type: '3D', author: 'DevBobr', thumbnail: 'https://picsum.photos/seed/bobr3/400/300', status: 'draft', engine: 'Unity' },
];

const MOCK_DEPLOYMENTS: DeploymentRecord[] = [
  { id: 'd1', date: '2023-10-25 14:20', status: 'ready', url: 'https://bobr-race.vercel.app', commit: 'Initial build' },
  { id: 'd2', date: '2023-10-26 09:15', status: 'error', url: '', commit: 'Fix physics' },
];

type DeployStep = 'idle' | 'github-auth' | 'repo-create' | 'pushing' | 'vercel-build' | 'success';

export default function App() {
  const [theme, setTheme] = useState<Theme>('system');
  const [activeTab, setActiveTab] = useState<'discover' | 'studio' | 'achievements'>('discover');
  const [studioSubTab, setStudioSubTab] = useState<'projects' | 'hosting'>('projects');
  
  const [stats, setStats] = useState<UserStats>({
    bobrobucks: 160,
    bubr: 5,
    username: 'BobrMaster',
    level: 4
  });

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [deployStep, setDeployStep] = useState<DeployStep>('idle');
  const [useGithub, setUseGithub] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState('');
  const [vercelToken, setVercelToken] = useState('');

  const [isDeployingPlatform, setIsDeployingPlatform] = useState(false);
  const [platformLogs, setPlatformLogs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applyTheme = () => {
        if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      applyTheme();
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    } catch (e) {
      console.warn("Theme application failed:", e);
    }
  }, [theme]);

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;
    setAiResponse('Бобро-ИИ готовит план развертывания всей системы...');
    try {
      const res = await askBobroAI(`Контекст: Пользователь хочет развернуть всю платформу Боброблокс на Vercel. Текущий запрос: ${aiQuery}`);
      setAiResponse(res);
    } catch (e: any) {
      setAiResponse(`Ошибка: ${e?.message || 'Не удалось связаться с Бобро-ИИ'}`);
    }
  };

  const deployEntirePlatform = () => {
    setIsDeployingPlatform(true);
    setPlatformLogs(["Initializing Bobroblox Core Deployment..."]);
    
    const logs = [
      "Compiling UI components...",
      "Setting up Gemini API proxy hooks...",
      "Generating vercel.json configuration...",
      "Bundling all assets and scripts...",
      "Connecting to Vercel API via Auth Token...",
      "Pushing global project to production...",
      "Verifying deployment SSL certificates...",
      "SUCCESS: Bobroblox Platform is now LIVE globally!"
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setPlatformLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
        if (index === logs.length - 1) {
          setIsDeployingPlatform(false);
        }
      }, (index + 1) * 800);
    });
  };

  const startVercelDeploy = () => {
    setDeployStep('github-auth');
    setTimeout(() => setDeployStep('repo-create'), 1500);
    setTimeout(() => setDeployStep('pushing'), 3000);
    setTimeout(() => setDeployStep('vercel-build'), 5000);
    setTimeout(() => {
      setDeployStep('success');
      setDeployedUrl(`https://bobroblox-game-${Math.floor(Math.random() * 1000)}.vercel.app`);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col bg-grid">
      <nav className="fixed top-0 left-0 h-full w-20 md:w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 z-50 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Box className="text-white w-6 h-6" />
          </div>
          <span className="hidden md:block font-bold text-xl tracking-tight text-orange-600 dark:text-orange-500">БОБРОБЛОКС</span>
        </div>

        <div className="flex-1 px-4 space-y-2 mt-4">
          <NavItem active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} icon={<Gamepad2 />} label="Игры" />
          <NavItem active={activeTab === 'studio'} onClick={() => setActiveTab('studio')} icon={<Rocket />} label="Студия" />
          <NavItem active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} icon={<Trophy />} label="Достижения" />
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded-lg p-1">
            <ThemeButton active={theme === 'light'} onClick={() => setTheme('light')} icon={<Sun size={18} />} />
            <ThemeButton active={theme === 'system'} onClick={() => setTheme('system')} icon={<Monitor size={18} />} />
            <ThemeButton active={theme === 'dark'} onClick={() => setTheme('dark')} icon={<Moon size={18} />} />
          </div>
        </div>
      </nav>

      <main className="ml-20 md:ml-64 flex-1 pb-24">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-40 px-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-xl hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input type="text" placeholder="Поиск по мирам..." className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all"/>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full">
              <div className="flex items-center gap-1.5 px-2 border-r border-zinc-300 dark:border-zinc-700">
                <Coins size={16} className="text-orange-500" />
                <span className="font-bold text-sm">{stats.bobrobucks}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2">
                <Crown size={16} className="text-amber-500" />
                <span className="font-bold text-sm">{stats.bubr}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white shadow-md border-2 border-white dark:border-zinc-800 cursor-pointer">{stats.username[0] || 'B'}</div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'studio' && (
            <div className="max-w-6xl mx-auto">
               <div className="flex gap-6 mb-8 border-b border-zinc-200 dark:border-zinc-800">
                 <button 
                  onClick={() => setStudioSubTab('projects')}
                  className={`pb-4 px-2 font-bold text-sm transition-all relative ${studioSubTab === 'projects' ? 'text-orange-600' : 'text-zinc-500'}`}
                 >
                   МОИ ИГРЫ
                   {studioSubTab === 'projects' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full" />}
                 </button>
                 <button 
                  onClick={() => setStudioSubTab('hosting')}
                  className={`pb-4 px-2 font-bold text-sm transition-all relative ${studioSubTab === 'hosting' ? 'text-orange-600' : 'text-zinc-500'}`}
                 >
                   ХОСТИНГ ПЛАТФОРМЫ
                   {studioSubTab === 'hosting' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full" />}
                 </button>
               </div>
               
               {studioSubTab === 'projects' ? (
                 <StudioView setIsUploading={setIsUploading} />
               ) : (
                 <GlobalHostingView 
                  vercelToken={vercelToken} 
                  setVercelToken={setVercelToken} 
                  onDeployPlatform={deployEntirePlatform}
                  isDeploying={isDeployingPlatform}
                  logs={platformLogs}
                 />
               )}
            </div>
          )}
          {activeTab === 'achievements' && <AchievementsView stats={stats} />}
        </div>
      </main>

      <button onClick={() => setIsAIModalOpen(true)} className="fixed bottom-8 right-8 w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 ring-4 ring-orange-500/20">
        <MessageSquare />
      </button>

      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <div className="p-4 bg-orange-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <span className="font-bold">Бобро-ИИ: Мастер Облаков</span>
              </div>
              <button onClick={() => setIsAIModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="min-h-[150px] mb-4 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {aiResponse || "Я могу помочь тебе развернуть ВСЮ платформу Боброблокс на твоем Vercel. Просто вставь токен в настройки хостинга, и я сгенерирую команды для терминала! 🐹🚀"}
              </div>
              <div className="flex gap-2">
                <input value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskAI()} placeholder="Как мне развернуть весь сайт?" className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none"/>
                <button onClick={handleAskAI} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700">OK</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-3xl p-8 border border-orange-500/30 overflow-y-auto max-h-[90vh]">
            {deployStep === 'idle' ? (
              <>
                <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">Создать новый мир</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-orange-500 transition-colors group cursor-pointer relative overflow-hidden">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-100 dark:group-hover:bg-orange-950 transition-colors">
                      <Upload className="text-zinc-500 group-hover:text-orange-600" />
                    </div>
                    <span className="font-bold text-lg mb-2 text-center">Выбрать папку</span>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-1.5 opacity-70 uppercase tracking-wider">Имя проекта</label>
                      <input className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 border border-transparent dark:border-zinc-700" placeholder="Бобриная Вселенная" />
                    </div>
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><Github size={20} className="text-zinc-400" /><span className="font-bold text-sm">GitHub Sync</span></div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={useGithub} onChange={(e) => setUseGithub(e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={() => setIsUploading(false)} className="px-6 py-3 rounded-xl font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">Отмена</button>
                  <button className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-xl shadow-orange-500/20" onClick={startVercelDeploy}>РАЗВЕРНУТЬ ИГРУ</button>
                </div>
              </>
            ) : (
              <div className="py-10 text-center">
                 <div className="mb-8">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    {deployStep === 'success' ? <CheckCircle2 className="text-green-500 w-10 h-10" /> : <Loader2 className="text-orange-600 w-10 h-10 animate-spin" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {deployStep === 'github-auth' && 'Подключаемся к GitHub...'}
                    {deployStep === 'repo-create' && 'Создаем репозиторий...'}
                    {deployStep === 'pushing' && 'Загружаем ассеты...'}
                    {deployStep === 'vercel-build' && 'Сборка на Vercel...'}
                    {deployStep === 'success' && 'Готово к игре! 🎉'}
                  </h3>
                </div>
                <div className="max-w-md mx-auto space-y-3 mb-8 text-left">
                  <StepItem active={deployStep !== 'idle'} done={['repo-create', 'pushing', 'vercel-build', 'success'].includes(deployStep)} label="Auth Pipeline" />
                  <StepItem active={['repo-create', 'pushing', 'vercel-build', 'success'].includes(deployStep)} done={['pushing', 'vercel-build', 'success'].includes(deployStep)} label="Git Init" />
                  <StepItem active={['pushing', 'vercel-build', 'success'].includes(deployStep)} done={['vercel-build', 'success'].includes(deployStep)} label="Push Build" />
                  <StepItem active={['vercel-build', 'success'].includes(deployStep)} done={deployStep === 'success'} label="Vercel Deploy" />
                </div>
                {deployStep === 'success' && (
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl flex items-center justify-between mb-8 text-left border border-orange-500/20">
                    <div className="overflow-hidden pr-4"><span className="text-[10px] font-bold text-zinc-400 uppercase">Ссылка на игру</span><p className="font-mono text-sm truncate text-orange-600">{deployedUrl}</p></div>
                    <a href={deployedUrl} target="_blank" rel="noreferrer" className="flex-shrink-0 bg-white dark:bg-zinc-700 p-3 rounded-xl shadow-sm hover:scale-105 transition-transform"><ExternalLink size={18} /></a>
                  </div>
                )}
                <button onClick={() => { setIsUploading(false); setDeployStep('idle'); }} className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 transition-opacity">{deployStep === 'success' ? 'Закрыть' : 'Отменить'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const GlobalHostingView = ({ vercelToken, setVercelToken, onDeployPlatform, isDeploying, logs }: any) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-gradient-to-br from-zinc-900 to-black dark:from-zinc-900 dark:to-zinc-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-zinc-800">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-orange-500 fill-orange-500" />
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Platform Command Center</h2>
            </div>
            <p className="text-zinc-400 mb-8 max-w-xl">
              Разверните всю инфраструктуру Боброблокса одним нажатием. Это действие опубликует весь исходный код, UI и интеграции Gemini на ваш Vercel домен.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onDeployPlatform}
                disabled={isDeploying}
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-lg shadow-orange-600/30 disabled:opacity-50"
              >
                {isDeploying ? <Loader2 className="animate-spin" /> : <Rocket />}
                DEPLOY FULL PLATFORM
              </button>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all">
                <Download size={20} />
                EXPORT SOURCE
              </button>
            </div>
          </div>
          <Cpu className="absolute -right-20 -top-20 w-80 h-80 text-white/5 rotate-12" />
        </div>

        <div className="bg-black rounded-3xl p-6 font-mono text-xs border border-zinc-800 shadow-xl min-h-[300px] flex flex-col">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-zinc-500 uppercase font-bold tracking-widest text-[10px]">bobro-cli v4.2.0</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            <p className="text-zinc-500">$ bobro init --global</p>
            {logs.map((log: string, i: number) => (
              <p key={i} className={log.includes('SUCCESS') ? 'text-green-500 font-bold' : 'text-orange-400 opacity-90'}>
                {log}
              </p>
            ))}
            {isDeploying && <p className="text-white animate-pulse">_</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-md">
          <h3 className="font-bold flex items-center gap-2 mb-4">
            <ShieldCheck className="text-orange-600" />
            Vercel API Config
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-400 mb-1 block">Vercel Token</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={vercelToken}
                  onChange={(e) => setVercelToken(e.target.value)}
                  placeholder="vercel_tok_..." 
                  className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 pr-10 font-mono text-xs outline-none focus:ring-2 focus:ring-orange-500 border border-transparent"
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              </div>
            </div>
            <button className="w-full py-3 border-2 border-orange-600/20 text-orange-600 rounded-xl font-bold hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors flex items-center justify-center gap-2">
              <Zap size={14} />
              VALIDATE TOKEN
            </button>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-bold text-sm mb-4">Быстрые команды</h3>
          <div className="space-y-3">
            <CommandCard cmd="npx vercel deploy" />
            <CommandCard cmd="git push origin main" />
            <CommandCard cmd="bobro env set API_KEY" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CommandCard = ({ cmd }: { cmd: string }) => (
  <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 group hover:border-orange-500 transition-colors shadow-sm">
    <code className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{cmd}</code>
    <button className="text-zinc-400 hover:text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
      <Copy size={12} />
    </button>
  </div>
);

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}>
    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 22 }) : null}
    <span className="hidden md:block font-semibold">{label}</span>
  </button>
);

const ThemeButton = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button onClick={onClick} className={`flex-1 flex justify-center py-2 rounded-md transition-all ${active ? 'bg-white dark:bg-zinc-700 text-orange-500 shadow-sm' : 'text-zinc-400'}`}>
    {icon}
  </button>
);

const StepItem = ({ active, done, label }: { active: boolean, done: boolean, label: string }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${done ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' : active ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30' : 'bg-zinc-50 dark:bg-zinc-800 border-transparent opacity-50'}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done ? 'bg-green-500 text-white' : 'bg-zinc-300 dark:bg-zinc-600'}`}>
      {done && <CheckCircle2 size={12} />}
    </div>
    <span className={`text-sm font-semibold ${done ? 'text-green-700 dark:text-green-400' : active ? 'text-orange-700 dark:text-orange-400' : ''}`}>{label}</span>
    {active && !done && <Loader2 size={12} className="ml-auto animate-spin text-orange-500" />}
  </div>
);

const DiscoverView = () => (
  <div className="animate-in fade-in duration-700">
    <div className="flex items-center justify-between mb-8">
      <div><h1 className="text-3xl font-extrabold tracking-tight">Открывай Миры</h1><p className="text-zinc-500">Лучшие игры, созданные бобрами для бобров</p></div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg font-medium">Новинки</button>
        <button className="px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg font-medium">Топ чарты</button>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {MOCK_GAMES.map(game => (
        <div key={game.id} className="group bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1">
          <div className="relative aspect-video">
            <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-white text-[10px] font-bold uppercase tracking-wider">{game.type} • {game.engine}</div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-600 scale-75 group-hover:scale-100 transition-transform"><Gamepad2 fill="currentColor" /></div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 group-hover:text-orange-600 transition-colors">{game.title}</h3>
            <div className="flex items-center justify-between"><span className="text-xs text-zinc-500">Автор: <span className="text-orange-600 font-medium">@{game.author}</span></span><div className="flex items-center gap-1 text-zinc-400"><Settings size={14} /><span className="text-[10px] font-bold">ALPHA</span></div></div>
          </div>
        </div>
      ))}
      <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-zinc-400 opacity-50"><Plus size={32} className="mb-2" /><span className="text-center text-sm font-medium">Твоя игра может быть здесь!</span></div>
    </div>
  </div>
);

const StudioView = ({ setIsUploading }: { setIsUploading: (val: boolean) => void }) => (
  <div className="animate-in fade-in duration-500">
    <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-10 text-white mb-10 shadow-2xl shadow-orange-500/30 relative overflow-hidden">
      <div className="relative z-10">
        <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Студия Креатива ⚒️</h1>
        <p className="text-orange-100 text-lg max-w-lg mb-8">Создавай миры в Unity или на нашем движке. Мы берем на себя хостинг, а ты — веселье.</p>
        <button onClick={() => setIsUploading(true)} className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-orange-50 transition-transform hover:scale-105 active:scale-95 shadow-lg">
          <Plus size={24} /> НОВАЯ ИГРА
        </button>
      </div>
      <Box className="absolute -right-20 -bottom-20 w-80 h-80 text-white/10 rotate-12" />
    </div>
    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
      <div className="w-2 h-8 bg-orange-600 rounded-full" />
      УПРАВЛЕНИЕ МИРАМИ
    </h2>
    <div className="space-y-4">
      {MOCK_GAMES.filter(g => g.author === 'Admin').map(game => (
        <div key={game.id} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl flex items-center justify-between hover:border-orange-500/50 transition-colors shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-inner"><img src={game.thumbnail} className="w-full h-full object-cover" /></div>
            <div>
              <h4 className="font-black text-lg">{game.title}</h4>
              <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Box size={14} className="text-orange-500" /> {game.type}</span>
                <span className="flex items-center gap-1.5"><Cpu size={14} className="text-zinc-400" /> {game.engine}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-2xl text-zinc-500 transition-colors"><Settings size={20} /></button>
            <button className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-tighter hover:opacity-80">Launch Studio</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AchievementsView = ({ stats }: { stats: UserStats }) => (
  <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
        <span className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1 block">Бобробук</span>
        <div className="flex items-center gap-3 mt-1"><Coins className="text-orange-500" size={32} /><span className="text-4xl font-black italic">{stats.bobrobucks}</span></div>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
        <span className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1 block">Бубр (Premium)</span>
        <div className="flex items-center gap-3 mt-1"><Crown className="text-amber-500" size={32} /><span className="text-4xl font-black italic">{stats.bubr}</span></div>
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden group">
        <span className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-1 block">Rank</span>
        <div className="flex items-center gap-3 mt-1"><Trophy className="text-indigo-500" size={32} /><span className="text-4xl font-black italic">#{stats.level}</span></div>
      </div>
    </div>
    <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">Награды и Достижения</h2>
    <div className="space-y-4">
      {MOCK_ACHIEVEMENTS.map(ach => (
        <div key={ach.id} className={`p-6 rounded-3xl border transition-all ${ach.completed ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 opacity-75' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-orange-400 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${ach.difficulty === 'hard' ? 'bg-amber-100 text-amber-600' : 'bg-orange-100 text-orange-600'}`}>{ach.difficulty === 'hard' ? <Crown size={32} /> : <Trophy size={32} />}</div>
              <div><h3 className="text-xl font-black tracking-tight">{ach.title}</h3><p className="text-zinc-500 text-sm font-medium">{ach.description}</p></div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">{ach.rewardType === 'bobrobuck' ? <Coins size={20} className="text-orange-500" /> : <Crown size={20} className="text-amber-500" />}<span className="font-black text-2xl">+{ach.rewardAmount}</span></div>
              <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${ach.difficulty === 'hard' ? 'bg-amber-500 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>{ach.difficulty === 'hard' ? 'LEGENDARY' : 'COMMON'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
