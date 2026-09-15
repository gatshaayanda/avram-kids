export type EquipmentItem = {
  id: string;
  name: string;
  detail: string;
  size: string;
  price: string;
  imageUrl?: string;
  active: boolean;
};

export const EQUIPMENT_KEY = "avram_equipment_v1";

export const seedEquipment: EquipmentItem[] = [
  { id: "castle-slide", name: "Castle with Slide", detail: "Red / blue / yellow with turrets", size: "3 × 7 m", price: "P850", active: true },
  { id: "curved-water-slide", name: "Curved Water Slide with Pool", detail: "Refreshing water-slide setup", size: "3 × 7 m", price: "P850", active: true },
  { id: "tropical-castle-slide", name: "Tropical Castle with Slide", detail: "Green / orange with palm trees", size: "3 × 5.5 m", price: "P700", active: true },
  { id: "tropical-slip-slide", name: "Tropical Slip 'n Slide with Pool", detail: "Palm-tree tropical setup", size: "3 × 6 m", price: "P600", active: true },
  { id: "square-tropical-castle", name: "Square Tropical Jumping Castle", detail: "Palm-tree jumping castle", size: "4.5 × 4.5 m", price: "P600", active: true },
  { id: "tall-dual-water-slide", name: "Tall Dual-Lane Water Slide", detail: "Splash pool included", size: "3 × 6 × 2.5 m", price: "P1,000", active: true },
  { id: "long-dual-slip-slide", name: "Long Dual-Lane Slip 'n Slide", detail: "Blue / yellow", size: "2 × 8 m", price: "P650", active: true },
  { id: "tropical-castle-combo", name: "Tropical Castle & Slide Combo", detail: "Blue tarp setup", size: "3 × 6 m", price: "P600", active: true },
  { id: "classic-open-castle", name: "Classic Open Jumping Castle", detail: "Yellow pillars", size: "3 × 3 m", price: "P500", active: true },
  { id: "tropical-front-slide", name: "Tropical Castle Combo", detail: "Front slide", size: "3 × 5.5 m", price: "P700", active: true },
  { id: "dual-lane-arches", name: "Dual-Lane Slip 'n Slide", detail: "Overhead arches", size: "3.3 × 8 m", price: "P900", active: true },
];

export function readEquipment(): EquipmentItem[] {
  if (typeof window === "undefined") return seedEquipment;
  try {
    const stored = localStorage.getItem(EQUIPMENT_KEY);
    return stored ? JSON.parse(stored) : seedEquipment;
  } catch {
    return seedEquipment;
  }
}

export function saveEquipment(items: EquipmentItem[]) {
  localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(items));
}
