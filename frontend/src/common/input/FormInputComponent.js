import { useEffect, useRef } from 'react';

import './FormInputComponent.css';

const FormInputComponent = ({
    id,
    type = 'text',
    placeholder = 'placeholder',
    value,
    onChange,
}) => {
    const inputRef = useRef(null);

    const inputClicked = (e) => {
        inputRef?.current?.focus();
    };

    return (
        <div
            className='form-input'
            onClick={inputClicked}
        >
            <label
                htmlFor={id}
                className={value ? 'has-value' : ''}
            >
                {placeholder}
            </label>

            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                onChange={(e) => {
                    const input = e.target;
                    const label = inputRef?.current?.nextSibling;

                    if (!label) {
                        return onChange(e);
                    }

                    const addHasValueClass = (element) =>
                        element.classList.add('has-value');

                    const removeHasValueClass = (element) =>
                        element.classList.remove('has-value');

                    if (input.value !== '') {
                        addHasValueClass(input);
                        addHasValueClass(label);
                    } else {
                        removeHasValueClass(input);
                        removeHasValueClass(label);
                    }

                    return onChange(e);
                }}
            />
        </div>
    );
};

export default FormInputComponent;
