export { Title };

function Title({ children }: ITitle) {
	return (
		<>
			<h1 className="font-bold text-2xl">{children}</h1>
		</>
	);
}

interface ITitle {
	children: React.ReactNode;
}
