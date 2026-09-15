import { addDoc, collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { EquipmentItem } from "@/lib/equipment";

export type SpecialRecord = {
  id: string;
  title: string;
  detail: string;
  active: boolean;
  offer?: string;
  startDate?: string;
  endDate?: string;
};

export type BookingRequestRecord = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  startTime?: string;
  location: string;
  equipment: string;
  quantity: number;
  guests?: number;
  eventType: string;
  notes: string;
  status: "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";
};

const equipmentCollection = collection(db, "equipment");
const specialCollection = collection(db, "specials");
const bookingCollection = collection(db, "bookingRequests");

export async function getEquipment(): Promise<EquipmentItem[]> {
  const snapshot = await getDocs(equipmentCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<EquipmentItem, "id">) }));
}

export async function saveEquipmentRecord(item: EquipmentItem) {
  await setDoc(doc(db, "equipment", item.id), item);
}

export async function deleteEquipmentRecord(id: string) {
  await deleteDoc(doc(db, "equipment", id));
}

export async function seedEquipmentRecords(items: EquipmentItem[]) {
  for (const item of items) await saveEquipmentRecord(item);
}

export async function getSpecials(): Promise<SpecialRecord[]> {
  const snapshot = await getDocs(specialCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<SpecialRecord, "id">) }));
}

export async function saveSpecialRecord(item: SpecialRecord) {
  await setDoc(doc(db, "specials", item.id), item);
}

export async function deleteSpecialRecord(id: string) {
  await deleteDoc(doc(db, "specials", id));
}

export async function createBookingRequest(data: Omit<BookingRequestRecord, "id">) {
  const result = await addDoc(bookingCollection, data);
  return result.id;
}

export async function getBookingRequests(): Promise<BookingRequestRecord[]> {
  const snapshot = await getDocs(bookingCollection);
  return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BookingRequestRecord, "id">) }));
}

export async function updateBookingStatus(id: string, status: BookingRequestRecord["status"]) {
  await updateDoc(doc(db, "bookingRequests", id), { status });
}

export async function clearBookingRequests() {
  const snapshot = await getDocs(bookingCollection);
  for (const item of snapshot.docs) await deleteDoc(item.ref);
}
