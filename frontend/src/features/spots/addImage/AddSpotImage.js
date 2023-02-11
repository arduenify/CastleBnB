import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { addImageToSpot } from '../spotsSlice';
import FormInput from '../../../common/components/FormInput/FormInput';

import './AddSpotImage.css';

const AddSpotImage = ({ spotId, hideGenericPopup, setSpotImages }) => {
    const dispatch = useDispatch();

    const [imageUrl, setImageUrl] = useState('');
    const [isPreviewImage, setIsPreviewImage] = useState(false);
    const [errors, setErrors] = useState([]);

    const submitBtnClicked = async (e) => {
        e.preventDefault();

        if (!imageUrl) return setErrors(['Image URL is required']);

        const response = await dispatch(
            addImageToSpot({ spotId, imageUrl, isPreviewImage })
        );

        if (response.meta.requestStatus === 'fulfilled') {
            hideGenericPopup();

            const newSpotImage = {
                id: response.payload.id,
                url: response.payload.url,
                preview: response.payload.preview,
            };

            setSpotImages((spotImages) => spotImages.concat(newSpotImage));
        } else {
            setErrors(response.payload.errors);
        }
    };

    useEffect(() => {
        if (errors.length > 0) {
            setErrors([]);
        }
    }, [imageUrl]);

    return (
        <form
            className='add-spot-image-container'
            onSubmit={submitBtnClicked}
        >
            <div className='form-input-container'>
                <FormInput
                    type='text'
                    placeholder='Image URL'
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />

                <input
                    className='form-input-checkbox'
                    type='checkbox'
                    checked={isPreviewImage}
                    onChange={(e) => setIsPreviewImage(e.target.checked)}
                    id='preview-image-checkbox-input'
                />
                <label
                    className='form-input-label'
                    htmlFor='preview-image-checkbox-input'
                    id='preview-image-checkbox-label'
                >
                    Make this image the preview image
                </label>
            </div>
            <div className='add-spot-image-btn-container'>
                <button
                    className='add-spot-image-btn'
                    type='submit'
                >
                    Add image
                </button>
            </div>
            {errors.length > 0 && (
                <div className='add-spot-image-errors-container'>
                    {errors.map((error) => (
                        <p
                            className='add-spot-image-error'
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

export default AddSpotImage;
