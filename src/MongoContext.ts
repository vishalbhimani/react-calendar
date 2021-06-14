import React from 'react'
const MongoContext = React.createContext<any>({
    app: null,
    client: null,
    user: null,
    setApp: () => {},
    setClient: () => {},
    setUser: () => {}
});

export default MongoContext