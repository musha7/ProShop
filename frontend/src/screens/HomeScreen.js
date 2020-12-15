import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';


const HomeScreen = ({ match }) => {

    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList);
    const { loading, error, products, page, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <>
            <Helmet> <title>ProShop</title></Helmet>
            {!keyword ? <ProductCarousel /> : (<Link className='btn btn-dark my-3' to='/' >Go Back</Link>)}
            <h1>Latest products</h1>
            {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) : (
                <>
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={2} lg={2} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
                </>
            )}

        </>
    )
}

export default HomeScreen
