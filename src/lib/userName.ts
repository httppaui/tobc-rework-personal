/** Split a display name into first name and remainder (family / middle + family). */
export function splitDisplayName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

export function bookingContactFromUser(user: { name: string; email: string }) {
  const { firstName, lastName } = splitDisplayName(user.name);
  return { firstName, lastName, email: user.email };
}

/** Fill empty booking contact fields from the signed-in account (never overwrites edits). */
export function mergeBookingContactFromUser(
  booking: { firstName: string; lastName: string; email: string },
  user: { name: string; email: string } | null,
): { firstName: string; lastName: string; email: string } {
  if (!user) return booking;
  const contact = bookingContactFromUser(user);
  return {
    firstName: booking.firstName.trim() || contact.firstName,
    lastName: booking.lastName.trim() || contact.lastName,
    email: booking.email.trim() || contact.email,
  };
}
