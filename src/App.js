import { useSelector } from "react-redux";
import "./App.css"
import pageRoutes from "./routes/pageRoutes"

function App() {
  const { scrutinizedUser } = useSelector(state => state.usersReducer);

  return (
    <div className="App">
      {pageRoutes(scrutinizedUser)}
    </div>
  )
}

export default App;
