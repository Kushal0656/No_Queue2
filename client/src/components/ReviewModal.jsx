import { useState } from 'react';
import { Star, X } from 'lucide-react';
import './ReviewModal.css';

export default function ReviewModal({ isOpen, onClose, shopName = "Raj Barber Shop", onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, feedback });
    }
    onClose();
  };

  return (
    <div className="modal-overlay glass-panel flex-center">
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        
        <div className="text-center mb-6">
          <h2 className="text-gradient">Rate your visit</h2>
          <p className="text-muted mt-2">How was your service at {shopName}?</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="star-rating flex-center mb-6">
            {[...Array(5)].map((star, index) => {
              index += 1;
              return (
                <button
                  type="button"
                  key={index}
                  className={`star-btn ${index <= (hover || rating) ? 'on' : 'off'}`}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(rating)}
                >
                  <Star size={40} fill={index <= (hover || rating) ? 'currentColor' : 'none'} />
                </button>
              );
            })}
          </div>

          <div className="feedback-input-group mb-6">
            <label className="text-muted text-sm mb-2 block">Tell us more (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="What did you like or dislike?"
              rows="4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="btn-primary full-width modal-submit"
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
