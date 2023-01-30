import { useState, useRef } from 'react';

import './FormInputComponent.css';

const FormInputComponent = ({
    id,
    type = 'text',
    placeholder = 'placeholder',
    value,
    onChange,
}) => {
    const inputRef = useRef(null);
    const [inputActive, setInputActive] = useState(false);

    const inputClicked = (e) => {
        if (inputRef?.current) {
            inputRef.current.focus();
        }

        setInputActive(true);
    };

    return (
        <div
            className='form-input'
            onClick={inputClicked}
            /* Bug fix */
            style={{ pointerEvents: inputActive ? 'none' : 'auto' }}
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
                name={id}
                type={type}
                value={value}
                onBlur={() => setInputActive(false)}
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
