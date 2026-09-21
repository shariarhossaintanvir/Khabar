import React, { useState } from 'react';
import { X, Star, UploadCloud, ThumbsUp, Check } from 'lucide-react';
import { useKhabar } from '../../context/KhabarContext';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, reviewOrderTarget, submitReview } = useKhabar();

  const [rating, setRating] = useState(5);
  const [foodQuality, setFoodQuality] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [valueRating, setValueRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);

  if (!isReviewModalOpen || !reviewOrderTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(rating, comment, foodQuality, deliveryRating, packagingRating, valueRating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">How was your meal?</h3>
            <p className="text-xs text-slate-500">
              Order #{reviewOrderTarget.id} from {reviewOrderTarget.restaurantName}
            </p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Overall Stars */}
          <div className="text-center py-2">
            <span className="text-xs font-bold text-slate-600 block mb-2">Overall Experience</span>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform active:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Sub-criteria */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">Food Taste & Quality</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setFoodQuality(s)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      s <= foodQuality ? 'bg-amber-400 text-white' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">Rider Delivery Speed</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setDeliveryRating(s)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      s <= deliveryRating ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">Packaging & Warmth</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setPackagingRating(s)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      s <= packagingRating ? 'bg-indigo-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-600 block mb-1">Value for Money</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setValueRating(s)}
                    className={`w-6 h-6 rounded text-xs font-bold ${
                      s <= valueRating ? 'bg-brand-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other Dhaka foodies what made this meal great..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Upload photo simulation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Upload Food Photo</label>
            <button
              type="button"
              onClick={() => setPhotoUploaded(!photoUploaded)}
              className={`w-full py-4 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                photoUploaded
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 hover:border-brand-400 text-slate-600'
              }`}
            >
              {photoUploaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Photo Attached: biryani_feast.jpg (Click to remove)</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 text-brand-500" />
                  <span>Attach food image to help community</span>
                </>
              )}
            </button>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Submit Review (+50 KHABAR Points)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
