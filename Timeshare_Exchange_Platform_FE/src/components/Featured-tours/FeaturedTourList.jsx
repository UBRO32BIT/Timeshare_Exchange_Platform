import React from 'react'
import TourCard from '../../shared/TourCard'
import tourData from '../../assets/data/tours'
import { Col } from 'reactstrap'

const FeaturedTourList = ({posts}) => {
  console.log(posts);
  return (
    <>
    {
        posts?.map(post => (
            <Col lg='3' className='mb-4'>
                <TourCard props={post}/>
            </Col>
        ))
    }
    </>
  )
}

export default FeaturedTourList