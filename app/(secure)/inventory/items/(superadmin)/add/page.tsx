import { AddEdit } from "_components/items";
import { AddEdit as AddEditItemSerie } from "_components/inventory/items-serie";

export default Add;

function Add() {
	return (
		<div className="flex flex-col gap-y-6">
			<AddEdit title="Agregar Item" />
			{/* <AddEditItemSerie title="Agregar Item con Serie" /> */}
		</div>
	);
}
