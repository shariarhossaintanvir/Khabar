import React, { useState } from 'react';
import {
  X,
  Clock,
  Phone,
  MapPin,
  ChefHat,
  Bike,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Star,
  Plus,
} from 'lucide-react';
import { OrderRecord, useKhabar } from '../../context/KhabarContext';
import { MenuItem, FOOD_CATEGORIES } from '../../data/khabarData';
import { StatusBadge } from '../shared/StatusBadge';

// =========================================================================
// 1. KITCHEN ORDER DETAILS DRAWER / MODAL
// =========================================================================
interface OrderDetailsModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onAdvanceStatus: (orderId: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onAdvanceStatus,
}) => {
  if (!order) return null;

  const nextAction =
    order.status === 'PLACED' || order.status === 'CONFIRMED'
      ? { label: 'Start Preparing Dish', next: 'PREPARING' }
      : order.status === 'PREPARING'
      ? { label: 'Mark Ready for Pickup', next: 'PICKED_UP' }
      : order.status === 'PICKED_UP'
      ? { label: 'Handover to Rider', next: 'ON_THE_WAY' }
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between pr-8">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-black text-xl text-slate-900">
                Order #{order.id}
              </h3>
              <StatusBadge status={order.status} size="sm" pulse />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed at {order.placedAt} • {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Customer & Delivery info */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Customer:</span>
            <strong className="text-slate-800">{order.customerName} ({order.customerPhone})</strong>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-slate-500">Delivery Address:</span>
            <span className="text-slate-800 text-right font-medium max-w-xs">{order.deliveryAddress}</span>
          </div>
          {order.deliveryInstructions && (
            <div className="pt-2 border-t border-slate-200/60 text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/60 font-medium">
              ⚠️ <strong>Special Note:</strong> {order.deliveryInstructions}
            </div>
          )}
        </div>

        {/* Assigned Rider Info */}
        <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-slate-900">
                {order.riderName || 'Dhaka Dispatch Assigning Rider'}
              </h5>
              <p className="text-[11px] text-slate-500">{order.riderPhone || 'Contact hotline available on dispatch'}</p>
            </div>
          </div>
          {order.riderPhone && (
            <a
              href={`tel:${order.riderPhone}`}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Item Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Kitchen Preparation Checklist ({order.items.length} dishes)
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {order.items.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-700 font-black text-xs flex items-center justify-center shrink-0">
                    {item.quantity}x
                  </span>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{item.menuItem.name}</h5>
                    {item.selectedSize && (
                      <span className="text-[11px] text-slate-400">Size: {item.selectedSize} </span>
                    )}
                    {item.selectedAddOns?.length ? (
                      <span className="text-[11px] text-brand-600 font-medium">
                        + {item.selectedAddOns.map((a) => a.name).join(', ')}
                      </span>
                    ) : null}
                  </div>
                </div>
                <strong className="text-xs font-black text-slate-900">৳{item.itemTotal}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>৳{order.subtotal}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Promo Discount:</span>
              <span>-৳{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
            <span>Order Total:</span>
            <span>৳{order.total}</span>
          </div>
        </div>

        {/* Action Button */}
        {nextAction && (
          <div className="pt-2">
            <button
              onClick={() => {
                onAdvanceStatus(order.id);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xs hover:shadow-brand transition-all active:scale-95"
            >
              {nextAction.label} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 2. REPLY TO CUSTOMER REVIEW MODAL
// =========================================================================
interface ReplyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  customerName: string;
  comment: string;
  onReply: (reviewId: string, replyText: string) => void;
}

export const ReplyReviewModal: React.FC<ReplyReviewModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  customerName,
  comment,
  onReply,
}) => {
  const [replyText, setReplyText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(reviewId, replyText.trim());
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-900 tracking-tight">
            Reply to {customerName}
          </h3>
          <p className="text-xs text-slate-500">
            Your response will be visible on your restaurant profile in the Customer App.
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 italic">
          "{comment}"
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Restaurant Owner Response:
            </label>
            <textarea
              required
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Thank you for dining with us! We appreciate your kind words..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs hover:shadow-brand transition-all"
            >
              Post Official Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
