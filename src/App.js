import { useSelector } from "react-redux";
import "./App.css"
import pageRoutes from "./routes/pageRoutes"

function App() {
  // Getting login user details
  const { scrutinizedUser } = useSelector(state => state.usersReducer);

  return (
    <div className="App">
      {/* Pages route here */}
      {pageRoutes(scrutinizedUser)}
    </div>
  )
}

export default App;
