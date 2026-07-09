export function assignProduct(slots, slotId, productId) {
  if (!slots.some((slot) => slot.id === slotId)) {
    throw new Error(`slot not found: ${slotId}`);
  }
  return slots.map((slot) =>
    slot.id === slotId ? { ...slot, productId } : slot
  );
}

export function clearSlot(slots, slotId) {
  return assignProduct(slots, slotId, null);
}
