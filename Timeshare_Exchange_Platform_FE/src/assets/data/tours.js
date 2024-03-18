import tourImg01 from "../images/tour-img01.jpg";
import tourImg02 from "../images/tour-img02.jpg";
import tourImg03 from "../images/tour-img03.jpg";
import tourImg04 from "../images/tour-img04.jpg";
import tourImg05 from "../images/tour-img05.jpg";
import tourImg06 from "../images/tour-img06.jpg";
import tourImg07 from "../images/tour-img07.jpg";

const tours = [
  {
    id: "01",
    title: "Amiana Resort",
    city: "Nha Trang",
    distance: 300,
    address: "Somewhere in VietNam",
    price: 12.456,
    price2: 199,
    maxGroupSize: 10,
    time: "Jan 10-25 to March 09-24",
    desc: "this is the description",
    reviews: [
      {
        name: "Xuan Tinh",
        rating: 4.8,
      },
      {
        name: "Minh Duc",
        rating: 5.0,
      },
      {
        name: "Minh Tri",
        rating: 4.8,
      },
    ],
    avgRating: 4.9,
    photo: tourImg01,
    newrental: true,
  },
  {
    id: "02",
    title: "Resort VinpearLand",
    city: "Nha Trang",
    distance: 200,
    address: "Somewhere in VietNam",
    price: 11.111,
    price2: 230,
    maxGroupSize: 8,
    time: "Feb 10-25 to June 09-24",
    desc: "this is the description",
    reviews: [
      {
        name: "Minh Duc",
        rating: 4.8,
      },
      {
        name: "Minh Tri",
        rating: 4.8,
      },
    ],
    avgRating: 4.7,
    photo: tourImg02,
    featured: true,
  },
  {
    id: "03",
    title: "DaLat Wonder Resort",
    city: "Da Lat",
    distance: 333,
    address: "Somewhere in VietNam",
    price: 13.333,
    price2: 150,
    maxGroupSize: 8,
    time: "Feb 08-01 to June 09-01",
    desc: "this is the description",
    reviews: [
      {
        name: "Minh Tri",
        rating: 4.6,
      },
    ],
    avgRating: 4.6,
    photo: tourImg03,
    featured: true,
  },
  {
    id: "04",
    title: "Spa Ha Long",
    city: "Ha Long Bay",
    distance: 345,
    address: "Somewhere in VietNam",
    price: 12.345,
    price2: 170,
    maxGroupSize: 8,
    time: "March 08-01 to Sep 09-01",
    desc: "this is the description",
    reviews: [
      {
        name: "Duc Manh",
        rating: 4.8,
      },
    ],
    avgRating: 4.8,
    photo: tourImg04,
    featured: true,
  },
  {
    id: "05",
    title: " Premier Village Ha Long",
    city: "Ha Long Bay",
    distance: 345,
    address: "Somewhere in VietNam",
    price: 19.999,
    price2: 189,
    maxGroupSize: 8,
    time: "March 01-01 to Sep 09-01",
    desc: "this is the description",
    reviews: [
      {
        name: "Nguyen Vu",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg05,
    featured: false,
  },
  {
    id: "06",
    title: "FLC Halong Bay Golf Club",
    city: "Ha Long Bay",
    distance: 333,
    address: "Somewhere in VietNam",
    price: 16.666,
    price2: 299,
    maxGroupSize: 8,
    time: "June 01-01 to Sep 09-01",
    desc: "this is the description",
    reviews: [
      {
        name: "Tan Phuc",
        rating: 4.6,
      },
    ],
    avgRating: 4.6,
    photo: tourImg06,
    featured: false,
  },
  {
    id: "07",
    title: "VILLA BAYFRONT ONGLANG",
    city: "Phu Quoc",
    distance: 500,
    address: "Somewhere in VietNam",
    price: 12.139,
    price2: 279,
    maxGroupSize: 8,
    time: "June 01-01 to Sep 09-01",
    desc: "this is the description",
    reviews: [
      {
        name: "jhon doe",
        rating: 4.6,
      },
    ],
    avgRating: 4.5,
    photo: tourImg07,
    featured: false,
  },
  {
    id: "08",
    title: "InterContinental Phu Quoc",
    city: "Phu Quoc",
    distance: 500,
    address: "Somewhere in VietNam",
    price: 18.888,
    price2: 379,
    maxGroupSize: 8,
    time: "Feb 08-01 to June 09-01",
    desc: "this is the description",
    reviews: [
      
    ],
    avgRating: 4.6,
    photo: tourImg03,
    featured: false,
  },
];

export default tours;
