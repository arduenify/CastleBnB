import './PopupModalComponent.css';

const PopupModalComponent = ({ header, content, setVisible }) => {
    const closeBtnClicked = (e) => {
        e.preventDefault();

        setVisible(false);
    };

    return (
        <div className='popup-modal'>
            <div className='popup-modal-border'>
                <div className='popup-modal-header'>
                    <button
                        className='close-modal-btn'
                        onClick={closeBtnClicked}
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

export default PopupModalComponent;
