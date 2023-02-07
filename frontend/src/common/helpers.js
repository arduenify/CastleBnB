export const currentUserOwnsSpot = (currentUser, spot) => {
    if (currentUser && spot) {
        return currentUser.id === spot.Owner.id;
    }

    return false;
};

export const getError = (name, errors) => {
    return errors?.find((error) => error.name === name);
};
