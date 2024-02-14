import { Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

// This page used by routes/PagesRoutes
// This page navigate to home route if path maltyped
const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>404: Page Not Found</h1>

            <Button className="mt-5"
                onClick={() => navigate("/login")}
            >
                Click here to Login
            </Button>
        </div>
    )
}

export default PageNotFound