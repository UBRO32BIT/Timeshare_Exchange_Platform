import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CheckEmailToken } from "../../services/auth.service";

export default function VerifyEmailToken() {
    const [isVerified, setVerified] = useState<boolean>(false);
    const location = useLocation();
    const checkToken = async (token: string) => {
        const data = await CheckEmailToken(token);
        console.log(data);
        if (data) {
            return true;
        }
        return false;
    }
    useEffect(()=> {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");
        console.log(token);
        if (token) {
            const result = checkToken(token)
            console.log(result)
            setVerified(true);
        }
    }, [])
    return (
        <>
            <div className="text-center">
            {isVerified ? <h1>Email Verified</h1> : <h1>Failed to verify email</h1>}
            </div>
        </>
    );
}