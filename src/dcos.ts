import { hub } from 'dom-native';
import { deepClone } from 'utils-min';
const { assign } = Object;

const dcoHub = hub('dcoHub');

type Ided = { id: number };

/** 
 * dco list options filtering / ordering data result.
 * TODO: NOT IMPLEMENTED YET
 */
interface ListOptions<D> {
	limit?: number;
	offset?: number;
	matches?: Partial<D>;
	orderBy?: keyof D;
}

class DcoMock<E extends Ided>{
	#entity: string;
	#seq = 0;
	#store = new Map<number, E & Ided>();

	constructor(entity: string) {
		this.#entity = entity;
	}

	async create(data: Omit<E, 'id'>) {
		// create and store new data entity
		const id = this.#seq++;
		const dataToStore = assign(deepClone(data), { id }) as E;
		this.#store.set(dataToStore.id, dataToStore);

		// trigger dco create event
		dcoHub.pub(this.#entity, 'create', deepClone(dataToStore));
	}

	async get(id: number): Promise<E | undefined> {
		const storedData = this.#store.get(id);
		return deepClone(storedData);
	}

	async update(id: number, data: Partial<E>) {
		// get the storedData
		if (data.id != null && data.id != id) throw new Error(`DcoProto Update - No data.id ${data.id} does not match with id ${id}`);
		const storedData = this.#store.get(id);
		if (storedData == null) throw new Error(`DcoProto Update - No data found for id ${id}`);

		// assign the new data to it (no deep merge at this point)		
		assign(storedData, deepClone(data));

		// trigger data event
		dcoHub.pub(this.#entity, 'update', deepClone(storedData));
	}

	/** 
	 * TODO: listOptions not implemented yet 
	 **/
	async list(opts?: ListOptions<E>): Promise<(Partial<E> & Ided)[]> {
		const dataList: (Partial<E> & Ided)[] = [];

		for (const entity of this.#store.values()) {
			dataList.push(deepClone(entity));
		}

		// NOTE: For now, just default to a desc on "create order"
		return dataList.reverse();
	}

	async remove(id: number): Promise<boolean> {
		let didRemove = false;

		// remove data if found
		const dataToRemove = await this.get(id);
		if (dataToRemove) {
			this.#store.delete(id);
			didRemove = true;
		}

		// trigger data event
		dcoHub.pub(this.#entity, 'delete', deepClone(dataToRemove));

		return didRemove;
	}
}

//#region    ---------- Task DCO ---------- 
export interface Task {
	id: number;
	title: string;
	fav?: boolean;
	done?: boolean;
}

export const taskDco = new DcoMock<Task>('Task');

// mock data
taskDco.create({ title: 'One', fav: true });
taskDco.create({ title: 'two', done: true });
taskDco.create({ title: 'Three' });
//#endregion ---------- /Task DCO ----------
