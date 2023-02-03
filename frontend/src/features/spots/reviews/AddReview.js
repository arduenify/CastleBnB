import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormInput from '../../../common/input/FormInput';
import RatingPicker from './RatingPicker';

import { addReviewToSpotById, getSpotReviewsById } from '../spotsSlice';

import './AddReview.css';

const AddReview = ({ hideGenericPopup, spotId, setReviews }) => {
    const dispatch = useDispatch();

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');

    const currentUser = useSelector((state) => state.user.currentUser);

    const submitReviewBtnClicked = (e) => {
        e.preventDefault();

        if (!reviewText || !rating) return;
        if (rating < 1 || rating > 5) return;
        if (reviewText.length > 500) return;
        if (!currentUser) return;

        console.log('Spot id is:', spotId);
        dispatch(
            addReviewToSpotById({
                review: {
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
            onSubmit={submitReviewBtnClicked}
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

export default AddReview;
