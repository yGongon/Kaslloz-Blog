export enum Category {
  Builds = 'Builds',
  PatchNotes = 'Notas de Patch',
  OperatorGuides = 'Guias',
}

export enum WeaponType {
  AssaultRifle = 'Assault Rifle',
  SMG = 'SMG',
  Sniper = 'Sniper',
  LMG = 'LMG',
  Shotgun = 'Shotgun',
  MarksmanRifle = 'Marksman Rifle',
}

export interface Post {
  id: string;
  title: string;
  category: Category;
  content: string;
  imageUrl: string;
  youtubeId?: string;
  createdAt: string;
  version?: string;
  weaponType?: WeaponType;
  tags?: string[];
  upvotes: number;
  downvotes: number;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string; 
  name: string;
  photoURL?: string;
  comment: string;
  createdAt: string;
  postTitle?: string;
}

export interface SiteConfig {
  clipOfTheWeek: {
    title: string;
    youtubeId: string;
  };
}