import * as React from 'react';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Button from '@mui/joy/Button';
import Grid from '@mui/joy/Grid';
import { useSelector } from 'react-redux';
import { GetAllRequest, AcceptRequest, CancelRequest } from '../../services/admin.services';
import { useNavigate } from 'react-router-dom';

interface RootState {
    auth: {
        isAuthenticated: boolean;
        user: any;
    };
}

export default function RequestList() {
    const user = useSelector((state: RootState) => state?.auth?.user);
    const [requests, setRequests] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        getAllRequest();
    }, []);

    async function getAllRequest() {
        try {
            const allRequests = await GetAllRequest();
            if (allRequests && allRequests.length > 0) {
                console.log("Log all requests:", allRequests);
                setRequests(allRequests);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }

    async function handleAccept(id: string) {
        // Your logic to handle accepting the request goes here
        console.log("Accepted request:", id);
        AcceptRequest(id);
        window.location.reload();
    }

    async function handleCancel(id: string) {
        // Your logic to handle canceling the request goes here
        console.log("Canceled request:", id);
        CancelRequest(id);
        window.location.reload();
    }

    return (
        <Grid container spacing={2} sx={{ flexGrow: 1, mx: { xs: 2, md: 5 }, mt: 2 }}>
            {requests.map((request: any, index: number) => (
                <Grid key={index} xs={12} md={6} lg={4}>
                    <Card>
                        <CardContent>
                            <Typography component="div">
                                Owner: {request.userId}
                            </Typography>
                            <Typography>
                                Post: {request.postId}
                            </Typography>
                            <Typography>
                                Status: {request.status}
                            </Typography>
                            <Typography>
                                Type: {request.type}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            {request.status !== "confirmed" && (
                                <Button onClick={() => handleAccept(request._id)}>Accept</Button>
                            )}
                            {request.status !== "canceled" && (
                                <Button onClick={() => handleCancel(request._id)}>Cancel</Button>
                            )}
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
