import './PopupModal.css';

const PopupModal = ({ header, content, onClose, type }) => {
    let style = {};

    if (type === 'review-image-popup') {
        style = {
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
        };
    }

    if (type === 'edit-spot-popup') {
        style = {
            maxWidth: '90vw',
            maxHeight: '90vh',
            height: 'auto',
            width: '800px',
            overflowY: 'auto',
        };
    }

    return (
        <div
            className='popup-modal'
            style={{ ...style }}
        >
            <div className='popup-modal-border'>
                <div className='popup-modal-header'>
                    <button
                        className='close-modal-btn'
                        onClick={onClose}
                    >
                        &times;
                    </button>
                    <h6 className='popup-modal-header-text'>{header}</h6>
                </div>
            </div>

            <div className='popup-modal-body'>{content}</div>
        </div>
    );
};

export default PopupModal;
