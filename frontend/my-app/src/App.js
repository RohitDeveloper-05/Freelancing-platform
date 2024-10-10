import { RouterProvider} from "react-router-dom";

import router from "./components/router/Router";
import "./app.scss"

function App() {

  return (
    <div className="App">
      <RouterProvider router={router} />      
    </div>
  );
}

export default App;
