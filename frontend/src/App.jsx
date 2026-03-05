import { useEffect } from "react";
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from "@clerk/clerk-react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import { useUser } from "@clerk/clerk-react";
import { Toaster, toast } from "react-hot-toast";


function App() {

  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);

    fetch(`${import.meta.env.VITE_API_URL}/books`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log("FETCH ERROR:", err));
  }, []);

  const {isSignedIn} = useUser();

return (
  <>
  <Routes>

    <Route path="/" element={<HomePage/>} />
    <Route path="/problems" element={isSignedIn ? <ProblemsPage/> : <Navigate to={"/"} />} />
   
  </Routes>
   <Toaster toastOptions={{duration: 3000}}/>
  </>
);

}

export default App;


