/**
 * avatarOutfits — maps an equipped Wardrobe item (by imageKey) to an avatar
 * appearance override. Equipping the item merges this over the base persona
 * style, so the rendered avatar actually changes clothes (FIX 4).
 *
 * Only the clothing fields are overridden (top / inner / bottom / tie / bindi);
 * skin, hair and held accessory stay from the base persona. Items that only add
 * an overlay (shoes/jacket via equipKey) don't need an entry here.
 */
import type { AvatarStyle } from '../components/avatar/AvatarFigure';

export type OutfitOverride = Partial<AvatarStyle>;

export const WARDROBE_OUTFITS: Record<string, OutfitOverride> = {
  // male
  casual_tshirt: { topKind: 'tshirt', top: '#5BA6C9', inner: '#5BA6C9' },
  shirt: { topKind: 'shirt', top: '#AFCDE8', inner: '#FFFFFF' },
  kurta: { topKind: 'kurta', top: '#EFE7D3', inner: '#F6F1E4' },
  hoodie: { topKind: 'hoodie', top: '#E0764B', inner: '#F4ECD8' },
  jeans: { bottomKind: 'jeans', bottom: '#3E5C86' },
  formal_shirt: { topKind: 'shirt', top: '#EAF0F6', inner: '#FFFFFF' },
  blazer: { topKind: 'blazer', top: '#2C3550', inner: '#FFFFFF' },
  business_suit: { topKind: 'blazer', top: '#23283A', inner: '#FFFFFF', tie: '#9B2F3A', bottomKind: 'trousers', bottom: '#23283A' },
  sherwani: { topKind: 'kurta', top: '#EDE6D4', inner: '#F6F1E4' },
  // female
  kurti: { topKind: 'kurta', top: '#8A3A57', inner: '#F2E7D8' },
  dress: { topKind: 'kurta', top: '#C0567B', inner: '#F2E7D8', bottomKind: 'sareeSkirt', bottom: '#C0567B' },
  cardigan: { topKind: 'blazer', top: '#7E6BD0', inner: '#EFEAFB' },
  handbag_outfit: { topKind: 'kurta', top: '#E0985F', inner: '#FBEFD8' },
  formal_blouse: { topKind: 'shirt', top: '#EAF4FA', inner: '#FFFFFF' },
  office_suit: { topKind: 'blazer', top: '#34553F', inner: '#EFE6D4' },
  saree: { topKind: 'saree', top: '#C0567B', inner: '#7A2E4E', bottomKind: 'sareeSkirt', bottom: '#C0567B', bindi: true },
  traditional_outfit: { topKind: 'saree', top: '#34553F', inner: '#7A2E2E', bottomKind: 'sareeSkirt', bottom: '#34553F', bindi: true },
  lehenga: { topKind: 'tshirt', top: '#C0432F', inner: '#C0432F', bottomKind: 'sareeSkirt', bottom: '#E0A526' },
  designer_outfit: { topKind: 'blazer', top: '#7A2E4E', inner: '#F4ECD8' },
};

export function outfitForImageKey(imageKey?: string): OutfitOverride | undefined {
  return imageKey ? WARDROBE_OUTFITS[imageKey] : undefined;
}
