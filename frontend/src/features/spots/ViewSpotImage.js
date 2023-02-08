import { useDispatch } from 'react-redux';
import { deleteSpotImageById } from './spotsSlice';

import ViewImage from '../../common/popupImage/ViewImage';

import './ViewSpotImage.css';

const ViewSpotImage = ({
    imageUrl,
    imageId,
    hideGenericPopup,
    spotId,
    isSpotOwner,
}) => {
    const dispatch = useDispatch();

    const deleteSpotImageBtnClicked = async () => {
        const deleteSpotImageResponse = await dispatch(
            deleteSpotImageById({ spotId, imageId })
        );

        hideGenericPopup();

        if (deleteSpotImageResponse.meta.requestStatus === 'rejected') {
            if (deleteSpotImageResponse.payload.message) {
                return alert(deleteSpotImageResponse.payload.message);
            }

            return alert('Something went wrong');
        }
    };

    return (
        <ViewImage
            imageUrl={imageUrl}
            onClick={deleteSpotImageBtnClicked}
            deleteBtnText='Delete spot image'
            hasDeletePrivileges={isSpotOwner}
        />
    );
};

export default ViewSpotImage;
