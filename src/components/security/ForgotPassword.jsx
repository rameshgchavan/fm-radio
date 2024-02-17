import { Container, Button, Form } from 'react-bootstrap';
import emailjs from "@emailjs/browser";

// Import actions from redux/actions folder
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { readUserEmailRequest, updateUserPasswordRequest } from '../../apiRequests/usersAPIs';

// This component used by routes/PublicRoutes
// This component reset user login password
const ForgotPassword = () => {
    const [disabled, setDidsabled] = useState(false);
    const [hidden, setHidden] = useState(true);

    const otpForm = useRef();

    const randomNumber = Math.floor(Math.random() * (1000000 - 1)).toString();
    const emailOTP = useRef(randomNumber);
    const userOTP = useRef(null)
    const emailID = useRef(null);
    const newPassword = useRef(null);
    const confirmPassword = useRef(null);

    const navigate = useNavigate();

    // This function called on check emails and send OTP form's submit button (Send OTP) cliked
    // This function varifies the user enterd emails id in database
    const sendEmail = async (e) => {
        e.preventDefault();

        const isEmail = await readUserEmailRequest({ email: emailID.current.trim() });

        if (isEmail.code == 200) {
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
        else if (isEmail.code == 404) {
            alert(isEmail.message);
        }
        else { alert(isEmail) }
    };

    // This function called on reset password form's submit button (Reset) cliked
    // This function varifies passwords and OTPs and updated password in database
    // Users: routes/publicRoutes.js
    const handleReset = async (e) => {
        e.preventDefault();

        if (emailOTP.current !== userOTP.current) {
            alert("OTP not matching, check again.")
            return
        }

        if (newPassword.current !== confirmPassword.current) {
            alert("Password not matching, try again.")
            return
        }

        const userCredentails = {
            email: emailID.current.trim(),
            password: newPassword.current.trim(),
        }

        const user = await updateUserPasswordRequest(userCredentails);

        if (user.code === 202) {
            alert("Password changed successfully.");
            navigate("/login");
        }
        else { navigate("/forgotpass"); }

    }

    return (
        <Container style={{ width: "22rem" }} className='border px-4 pt-2 pb-4 shadow mt-3' >
            {/* Close button */}
            <div className="d-flex flex-column">
                <Button variant="danger" size='sm'
                    className="flex-direction: column align-self-end rounded-5"
                    onClick={() => navigate("/login")}
                >X</Button>
            </div>
            <hr />

            {/* Check Emails and send OTP */}
            <Form ref={otpForm} onSubmit={sendEmail}>
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

            {/* Reset password */}
            <Form onSubmit={handleReset} className='mt-3' hidden={hidden}>
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

                <Form.Group className="mb-3" controlId="formBasicNewPassword">
                    <Form.Floating>
                        <Form.Control type="password" placeholder="Enter new password" required
                            onChange={(e) => newPassword.current = e.target.value} />
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
                    Reset
                </Button>
            </Form>
        </Container>
    )
}

export default ForgotPassword