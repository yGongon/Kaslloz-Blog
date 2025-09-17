
import { Category } from '../types';

// NOTA: A funcionalidade de IA foi substituída por uma versão local
// para permitir que o aplicativo seja executado sem uma chave de API do Google.
export const generatePostIdea = async (category: Category): Promise<string> => {
  // Simula um pequeno atraso, como se estivesse pensando.
  await new Promise(resolve => setTimeout(resolve, 500)); 

  if (category === Category.Builds) {
    return "Title: Build 'Trovão Silencioso' para a MP7\nContent: Foque em velocidade e furtividade com esta build de MP7. Ideal para flanquear inimigos sem ser detectado. Acessórios: Supressor Monolítico, Coronha Sem Apoio, Laser Tático 5mW.";
  } else {
    return "Title: Hotfix v1.2.6 - Correções Urgentes\nContent: Um pequeno patch foi lançado para corrigir o bug de atravessar paredes no mapa 'Silo' e melhorar a estabilidade geral do servidor. A jogabilidade não foi alterada.";
  }
};
