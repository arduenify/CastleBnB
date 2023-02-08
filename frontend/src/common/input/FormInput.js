import { useState, useRef, useEffect } from 'react';

import './FormInput.css';

const FormInput = ({
    id,
    name,
    type = 'text',
    placeholder = 'placeholder',
    value,
    onChange,
    validationError,
}) => {
    const inputRef = useRef(null);
    const [inputActive, setInputActive] = useState(false);

    useEffect(() => {
        const input = inputRef?.current;
        const parent = input?.parentElement;

        parent?.classList?.remove('error');

        if (input && validationError) {
            parent.classList.add('error');
        }
    }, [validationError]);

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
            {type !== 'textarea' && (
                <label
                    htmlFor={name}
                    className={value ? 'has-value' : ''}
                >
                    {placeholder}
                </label>
            )}

            {type === 'textarea' ? (
                <textarea
                    ref={inputRef}
                    id={id}
                    name={name}
                    value={value}
                    onBlur={() => setInputActive(false)}
                    onChange={onChange}
                />
            ) : (
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
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
            )}
        </div>
    );
};

export default FormInput;
