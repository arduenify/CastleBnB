import ReviewForm from '../../common/ReviewForm/ReviewForm';

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
