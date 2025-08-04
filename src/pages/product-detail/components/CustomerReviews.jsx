import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerReviews = ({ reviews, averageRating, totalReviews }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={index < Math.floor(rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[Math.floor(review.rating)]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sortedReviews = [...displayedReviews]?.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b?.rating - a?.rating;
      case 'lowest':
        return a?.rating - b?.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">
          Customer Reviews
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="bg-card border border-border rounded-lg px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>
      {/* Rating Summary */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="text-4xl font-bold text-foreground mb-2">
              {averageRating?.toFixed(1)}
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
              {renderStars(averageRating)}
            </div>
            <div className="text-sm text-muted-foreground">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1]?.map((star) => (
              <div key={star} className="flex items-center space-x-2">
                <span className="text-sm text-foreground w-8">{star}</span>
                <Icon name="Star" size={12} className="text-warning fill-current" />
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${totalReviews > 0 ? (ratingDistribution?.[star] / totalReviews) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {ratingDistribution?.[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Individual Reviews */}
      <div className="space-y-4">
        {sortedReviews?.map((review) => (
          <div key={review?.id} className="bg-card rounded-lg p-6">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="User" size={20} className="text-muted-foreground" />
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{review?.userName}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center space-x-1">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                    </div>
                  </div>
                  {review?.verified && (
                    <div className="flex items-center space-x-1 text-success text-sm">
                      <Icon name="CheckCircle" size={14} />
                      <span>Verified Purchase</span>
                    </div>
                  )}
                </div>

                {/* Review Title */}
                {review?.title && (
                  <h5 className="font-medium text-foreground mb-2">
                    {review?.title}
                  </h5>
                )}

                {/* Review Text */}
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {review?.comment}
                </p>

                {/* Review Images */}
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-smooth">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review?.helpfulCount || 0})</span>
                  </button>
                  <button className="text-muted-foreground hover:text-foreground transition-smooth">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More/Less Button */}
      {reviews?.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews?.length} Reviews`}
          </Button>
        </div>
      )}
      {/* Write Review Button */}
      <div className="text-center pt-4 border-t border-border">
        <Button variant="outline" iconName="Edit" iconPosition="left">
          Write a Review
        </Button>
      </div>
    </div>
  );
};

export default CustomerReviews;