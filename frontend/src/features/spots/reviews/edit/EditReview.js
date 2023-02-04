import ReviewForm from '../common/ReviewForm';

const EditReview = ({ spotId, setReviews, hideGenericPopup, review }) => {
    return (
        <ReviewForm
            formType='edit'
            spotId={spotId}
            review={review}
            setReviews={setReviews}
            hideGenericPopup={hideGenericPopup}
        />
    );
};

export default EditReview;
