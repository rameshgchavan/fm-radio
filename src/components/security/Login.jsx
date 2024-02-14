import { Container, Button, Form, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import { useDispatch } from 'react-redux';

import { readUserRequest } from '../../apiRequests/usersAPIs';

// redux actions
import { addScrutinizedUserAction } from '../../redux/features/usersSlice';
import { updateSocketAction } from "../../redux/features/socketSlice";
import { changeLoadingAction } from "../../redux/features/loadingSlice";

// component
import LoadingModal from '../modals/LoadingModal';

// This component used by routes/PublicRoutes
// This component checks user credentials
import io from "socket.io-client";
const socket = io.connect("/");

const Login = () => {
    const emailID = useRef(null);
    const password = useRef(null);

    const navigate = useNavigate();

    // Create object of useDispatch method
    const dispatch = useDispatch();

    // This function called on form's submit button (Login) clicked
    const handleLogin = async (e) => {
        e.preventDefault();

        const crediantials = {
            email: emailID.current,
            password: password.current.toString()
        }

        const user = await readUserRequest(crediantials);

        if (user.code === 404) {
            alert(user.message);
            return
        }

        if (user.code === 403) {
            alert("Password not matching, please check again.")
            return
        }

        // update redux to show loading modal
        dispatch(changeLoadingAction(true));

        dispatch(updateSocketAction(socket));

        // update user redux
        // dispatch(authenticateUserAction(user));
        dispatch(addScrutinizedUserAction(user));

        // update redux to hide loading modal
        dispatch(changeLoadingAction(false));

        // navigate to user or customer page
        navigate("/private/broadcast");
    }

    return (
        <>
            <Container style={{ width: "22rem" }} className='border rounded p-4 shadow' >
                <Form onSubmit={handleLogin} className='d-flex flex-column justify-content-center'>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>

                    <Form.Floating className="mb-4">
                        <Form.Control name="email" type="email" placeholder="Enter email" required
                            onChange={(e) => emailID.current = e.target.value}
                        />
                        <Form.Label className="text-primary fw-bold">Enter email</Form.Label>
                    </Form.Floating>

                    <Form.Floating className="mb-4">
                        <Form.Control name="password" type="password" placeholder="Enter password" required
                            onChange={(e) => password.current = e.target.value}
                        />
                        <Form.Label className="text-primary fw-bold">Enter password</Form.Label>
                    </Form.Floating>

                    < Button variant="primary" type="submit" >
                        Login
                    </Button>
                </Form>

                <Nav className='d-flex justify-content-center mt-4'>
                    <Nav.Link onClick={() => navigate("/forgotpass")}>Forgot password</Nav.Link>
                </Nav>
            </Container >

            {/* showing loading modal if that taking time */}
            < LoadingModal />
        </>
    )
}

export default Login