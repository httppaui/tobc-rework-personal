import { DEFAULT_PAYMENT_METHOD_ID, getPaymentMethod, PAYMENT_METHODS } from '../data/paymentMethods';
import type { PaymentMethodId } from '../types';

function RequiredMark() {
  return (
    <span className="bf-required" aria-hidden="true">
      {' '}
      *
    </span>
  );
}

type BookingPaymentStepProps = {
  totalLabel: string;
  courseCount: number;
  paymentMethodId: PaymentMethodId | '';
  onPaymentMethodChange: (id: PaymentMethodId) => void;
  paymentProofName: string;
  paymentProofDataUrl: string;
  onPaymentFile: (file: File) => void;
};

export function BookingPaymentStep({
  totalLabel,
  courseCount,
  paymentMethodId,
  onPaymentMethodChange,
  paymentProofName,
  paymentProofDataUrl,
  onPaymentFile,
}: BookingPaymentStepProps) {
  const methodId = paymentMethodId || DEFAULT_PAYMENT_METHOD_ID;
  const method = getPaymentMethod(methodId) ?? PAYMENT_METHODS[0];

  return (
    <>
      <h4>Step 4: Review &amp; payment</h4>
      <p className="booking-pay-instructions">
        Pay <strong>{totalLabel}</strong> for {courseCount === 1 ? 'this course' : `all ${courseCount} courses`} using
        your preferred method, then upload proof of payment.
      </p>

      <fieldset className="booking-pay-methods">
        <legend className="booking-pay-methods-legend">
          Payment method
          <RequiredMark />
        </legend>
        <div className="booking-pay-method-grid" role="radiogroup" aria-label="Payment method">
          {PAYMENT_METHODS.map((m) => {
            const selected = methodId === m.id;
            return (
              <label
                key={m.id}
                className={`booking-pay-method-card${selected ? ' is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={m.id}
                  checked={selected}
                  onChange={() => onPaymentMethodChange(m.id)}
                />
                <i className={`bi ${m.icon}`} aria-hidden />
                <span className="booking-pay-method-label">{m.label}</span>
                <span className="booking-pay-method-desc">{m.description}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="booking-pay-details" aria-live="polite">
        <h5 className="booking-pay-details-title">{method.detailsTitle}</h5>
        <div className="booking-pay-details-layout">
          <div className="booking-pay-details-info">
            <dl className="booking-pay-details-dl">
              {method.detailLines.map((line) => (
                <div key={line.label} className="booking-pay-details-row">
                  <dt>{line.label}</dt>
                  <dd>{line.value}</dd>
                </div>
              ))}
              <div className="booking-pay-details-row booking-pay-details-row--amount">
                <dt>Amount due</dt>
                <dd>{totalLabel}</dd>
              </div>
            </dl>
            <p className="booking-pay-details-footnote">{method.footnote}</p>
          </div>
          {method.showQrPlaceholder && (
            <div className="booking-pay-qr-placeholder" aria-label="Sample QR code for payment">
              <div className="booking-pay-qr-box">
                <i className="bi bi-qr-code" aria-hidden />
                <span>{method.qrCaption}</span>
              </div>
              <p className="booking-pay-qr-note">Sample placeholder — replace with your live QR in production.</p>
            </div>
          )}
          {!method.showQrPlaceholder && method.id === 'bank' && (
            <div className="booking-pay-qr-placeholder booking-pay-qr-placeholder--info" aria-hidden>
              <div className="booking-pay-bank-visual">
                <i className="bi bi-bank2" aria-hidden />
                <span>Bank details</span>
              </div>
            </div>
          )}
          {method.id === 'gateway' && (
            <div className="booking-pay-qr-placeholder booking-pay-qr-placeholder--info" aria-hidden>
              <div className="booking-pay-bank-visual">
                <i className="bi bi-shield-lock" aria-hidden />
                <span>Secure checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bf-field bf-full booking-pay-upload">
        <label htmlFor="bf-payment-proof">
          Payment screenshot
          <RequiredMark />
        </label>
        <input
          id="bf-payment-proof"
          type="file"
          accept="image/*"
          required
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPaymentFile(file);
          }}
        />
        {paymentProofName && (
          <p className="payment-proof-name">
            <i className="bi bi-check-circle-fill" aria-hidden /> {paymentProofName}
          </p>
        )}
        {paymentProofDataUrl && (
          <img src={paymentProofDataUrl} alt="Payment proof preview" className="payment-proof-preview" />
        )}
      </div>
    </>
  );
}
