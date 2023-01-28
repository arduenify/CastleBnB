import './FormInputComponent.css';

const FormInputComponent = ({
    id,
    type = 'text',
    placeholder = 'placeholder',
    value,
    onChange,
}) => {
    return (
        <div className='form-input'>
            <label htmlFor={id}>{placeholder}</label>

            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default FormInputComponent;
