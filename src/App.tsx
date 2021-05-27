import "./App.css";
import { useState } from "react";
import { TestComponent as Customization } from "./Screens/ModelLoadFrost";
import { TestComponent as Model } from "./Screens/ModelLoad";

function App() {
	const [model, setModel] = useState(0);

	const handleChange = (e: number) => {
		setModel(e);
	};

	return (
		<>
			<p> Select Demo </p>
			<button onClick={() => handleChange(0)} disabled={model === 0}>
				{" "}
				Change texture{" "}
			</button>
			<button onClick={() => handleChange(1)} disabled={model === 1}>
				{" "}
				Model load{" "}
			</button>
			<hr />
			{model === 0 ? <Customization /> : <Model />}
		</>
	);
}

export default App;
