import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FormErrors = ({ errors, validationErrors }) => {
    return (
        <ul className='popup-modal-errors'>
            {validationErrors &&
                validationErrors
                    .filter((error) => error.msg)
                    .map((error, idx) => (
                        <li
                            className='popup-modal-error'
                            key={idx}
                        >
                            <div className='icon-text-container'>
                                <FontAwesomeIcon icon={faCircleExclamation} />

                                <p className='popup-modal-error-text'>
                                    {error.msg}
                                </p>
                            </div>
                        </li>
                    ))}

            {!validationErrors?.length &&
                errors &&
                errors.map((error, idx) => (
                    <li
                        className='popup-modal-error'
                        key={idx}
                    >
                        <div className='icon-text-container'>
                            <FontAwesomeIcon icon={faCircleExclamation} />

                            <p className='popup-modal-error-text'>{error}</p>
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default FormErrors;
