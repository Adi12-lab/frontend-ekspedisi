const storeSession = (key: string, value: string) => {
    return sessionStorage.setItem(key, value)
}

const lookInSession = (key: string)=> {
    return sessionStorage.getItem(key)
}

const removeFromSession = (key: string) => {
    return sessionStorage.removeItem(key)
}

const logOutUser = ()=> {
    return sessionStorage.clear()
}

export {storeSession, lookInSession, removeFromSession, logOutUser}