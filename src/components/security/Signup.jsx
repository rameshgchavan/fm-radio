import { Container, Button, Form } from 'react-bootstrap';
import emailjs from "@emailjs/browser";

import { readUserEmailRequest } from '../../apiRequests/usersAPIs/readUsersAPIs';

// Import actions from redux/actions folder
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { createUserRequest } from '../../apiRequests/usersAPIs';

// This component used by routes/PublicRoutes
// This component checks user credentials and saves new user to database
const Signup = () => {
    const [disabled, setDidsabled] = useState(false);
    const [hidden, setHidden] = useState(true);

    const otpForm = useRef();

    const randomNumber = Math.floor(Math.random() * (1000000 - 1)).toString();
    const emailOTP = useRef(randomNumber);
    const userOTP = useRef(null)
    const adminEmail = useRef("");
    const userName = useRef(null);
    const emailID = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    const sendEmail = async (e) => {
        e.preventDefault();

        const isAdminEmail = await readUserEmailRequest({ Email: adminEmail.current?.trim() });
        const isUserEmail = await readUserEmailRequest({ Email: emailID.current?.trim() });

        if (!isAdmin && isAdminEmail.code == 404) {
            alert(`${adminEmail.current} not found.`)
        }
        else if (isUserEmail.code == 200) {
            alert(`${emailID.current} is already in use, try another one.`)
        }
        else if ((isAdmin && isUserEmail.code == 404) || (!isAdmin && isUserEmail.code == 404 && isAdminEmail.code == 200)) {
            // console.warn(emailOTP);

            emailjs.sendForm('service_6bhhezj', 'template_svo2tbq', otpForm.current, 'llSBBJFE7skawlOYO')
                .then((result) => {
                    console.warn(result.text);
                }, (error) => {
                    console.warn(error.text);
                });

            setDidsabled(true);
            setHidden(false);
        }
        else { alert(isUserEmail) }
    };

    const handleSinup = async (e) => {
        e.preventDefault();

        if (emailOTP.current !== userOTP.current) {
            alert("OTP not matching, check again.")
            return
        }

        if (password.current !== confirmPassword.current) {
            alert("Password not matching, try again.")
            return
        }

        const userDetails = {
            Admin: isAdmin ? "self" : adminEmail.current.trim().replace(".", "-"),
            Status: "pending",
            Name: userName.current,
            Email: emailID.current.trim(),
            Password: password.current.trim(),
            LastLogin: ""
        }

        const user = await createUserRequest(userDetails);

        user.code === 201
            ? alert(`${user.message} Wait for approval or contact to authority.`)
            : user.code === 409
                ? alert(`${user.message} Try another one.`)
                : alert(user);

        user.code === 201
            ? navigate("/")
            : navigate("/signup")
    }

    return (
        <Container style={{ width: "22rem" }} className='border px-4 pt-2 pb-4 shadow' >
            <div className="d-flex flex-column">
                <Button variant="danger" size='sm'
                    className="flex-direction: column align-self-end rounded-5"
                    onClick={() => navigate("/login")}
                >X</Button>
            </div>
            <hr />
            <Form ref={otpForm} onSubmit={sendEmail}>
                <Form.Group className="d-flex flex-wrap gap-2 text-start">
                    <Form.Check type="radio" name="admin" label="User"
                        className="me-sm-3 mb-3 text-danger fw-bold" defaultChecked
                        onClick={() => { setIsAdmin(false) }}
                    />

                    <Form.Check type="radio" name="admin" label="Admin"
                        className="me-sm-3 text-danger fw-bold"
                        onClick={() => setIsAdmin(true)}
                    />
                </Form.Group>

                {!isAdmin &&
                    <Form.Group className="mb-3" controlId="formAdminEmail">
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                        <Form.Floating>
                            <Form.Control name="admin_email" type="text" placeholder="Enter admin email" required
                                disabled={disabled}
                                onChange={(e) => { adminEmail.current = e.target.value }} />
                            <Form.Label className="text-primary fw-bold">Enter admin email</Form.Label>
                        </Form.Floating>
                    </Form.Group>
                }

                <Form.Group className="mb-3" controlId="formBasicUserName">
                    <Form.Floating>
                        <Form.Control name="user_name" type="text" placeholder="Enter user name" required
                            disabled={disabled}
                            onChange={(e) => { userName.current = e.target.value }} />
                        <Form.Label className="text-primary fw-bold">Enter user name</Form.Label>
                    </Form.Floating>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                    <Form.Floating>
                        <Form.Control name="user_email" type="email" placeholder="Enter email" required
                            disabled={disabled}
                            onChange={(e) => { emailID.current = e.target.value }} />
                        <Form.Label className="text-primary fw-bold">Enter email</Form.Label>
                    </Form.Floating>

                    <input name="email_otp" defaultValue={emailOTP.current} hidden />

                    <Button variant="success" type="submit" size='sm' className='mt-2'
                        disabled={disabled}>
                        Send OTP
                    </Button>
                </Form.Group>
            </Form>

            <Form onSubmit={handleSinup} className='mt-3' hidden={hidden}>
                <Form.Group className="my-3" controlId="formBasicOTP">
                    <Form.Text className="text-muted">
                        Check your email for OTP
                    </Form.Text>
                    <Form.Floating>
                        <Form.Control type="text" placeholder="Enter OTP" required
                            onChange={(e) => userOTP.current = e.target.value} />
                        <Form.Label className="text-primary fw-bold">Enter OTP</Form.Label>
                    </Form.Floating>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Floating>
                        <Form.Control type="password" placeholder="Enter new password" required
                            onChange={(e) => password.current = e.target.value} />
                        <Form.Label className="text-primary fw-bold">Enter new password</Form.Label>
                    </Form.Floating>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Floating>
                        <Form.Control type="password" placeholder="Confirm password" required
                            onChange={(e) => confirmPassword.current = e.target.value} />
                        <Form.Label className="text-primary fw-bold">Confirm password</Form.Label>
                    </Form.Floating>
                </Form.Group>

                <Button variant="primary" type="submit" >
                    Signup
                </Button>
            </Form>
        </Container>
    )
}

export default Signup