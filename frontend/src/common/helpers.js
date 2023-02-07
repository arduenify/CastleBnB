export const currentUserOwnsSpot = (currentUser, spot) => {
    if (currentUser && spot) {
        return currentUser.id === spot.Owner.id;
    }

    return false;
};
