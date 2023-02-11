import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

import FormInput from '../../../../common/components/FormInput/FormInput';
import validationErrorMap from '../validationErrorMap';
import SpotFormErrors from './SpotFormErrors';

import './CreateSpotForm.css';
import { createSpot } from '../../spotsSlice';

const CreateSpotForm = () => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUser = useSelector((state) => state.user.currentUser);

    // Clears validation errors
    useEffect(() => {
        const clearValidationError = (validationError) => {
            setValidationErrors((validationErrors) => {
                const newValidationErrors = validationErrors.filter(
                    (error) => error !== validationError
                );

                return newValidationErrors;
            });
        };

        if (name) {
            clearValidationError('Name is required');
        }

        if (description) {
            clearValidationError('Description is required');
        }

        if (address) {
            clearValidationError('Street address is required');
        }

        if (city) {
            clearValidationError('City is required');
        }

        if (state) {
            clearValidationError('State is required');
        }

        if (country) {
            clearValidationError('Country is required');
        }

        if (latitude) {
            clearValidationError('Latitude is not valid');
        }

        if (longitude) {
            clearValidationError('Longitude is not valid');
        }

        if (price) {
            clearValidationError('Price per day is required');
        }
    }, [
        name,
        description,
        address,
        city,
        state,
        country,
        latitude,
        longitude,
        price,
    ]);

    if (!currentUser) {
        return <Navigate to='/' />;
    }

    const createBtnClicked = async (e) => {
        e.preventDefault();

        let newErrors = [];

        if (!address) {
            newErrors.push('Street address is required');
        }

        if (!city) {
            newErrors.push('City is required');
        }

        if (!state) {
            newErrors.push('State is required');
        }

        if (!country) {
            newErrors.push('Country is required');
        }

        const parsedLat = parseFloat(latitude);
        if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
            newErrors.push('Latitude is not valid');
        }

        const parsedLng = parseFloat(longitude);
        if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
            newErrors.push('Longitude is not valid');
        }

        if (!name) {
            newErrors.push('Name is required');
        }

        if (!description) {
            newErrors.push('Description is required');
        }

        // Maybe add more validations here in the future.. i.e., !isNaN, > 0
        const parsedPrice = parseFloat(price);
        if (!price) {
            newErrors.push('Price per day is required');
        }

        if (name && name.length > 50) {
            newErrors.push('Name must be less than 50 characters');
        }

        if (newErrors.length) {
            return setValidationErrors(newErrors);
        }

        const spot = {
            address,
            city,
            state,
            country,
            lat: parsedLat,
            lng: parsedLng,
            name,
            description,
            price: parsedPrice,
        };

        const response = await dispatch(createSpot(spot));

        if (response.meta.requestStatus !== 'fulfilled') {
            if (response.payload.errors)
                return setErrors(response.payload.errors);

            if (response.payload.message) {
                return alert(response.payload.message);
            }

            return alert('Something went wrong');
        }

        navigate(`/spots/${response.payload.id}`);
    };

    const getValidationError = (name) => {
        return validationErrors.find(
            (error) => validationErrorMap[error] === name
        );
    };

    return (
        <div className='create-spot-form-container'>
            <form id='create-spot-form'>
                <FormInput
                    className='create-spot-form-input'
                    name='name'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    validationError={getValidationError('name')}
                />

                <FormInput
                    className='create-spot-form-input'
                    name='description'
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    validationError={getValidationError('description')}
                />

                <FormInput
                    className='create-spot-form-input'
                    name='address'
                    placeholder='Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    validationError={getValidationError('address')}
                />

                <FormInput
                    className='create-spot-form-input'
                    name='city'
                    placeholder='City'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    validationError={getValidationError('city')}
                />

                <div className='create-spot-form-input-row'>
                    <FormInput
                        className='create-spot-form-input'
                        name='state'
                        placeholder='State'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        validationError={getValidationError('state')}
                    />

                    <FormInput
                        className='create-spot-form-input'
                        name='country'
                        placeholder='Country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        validationError={getValidationError('country')}
                    />
                </div>

                <div className='create-spot-form-input-row'>
                    <FormInput
                        className='create-spot-form-input'
                        name='latitude'
                        placeholder='Latitude'
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        validationError={getValidationError('lat')}
                    />

                    <FormInput
                        className='create-spot-form-input'
                        name='longitude'
                        placeholder='Longitude'
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        validationError={getValidationError('lng')}
                    />
                </div>

                <FormInput
                    className='create-spot-form-input'
                    name='price'
                    placeholder='Price per day'
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    validationError={getValidationError('price')}
                />
            </form>

            <SpotFormErrors
                errors={errors}
                validationErrors={validationErrors}
            />

            <button
                id='create-spot-form-submit-button'
                onClick={createBtnClicked}
            >
                Create
            </button>
        </div>
    );
};

export default CreateSpotForm;
