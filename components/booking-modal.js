/** Course booking overlay */

export function openBooking(title, price, center, loc, date, dur, cat) {
  document.getElementById('bModalTitle').textContent = 'Booking: ' + title;
  document.getElementById('bSumTitle').textContent = title;
  document.getElementById('bSumCenter').textContent = center;
  document.getElementById('bSumLoc').textContent = loc;
  document.getElementById('bSumDate').textContent = date;
  document.getElementById('bSumDur').textContent = dur;
  document.getElementById('bSumCat').textContent = cat;
  document.getElementById('bSumPrice').textContent = price;
  const bc = document.getElementById('bcStepLabel');
  if (bc) bc.textContent = `Your details · ${date} · ${loc} (step 2 of 4)`;
  document.getElementById('bookingOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function closeBooking() {
  document.getElementById('bookingOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

export function closeBookingBg(e) {
  if (e.target === document.getElementById('bookingOverlay')) closeBooking();
}
