import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Tag,
  SimpleTooltip,
  Icon,
} from '@sicaho-collab/ui-web'
import { calculateFeeBreakdown, formatCurrency } from '@/modules/hiring/post-gig-v3/fee-utils'
import { formatDate, STATUS_TAG_CLASS, isDownloadable, getDownloadLabel, downloadPaymentDocument } from './finance-data'
import type { PaymentRow } from './finance-data'

interface PaymentDetailDialogProps {
  payment: PaymentRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PaymentDetailDialog({ payment, open, onOpenChange }: PaymentDetailDialogProps) {
  const navigate = useNavigate()

  if (!payment) return null

  const breakdown = calculateFeeBreakdown(payment.amount)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            Fee breakdown for this payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Gig info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-m3-on-surface">{payment.gigTitle}</p>
              <p className="text-xs text-m3-on-surface-variant font-mono">{payment.id}</p>
            </div>
            <Tag className={STATUS_TAG_CLASS[payment.status]}>
              {payment.status}
            </Tag>
          </div>

          <p className="text-xs text-m3-on-surface-variant">
            {formatDate(payment.date)}
          </p>

          {/* Fee breakdown */}
          <div className="rounded-m3-md border border-m3-outline-variant p-4 space-y-3">
            <h4 className="text-sm font-medium text-m3-on-surface">Fee Breakdown</h4>

            <div className="space-y-2 text-sm">
              <FeeRow label="Student Payment (incl. super)" amount={breakdown.studentPayment} />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-m3-on-surface-variant">
                  Alumable Service Fee (12%)
                  <SimpleTooltip
                    text="This fee covers platform operations, student verification, and employer support."
                    position="top"
                  >
                    <button type="button" className="text-m3-on-surface-variant/60 hover:text-m3-on-surface-variant">
                      <Icon name="info" size={14} />
                    </button>
                  </SimpleTooltip>
                </span>
                <span className="font-medium text-m3-on-surface tabular-nums">
                  {formatCurrency(breakdown.serviceFee)}
                </span>
              </div>

              <FeeRow label="Processing Fee (1.7%)" amount={breakdown.processingFee} />
              <FeeRow label="GST (10% of fees)" amount={breakdown.gst} />

              <hr className="border-m3-outline-variant" />

              <div className="flex items-center justify-between font-semibold">
                <span className="text-m3-on-surface">Total Gig Cost</span>
                <span className="text-m3-on-surface tabular-nums">{formatCurrency(breakdown.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="text" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {isDownloadable(payment.status) && (
            <Button variant="outlined" onClick={() => downloadPaymentDocument(payment)}>
              <Icon name="download" />
              {getDownloadLabel(payment.status)}
            </Button>
          )}
          <Button variant="tonal" onClick={() => { onOpenChange(false); navigate(`/hiring/${payment.gig_id}`) }}>
            View Gig
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FeeRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-m3-on-surface-variant">{label}</span>
      <span className="font-medium text-m3-on-surface tabular-nums">{formatCurrency(amount)}</span>
    </div>
  )
}
