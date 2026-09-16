import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { EquipmentItem } from "@/lib/equipment";

export type SpecialRecord = { id: string; title: string; detail: string; active: boolean; offer?: string; startDate?: string; endDate?: string };
export type HomeMediaRecord = { id: string; type: "image" | "video"; storagePath: string; publicUrl: string; title: string; caption: string; active: boolean; order: number; createdAt: string; updatedAt: string };
export type BookingRequestRecord = { id: string; createdAt: string; name: string; phone: string; email: string; date: string; startTime?: string; location: string; equipment: string; quantity: number; guests?: number; eventType: string; notes: string; status: "New" | "Contacted" | "Confirmed" | "Completed" | "Cancelled" };
export type FinanceRecord = { id: string; bookingId: string; quotedAmount: number; discountAmount: number; depositRequired: number; amountPaid: number; paymentStatus: "Unpaid" | "Deposit paid" | "Part paid" | "Paid"; paymentMethod?: string; paymentReference?: string; invoiceStatus: "Not issued" | "Draft" | "Issued" | "Paid"; updatedAt: string };

const equipmentCollection = collection(db, "equipment");
const specialCollection = collection(db, "specials");
const mediaCollection = collection(db, "homeMedia");
const bookingCollection = collection(db, "bookingRequests");
const financeCollection = collection(db, "financeRecords");

export async function getEquipment(): Promise<EquipmentItem[]> { const snapshot = await getDocs(equipmentCollection); return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<EquipmentItem, "id">) })); }
export async function saveEquipmentRecord(item: EquipmentItem) { await setDoc(doc(db, "equipment", item.id), item); }
export async function deleteEquipmentRecord(id: string) { await deleteDoc(doc(db, "equipment", id)); }
export async function seedEquipmentRecords(items: EquipmentItem[]) { for (const item of items) await saveEquipmentRecord(item); }

export async function getSpecials(publicOnly = false): Promise<SpecialRecord[]> { const snapshot = await getDocs(publicOnly ? query(specialCollection, where("active", "==", true)) : specialCollection); return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<SpecialRecord, "id">) })); }
export async function saveSpecialRecord(item: SpecialRecord) { await setDoc(doc(db, "specials", item.id), item); }
export async function deleteSpecialRecord(id: string) { await deleteDoc(doc(db, "specials", id)); }

export async function getHomeMedia(publicOnly = false): Promise<HomeMediaRecord[]> { const snapshot = await getDocs(publicOnly ? query(mediaCollection, where("active", "==", true)) : mediaCollection); return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<HomeMediaRecord, "id">) })).sort((a, b) => a.order - b.order); }
export async function saveHomeMediaRecord(item: HomeMediaRecord) { await setDoc(doc(db, "homeMedia", item.id), item); }
export async function deleteHomeMediaRecord(id: string) { await deleteDoc(doc(db, "homeMedia", id)); }

export async function createBookingRequest(data: Omit<BookingRequestRecord, "id">) { const result = await addDoc(bookingCollection, data); return result.id; }
export async function getBookingRequests(): Promise<BookingRequestRecord[]> { const snapshot = await getDocs(bookingCollection); return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<BookingRequestRecord, "id">) })); }
export async function updateBookingStatus(id: string, status: BookingRequestRecord["status"]) { await updateDoc(doc(db, "bookingRequests", id), { status }); }
export async function clearBookingRequests() { const snapshot = await getDocs(bookingCollection); for (const item of snapshot.docs) await deleteDoc(item.ref); }

export async function getFinanceRecords(): Promise<FinanceRecord[]> { const snapshot = await getDocs(financeCollection); return snapshot.docs.map((item) => ({ id: item.id, ...(item.data() as Omit<FinanceRecord, "id">) })); }
export async function getFinanceForBooking(bookingId: string): Promise<FinanceRecord | null> { const snapshot = await getDocs(query(financeCollection, where("bookingId", "==", bookingId))); const item = snapshot.docs[0]; return item ? { id: item.id, ...(item.data() as Omit<FinanceRecord, "id">) } : null; }
export async function saveFinanceRecord(item: FinanceRecord) { await setDoc(doc(db, "financeRecords", item.id), item); }
