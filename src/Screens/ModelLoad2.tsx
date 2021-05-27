import { useRef } from "react";
import {
	useResizableRenderer,
	useThreeInit,
	useThreeJSRefs,
} from "../ThreeFuncs/modelLoadInits";

export const TestComponent = () => {
	const divToMount = useRef<HTMLDivElement>(null);
	const threeRefs = useThreeJSRefs(140);

	useThreeInit(threeRefs, divToMount);

	useResizableRenderer(threeRefs);

	return (
		<>
			<div ref={divToMount} />
		</>
	);
};
