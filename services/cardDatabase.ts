
import { SavedCard } from '../types.ts';

const CARDS_KEY = 'skyNet_secure_vault_cards';

export const cardDatabase = {
  /**
   * Retrieves all saved cards from the permanent store.
   */
  getCards: (): SavedCard[] => {
    try {
      const data = localStorage.getItem(CARDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Vault access error:", e);
      return [];
    }
  },

  /**
   * Saves a new card to the database.
   */
  saveCard: (card: Omit<SavedCard, 'id' | 'lastFour'>): SavedCard => {
    const cards = cardDatabase.getCards();
    const lastFour = card.cardNumber.replace(/\s/g, '').slice(-4);
    
    // Check if card already exists (by number)
    const existingIdx = cards.findIndex(c => c.cardNumber === card.cardNumber);
    
    const newCard: SavedCard = {
      ...card,
      id: `CARD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      lastFour
    };

    let updatedCards;
    if (existingIdx > -1) {
      updatedCards = [...cards];
      updatedCards[existingIdx] = newCard;
    } else {
      updatedCards = [newCard, ...cards];
    }

    localStorage.setItem(CARDS_KEY, JSON.stringify(updatedCards));
    return newCard;
  },

  /**
   * Deletes a card from the permanent store.
   */
  deleteCard: (id: string) => {
    const cards = cardDatabase.getCards();
    const filtered = cards.filter(c => c.id !== id);
    localStorage.setItem(CARDS_KEY, JSON.stringify(filtered));
  },

  /**
   * Clears the entire card database.
   */
  clearVault: () => {
    localStorage.removeItem(CARDS_KEY);
  }
};
