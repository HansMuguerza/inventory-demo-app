export default async function Mikrotik() {
	const res = await fetch(`http://10.2.250.8:799/rest/ppp/secret`, {
		method: "GET",
		headers: { Authorization: "Basic " + btoa("api:apirest") },
	});
	const data = await res.json();

	return (
		<div>
			<div>
				{data &&
					data.map((i: any) => <div key={i[".id"]}>{i.name}</div>)}
			</div>
		</div>
	);
}
