import './ViewImage.css';

const ViewImage = ({
    imageUrl,
    onClick,
    deleteBtnText,
    hasDeletePrivileges,
}) => {
    return (
        <div className='image-popup-container'>
            <div className='image-popup-content'>
                <img
                    className='image-popup-image'
                    src={imageUrl}
                    alt='popup'
                />
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
