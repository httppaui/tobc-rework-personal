import type { PaymentMethodId } from '../types';

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  icon: string;
  description: string;
  detailsTitle: string;
  detailLines: { label: string; value: string }[];
  showQrPlaceholder: boolean;
  qrCaption: string;
  footnote: string;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bank',
    label: 'Bank transfer',
    icon: 'bi-bank2',
    description: 'InstaPay, PESONet, or over-the-counter deposit',
    detailsTitle: 'Pay via bank transfer',
    detailLines: [
      { label: 'Account name', value: 'The Online Booking Corp.' },
      { label: 'Bank', value: 'BDO Unibank (Demo)' },
      { label: 'Account number', value: '0123 4567 8901' },
      { label: 'Reference', value: 'TOBC + your email + course name' },
    ],
    showQrPlaceholder: false,
    qrCaption: '',
    footnote: 'Keep your transfer receipt. Upload a screenshot below after payment.',
  },
  {
    id: 'ewallet',
    label: 'E-wallet',
    icon: 'bi-phone',
    description: 'GCash, Maya, and other e-wallets',
    detailsTitle: 'Pay via e-wallet',
    detailLines: [
      { label: 'Wallet name', value: 'GCash (Demo)' },
      { label: 'Registered name', value: 'TOBC Payments' },
      { label: 'Mobile number', value: '09XX XXX XXXX' },
      { label: 'Reference', value: 'TOBC booking + your name' },
    ],
    showQrPlaceholder: true,
    qrCaption: 'Scan to pay (sample QR)',
    footnote: 'Screenshot your successful send receipt, then upload it below.',
  },
  {
    id: 'gateway',
    label: 'Payment gateway',
    icon: 'bi-credit-card-2-front',
    description: 'Card or online checkout (demo)',
    detailsTitle: 'Online card payment',
    detailLines: [
      { label: 'Provider', value: 'TOBC Secure Checkout (Demo)' },
      { label: 'Cards accepted', value: 'Visa, Mastercard, JCB' },
      { label: 'Status', value: 'Complete transfer below or use gateway when live' },
    ],
    showQrPlaceholder: false,
    qrCaption: '',
    footnote: 'For this demo, upload your payment confirmation screenshot after paying by bank or e-wallet.',
  },
];

export const DEFAULT_PAYMENT_METHOD_ID: PaymentMethodId = 'bank';

export function getPaymentMethod(id: PaymentMethodId | ''): PaymentMethod | undefined {
  return PAYMENT_METHODS.find((m) => m.id === id);
}
