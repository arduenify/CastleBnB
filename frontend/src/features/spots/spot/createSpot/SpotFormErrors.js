const SpotFormErrors = ({ errors, validationErrors }) => {
    if (errors.length > 0) {
        return (
            <div className='create-spot-form-errors-container'>
                {errors.map((error) => (
                    <p
                        className='create-spot-form-error'
                        key={error}
                    >
                        {error}
                    </p>
                ))}
            </div>
        );
    }

    if (Object.keys(validationErrors).length > 0) {
        return (
            <div className='create-spot-form-errors-container'>
                {Object.values(validationErrors).map((error) => (
                    <p
                        className='create-spot-form-error'
                        key={error}
                    >
                        {error}
                    </p>
                ))}
            </div>
        );
    }

    return null;
};

export default SpotFormErrors;
