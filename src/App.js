import { useSelector } from "react-redux";
import "./App.css"
import pageRoutes from "./routes/pageRoutes"

function App() {
  // const scrutinizedUser = {
  //   token: "token"
  // };

  const { scrutinizedUser } = useSelector(state => state.usersReducer);

  return (
    <div className="mt-3">
      {pageRoutes(scrutinizedUser)}
    </div>
  )
}

export default App;
