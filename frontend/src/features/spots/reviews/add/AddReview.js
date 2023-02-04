import ReviewForm from '../common/ReviewForm';

import './AddReview.css';

const AddReview = ({ hideGenericPopup, spotId, setReviews }) => {
    return (
        <ReviewForm
            formType='add'
            spotId={spotId}
            setReviews={setReviews}
            hideGenericPopup={hideGenericPopup}
        />
    );
};

export default AddReview;
