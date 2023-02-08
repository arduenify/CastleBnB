import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addReviewToSpotById, getSpotReviewsById } from '../../spotsSlice';
import { editReviewById } from '../reviewsSlice';

import RatingPicker from './RatingPicker';
import FormInput from '../../../../common/input/FormInput';

const ReviewForm = ({
    formType,
    spotId,
    setReviews,
    hideGenericPopup,
    review: currentReview,
}) => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();

    const [reviewText, setReviewText] = useState(currentReview?.review || '');
    const [rating, setRating] = useState(currentReview?.stars || '');

    const onFormSubmit = (e) => {
        e.preventDefault();

        if (!reviewText || !rating) return;
        if (rating < 1 || rating > 5) return;
        if (reviewText.length > 500) return;
        if (!currentUser) return;

        // Different thunk for add vs edit
        const thunkFunction =
            formType === 'add' ? addReviewToSpotById : editReviewById;

        dispatch(
            thunkFunction({
                review: {
                    id: currentReview?.id,
                    review: reviewText,
                    stars: parseInt(rating),
                },
                spotId,
            })
        ).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                hideGenericPopup();

                dispatch(getSpotReviewsById(spotId)).then((reviews) => {
                    setReviews(reviews.payload.Reviews);
                });
            } else if (res.meta.requestStatus === 'rejected') {
                alert(res.payload.message);
            }
        });
    };

    return (
        <form
            id='add-review-form'
            onSubmit={onFormSubmit}
        >
            <div className='form-input-container'>
                <FormInput
                    name='review'
                    placeholder='Write a review...'
                    value={reviewText}
                    type='textarea'
                    onChange={(e) => setReviewText(e.target.value)}
                />

                <h2 id='rating-header'>Please rate your experience</h2>

                <RatingPicker
                    rating={rating}
                    setRating={setRating}
                />
            </div>

            <button
                id='submit-review-button'
                type='submit'
                disabled={!reviewText || !rating}
            >
                Submit
            </button>
        </form>
    );
};

export default ReviewForm;
