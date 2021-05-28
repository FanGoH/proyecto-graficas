import "./App.css";
import { useState } from "react";
import { TestComponent as Customization } from "./Screens/ModelLoadFrost";
import { TestComponent as Model } from "./Screens/ModelLoad2";
import { MODELS } from "./Screens/MODELS";
import { Almohada } from "./Screens/Modelos/Almohada";
import { Frasco } from "./Screens/Modelos/Frasco";
import { Hoodie } from "./Screens/Modelos/Hoodie";
import { MousePad } from "./Screens/Modelos/Mousepad";

export type ModelNames = keyof typeof MODELS;

function App() {
	const [model, setModel] = useState(0);

	const [preCommitModelName, setPreCommit] = useState<ModelNames>("mousepad");
	const [modelName, setModelName] = useState<ModelNames>("mousepad");

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
			<select
				onChange={(e) => {
					setPreCommit(e.target.value as keyof typeof MODELS);
				}}>
				{Object.keys(MODELS).map((key) => (
					<option key={key} value={key}>
						{key}
					</option>
				))}
			</select>
			<button
				onClick={() => {
					setModelName(preCommitModelName);
				}}>
				Commit Model
			</button>

			{model === 0 ? (
				(modelName === "pillow" && <Almohada />) ||
				(modelName === "frasco" && <Frasco />) ||
				(modelName === "shirt" && <Hoodie />) ||
				(modelName === "mousepad" && <MousePad />)
			) : (
				<Model />
			)}
		</>
	);
}

export default App;
