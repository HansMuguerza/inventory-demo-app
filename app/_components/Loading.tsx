import { Loader } from "lucide-react";

export default function Loading() {
	return (
		<div className="h-screen w-screen flex p-10 justify-center items-center">
			<div>
				<Loader className="h-8 w-8 animate-spin" />
			</div>
		</div>
	);
}
