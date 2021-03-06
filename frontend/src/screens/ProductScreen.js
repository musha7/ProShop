import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet';
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constans/productConstans'


const ProductScreen = ({ history, match }) => {
    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { loading: loadingReviewCreate, error: errorReviewCreate, success: successReviewCreate } = productReviewCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (successReviewCreate) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(match.params.id))
    }, [dispatch, match, successReviewCreate])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandle = (e) => {
        e.preventDefault()
        dispatch(createProductReview(match.params.id, { rating, comment }))
    }
    return (
        <>
            <Link className='btn btn-dark my-3' to='/' >Go Back</Link>
            {loading ? (<Loader />) : error ? (<Message variant='danger'>{error}</Message>) :
                (
                    <>
                        <Helmet> <title> {`${product.name}`}</title></Helmet>
                        <Row>
                            <Col md={5}>
                                <Image src={product.image} alt={product.name} fluid />
                            </Col>
                            <Col md={4}>
                                <ListGroup variant='flush'>
                                    <ListGroupItem>
                                        <h3>{product.name}</h3>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <Rating value={product.rating}
                                            text={`${product.numReviews} reviews`} />
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Price: ${product.price}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Description: {product.description}
                                    </ListGroupItem>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>
                                                    Price:
                                        </Col>
                                                <Col>
                                                    ${product.price}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Row>
                                                <Col>
                                                    Status:
                                        </Col>
                                                <Col>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroupItem>
                                        {product.countInStock > 0 && (
                                            <ListGroupItem>
                                                <Row>
                                                    <Col>Qty</Col>
                                                    <Col>
                                                        <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroupItem>
                                        )}

                                        <ListGroupItem>
                                            <Button className='btn-block' onClick={addToCartHandler} type='button' disabled={product.countInStock === 0}>Add To Cart</Button>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <h2>Reviews</h2>
                                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                                <ListGroup variant='flush'>
                                    {product.reviews.map(review => (
                                        <ListGroup.Item key={review._id}>
                                            <strong>{review.name} </strong>
                                            <Rating value={review.rating} />
                                            <p>{review.createdAt.substring(1, 10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                        <h2>Write a Customer Review</h2>
                                        {successReviewCreate && (
                                            <Message variant='success'>
                                                Review submitted successfully
                                            </Message>
                                        )}
                                        {loadingReviewCreate && <Loader />}
                                        {errorReviewCreate && (
                                            <Message variant='danger'>{errorReviewCreate}</Message>
                                        )}
                                        {userInfo ? (
                                            <Form onSubmit={submitHandle}>
                                                <Form.Group controlId='rating'>
                                                    <Form.Label>Rating</Form.Label>
                                                    <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                                                        <option value=''>Select...</option>
                                                        <option value='1'>1 - Poor</option>
                                                        <option value='2'>2 - Fair</option>
                                                        <option value='3'>3 - Good</option>
                                                        <option value='4'>4 - Very Good</option>
                                                        <option value='5'>5 - Excellent</option>
                                                    </Form.Control>
                                                </Form.Group>
                                                <Form.Group controlId='comment'>
                                                    <Form.Label>Comment</Form.Label>
                                                    <Form.Control
                                                        as='textarea'
                                                        row='3'
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></Form.Control>
                                                </Form.Group>
                                                <Button
                                                    disabled={loadingReviewCreate}
                                                    type='submit'
                                                    variant='primary'>
                                                    Submit
                                                    </Button>
                                            </Form>
                                        ) : <Message>Please <Link to='/login'>Sign In</Link> to write a review</Message>}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </>
                )}
        </>
    )
}

export default ProductScreen
