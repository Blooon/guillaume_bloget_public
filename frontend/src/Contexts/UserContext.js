import React from 'react';

const user = {
    connected: false,
    basket: [],
    lang: "fr"
}

export const UserContext = React.createContext(user);
