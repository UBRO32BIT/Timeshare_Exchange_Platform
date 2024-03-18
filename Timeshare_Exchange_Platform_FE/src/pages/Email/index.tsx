import { Route, Routes } from "react-router-dom";
import VerifyEmail from "../../components/Email/VerifyEmail";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Email() {
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/verify-email" element={<VerifyEmail />} />
            </Routes>
            <Footer/>
        </>
    );
}