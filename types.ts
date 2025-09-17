export enum Category {
  Builds = 'Builds',
  PatchNotes = 'Notas de Patch',
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
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

// FIX: Add the missing Comment interface.
export interface Comment {
  id: string;
  postId: string;
  name: string;
  comment: string;
  createdAt: string;
}
