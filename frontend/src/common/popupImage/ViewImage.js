import './ViewImage.css';

const ViewImage = ({
    imageUrl,
    onClick,
    deleteBtnText,
    hasDeletePrivileges,
}) => {
    const validImage =
        imageUrl &&
        imageUrl !== '' &&
        imageUrl !== '/images/' &&
        !imageUrl.includes('/images/default-spot-image.png');

    return (
        <div className='image-popup-container'>
            <div className='image-popup-content'>
                {!validImage && (
                    <p className='image-popup-default-text'>
                        Unable to fetch the image. You can still delete it,
                        however.
                    </p>
                )}

                {validImage && (
                    <img
                        className='image-popup-image'
                        src={imageUrl}
                        alt='popup'
                    />
                )}
            </div>

            {hasDeletePrivileges && (
                <button
                    id='delete-image-btn'
                    className='image-popup-button'
                    onClick={onClick}
                >
                    {deleteBtnText}
                </button>
            )}
        </div>
    );
};

export default ViewImage;
