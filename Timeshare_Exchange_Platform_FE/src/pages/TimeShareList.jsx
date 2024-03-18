import { useState } from "react";
import { useEffect } from "react";
import { Row, Col, Container } from 'reactstrap'
import TourCard from "../shared/TourCard";
import { useLocation } from 'react-router-dom';
import { GetPost } from "../services/post.service";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Typography } from "@mui/joy";
import SearchBar from "../shared/SearchBar";

const TimeshareList = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [query, setQuery] = useState("");
    const location = useLocation();
    const queryString = location.search;
    const searchParams = new URLSearchParams(queryString);
    const filterPosts = () => {
        const filtered = posts.filter(post => post.resortId.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredPosts(filtered);
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetPost();
                console.log(data);
                setPosts(data);
            }
            catch (error) {
                if (error.response) {
                    console.log(error.response.status)
                } else {
                    console.error("Cannot get data from server!");
                }
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        let queryString = searchParams.get('query');
        if (queryString) {
            setQuery(queryString);
        }
        
        //searchParams.get('startDate');
        //searchParams.get('endDate');
        if (posts && posts.length > 0) {
            filterPosts();
        }
    }, [posts])
    return <>
        <Header/>
        <Container>
            <Row className="d-flex align-items-center justify-content-center">
                <SearchBar props={query}/>
            </Row>
            <Row className="text-center my-3">
                {query ? <h3>Found {filteredPosts.length} posts</h3> : <h3>List of timeshares</h3>}
            </Row>
            <Row>
                {filteredPosts?.map(post => (
                    <Col lg='3' md='6' className='mb-4 position-relative'>
                        <TourCard props={post}/>
                    </Col>
                ))}
            </Row>
        </Container>
        <Footer/>
    </>
}

export default TimeshareList;