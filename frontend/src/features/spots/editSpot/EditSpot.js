import { useState } from 'react';
import { useDispatch } from 'react-redux';

import FormInput from '../../../common/components/FormInput/FormInput';
import FormErrors from '../../user/forms/errors/FormErrors';
import { editSpotById } from '../spotsSlice';

const EditSpot = ({ spot, onEdit }) => {
    const dispatch = useDispatch();

    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [zip, setZip] = useState(spot.zip);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [country, setCountry] = useState(spot.country);
    const [price, setPrice] = useState(spot.price);
    const [errors, setErrors] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);

    const errorMap = {
        'Name is required': 'name',
        'Description is required': 'description',
        'Street address is required': 'address',
        'City is required': 'city',
        'State is required': 'state',
        'Country is required': 'country',
        'Latitude is not valid': 'lat',
        'Longitude is not valid': 'lng',
        'Price is required': 'price',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setValidationErrors([]);
        let newErrors = [];

        if (!name) {
            newErrors.push('Name is required');
        }

        if (!description) {
            newErrors.push('Description is required');
        }

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

        const parsedLat = parseFloat(lat);
        if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
            newErrors.push('Latitude is not valid');
        }

        const parsedLng = parseFloat(lng);
        if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
            newErrors.push('Longitude is not valid');
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

        const payload = {
            name,
            description,
            address,
            city,
            state,
            lat: parsedLat,
            lng: parsedLng,
            country,
            price: parsedPrice,
        };

        const response = await dispatch(
            editSpotById({ spotId: spot.id, payload })
        );

        if (response.meta.requestStatus === 'rejected') {
            if (response.payload.errors)
                return setErrors(response.payload.errors);

            if (response.payload.message) {
                return alert(response.payload.message);
            }

            return alert('Something went wrong');
        }

        const updatedSpot = { ...spot, ...payload };

        onEdit(updatedSpot);
    };

    const getValidationError = (name) => {
        return validationErrors.find((error) => errorMap[error] === name);
    };

    return (
        <form
            id='popup-modal-edit-spot-form'
            onSubmit={handleSubmit}
        >
            <div className='form-input-container'>
                <FormInput
                    name={'name'}
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    validationError={getValidationError('name')}
                />

                <FormInput
                    name={'description'}
                    placeholder='Description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    validationError={getValidationError('description')}
                />

                <FormInput
                    name={'address'}
                    placeholder='Address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    validationError={getValidationError('address')}
                />

                <FormInput
                    name={'city'}
                    placeholder='City'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    validationError={getValidationError('city')}
                />

                <FormInput
                    name={'state'}
                    placeholder='State'
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    validationError={getValidationError('state')}
                />

                <FormInput
                    name={'zip'}
                    placeholder='Zip'
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    validationError={getValidationError('zip')}
                />

                <FormInput
                    name={'lat'}
                    placeholder='Latitude'
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    validationError={getValidationError('lat')}
                />

                <FormInput
                    name={'lng'}
                    placeholder='Longitude'
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    validationError={getValidationError('lng')}
                />

                <FormInput
                    name={'country'}
                    placeholder='Country'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    validationError={getValidationError('country')}
                />

                <FormInput
                    name={'price'}
                    placeholder='Price per day'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    validationError={getValidationError('price')}
                />
            </div>

            <button
                className='popup-modal-btn'
                type='submit'
            >
                Edit your spot
            </button>

            <FormErrors
                errors={errors}
                validationErrors={validationErrors}
            />
        </form>
    );
};

export default EditSpot;
