// import { useContext, createContext, useState } from "react";

// const AuthContext = createContext();

// export function useAuth() {
//     return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//     const [currentUser, setCurrentUser] = useState();
//     const [loading, setLoading] = useState(true);

//     return (
//         <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
//             {!loading && children}
//         </AuthContext.Provider>
//     )
// }
