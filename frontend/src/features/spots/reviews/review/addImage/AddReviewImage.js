import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { addImageToReview } from '../../reviewsSlice';
import { getSpotReviewsById } from '../../../spotsSlice';
import FormInput from '../../../../../common/components/FormInput/FormInput';

const AddReviewImage = ({ reviewId, hideGenericPopup, spotId, setReviews }) => {
    const dispatch = useDispatch();
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState([]);

    const submitBtnClicked = async (e) => {
        e.preventDefault();

        const response = await dispatch(
            addImageToReview({ reviewId, imageUrl })
        );

        if (response.meta.requestStatus === 'fulfilled') {
            const reviews = await dispatch(getSpotReviewsById(spotId));
            setReviews(reviews.payload.Reviews);

            hideGenericPopup();
        } else {
            setErrors(response.payload.errors);
        }
    };

    return (
        <form
            className='add-review-image-container'
            onSubmit={submitBtnClicked}
        >
            <div className='form-input-container'>
                <FormInput
                    type='text'
                    placeholder='Image URL'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>
            <div className='add-review-image-btn-container'>
                <button
                    className='add-review-image-btn'
                    type='submit'
                >
                    Add image
                </button>
            </div>
            {errors.length > 0 && (
                <div className='add-review-image-errors-container'>
                    {errors.map((error) => (
                        <p
                            className='add-review-image-error'
                            key={error}
                        >
                            {error}
                        </p>
                    ))}
                </div>
            )}
        </form>
    );
};

export default AddReviewImage;
