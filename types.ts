
export type Theme = 'light' | 'dark' | 'system';

export interface UserStats {
  bobrobucks: number;
  bubr: number;
  username: string;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardType: 'bobrobuck' | 'bubr';
  rewardAmount: number;
  completed: boolean;
  difficulty: 'easy' | 'hard';
}

export interface GameProject {
  id: string;
  title: string;
  type: '2D' | '3D';
  author: string;
  thumbnail: string;
  status: 'published' | 'draft' | 'deploying';
  engine: 'Unity' | 'Custom' | 'NoEngine';
}

export interface DeploymentRecord {
  id: string;
  date: string;
  status: 'ready' | 'error' | 'building';
  url: string;
  commit: string;
}
