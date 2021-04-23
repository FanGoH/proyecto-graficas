import { useState, useLayoutEffect } from "react";

const useWindowSize = (offSet = 0) => {
	const [size, setSize] = useState<[number, number]>([0, 0]);
	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth - offSet, window.innerHeight - offSet]);
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, [offSet]);
	return size;
};

export default useWindowSize;
