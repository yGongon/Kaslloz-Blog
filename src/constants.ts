
import { Post, Category, Page, WeaponType } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Build "Raio Laser" Definitiva para M4A1',
    category: Category.Builds,
    content: 'Esta build de M4A1 foca em minimizar o recuo e maximizar a precisão para combates de média a longa distância. Usamos uma combinação do Supressor Monolítico, cano Corvus Custom Marksman e o Punho Dianteiro de Comando para alcançar um recuo quase nulo. Perfeito para segurar posições e aniquilar inimigos à distância.\n\n**Acessórios:**\n- Boca: Supressor Monolítico\n- Cano: Corvus Custom Marksman\n- Acoplamento: Punho Dianteiro de Comando\n- Lente: Lente VLK 3.0x\n- Munição: Carregador de 60 Projéteis',
    imageUrl: 'https://picsum.photos/seed/m4a1build/800/450',
    youtubeId: 'dQw4w9WgXcQ',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    weaponType: WeaponType.AssaultRifle,
    tags: ['M4A1', 'Baixo Recuo', 'Longo Alcance'],
  },
  {
    id: '2',
    title: 'Notas de Patch v1.2.5 - Novo Operador & Mapa',
    category: Category.PatchNotes,
    content: 'A versão 1.2.5 chegou, trazendo um novo Operador, "Spectre", e um mapa inédito, "Redacted."\n\n**Novo Conteúdo:**\n- Operador: Spectre - Um operativo focado em furtividade com uma vantagem de passo silencioso.\n- Mapa: Redacted - Um mapa de combate a curta distância ambientado em uma base secreta desativada.\n\n**Balanceamento de Armas:**\n- AK-47: Aumento do recuo vertical em 5%.\n- MP5: Redução do alcance de dano em 10%.\n\n**Correções de Bugs:**\n- Corrigido um problema onde jogadores podiam atravessar paredes no mapa "Warehouse".',
    imageUrl: 'https://picsum.photos/seed/patch125/800/450',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    version: '1.2.5',
    tags: ['Spectre', 'Redacted', 'Balanceamento'],
  },
   {
    id: '3',
    title: 'Build de SMG AK-74u para Correr e Atirar',
    category: Category.Builds,
    content: 'Domine o combate a curta distância com esta build de alta mobilidade da AK-74u. O foco é na velocidade de mira (ADS) e no tempo de corrida para disparo, tornando-a um monstro para estilos de jogo agressivos. O Punho Spetsnaz e a Coronha Esquelética KGB são componentes chave.\n\n**Acessórios:**\n- Boca: Supressor de Som\n- Cano: Cano Compacto 8.1"\n- Acoplamento: Punho Spetsnaz\n- Coronha: Coronha Esquelética KGB\n- Carregador: Tambor de 40 Projéteis',
    imageUrl: 'https://picsum.photos/seed/ak74ubuild/800/450',
    youtubeId: 'tS_Xq7g_S3c',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    weaponType: WeaponType.SMG,
    tags: ['AK-74u', 'Mobilidade', 'Agressivo'],
  },
  {
    id: '4',
    title: 'Notas de Patch v1.2.4 - Melhorias de Qualidade de Vida',
    category: Category.PatchNotes,
    content: 'Um patch menor focado em melhorar a experiência do jogador.\n\n**UI/UX:**\n- Adicionado um botão "Jogar Novamente" na tela pós-partida.\n- Melhorada a clareza das descrições dos acessórios.\n\n**Áudio:**\n- O áudio dos passos foi ajustado para ser mais direcional.\n\n**Desempenho:**\n- Melhorias gerais de desempenho em PCs de entrada.',
    imageUrl: 'https://picsum.photos/seed/patch124/800/450',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    version: '1.2.4',
    tags: ['UI', 'Áudio', 'Desempenho'],
  },
];

export const INITIAL_PAGES: Page[] = [
  {
    id: 'initial-about-page',
    title: 'Sobre',
    slug: 'sobre',
    createdAt: new Date().toISOString(),
    content: `Bem-vindo ao Delta Force Ops Hub, seu destino completo para tudo relacionado ao jogo. Eu, kaslloz, criei este blog por paixão pela jogabilidade tática, tiroteios intensos e a profunda personalização de armas que Delta Force oferece. Meu objetivo é criar um centro comunitário onde os jogadores possam encontrar builds confiáveis, manter-se atualizados sobre as últimas notas de patch e compartilhar seu amor pelo jogo.\n\nSeja você um novo recruta ou um veterano experiente, encontrará informações valiosas aqui para ter uma vantagem no campo de batalha.`
  }
];