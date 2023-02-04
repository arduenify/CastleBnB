import './PopupModal.css';

const PopupModal = ({ header, content, onClose, size = {} }) => {
    const { width = 600, height = 'auto' } = size;

    return (
        <div
            className='popup-modal'
            style={{ width, height }}
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
