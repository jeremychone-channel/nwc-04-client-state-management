import { adoptStyleSheets, BaseHTMLElement, css, customElement, html, HubEventInfo, OnEvent, onEvent, onHub } from 'dom-native';
import { TaskComponent } from './c-task';
import { Task, taskDco } from './dcos';
const { assign } = Object;

const _shadowCss = css`

	:host {
		display: grid;
		grid-template-rows: auto 1fr;
		grid-gap: 1rem;		
	}
	
	input{ 
		padding: 1rem 1.5rem;
		font-size: 1.5rem;
		min-width: 5rem; /* safari/FF != chrome, so normalize */
		outline: none;
		border: none;
		border-radius: 4px;
		box-shadow: var(--elev-2); 
	}

	input::placeholder{
		color: #888;
		font-family: roboto;
		font-weight: 300;
	}

	section{
		padding: .5rem;
		overflow: scroll;

		display: grid;
		grid-gap: 1rem;
		align-content: start; /* will align the content items on top */
	}

`;

@customElement('v-project')
class ProjectView extends BaseHTMLElement { // extends HTMLElement

	//#region    ---------- Key Elements ---------- 
	#sectionEl: HTMLElement;
	#inputEl: HTMLInputElement;

	private get taskEls() {
		return [...this.#sectionEl.children] as TaskComponent[];
	}
	//#endregion ---------- /Key Elements ---------- 

	//#region    ---------- UI Events ---------- 
	@onEvent('keyup', 'input')
	async onInputAddKey(evt: KeyboardEvent) {
		if (evt.key == 'Enter') {
			const title = this.#inputEl.value;
			taskDco.create({ title });
			this.#inputEl.value = '';
		}
	}

	@onEvent('CHANGE', 'c-task')
	onCTaskChange(evt: OnEvent<Partial<Task>>) {
		const taskEl = evt.target as TaskComponent;
		taskDco.update(taskEl.data.id, evt.detail);
	}
	//#endregion ---------- /UI Events ---------- 

	//#region    ---------- Hub Events ---------- 
	@onHub('dcoHub', 'Task')
	onTaskDco(data: Task, info: HubEventInfo) {
		this.refresh((info.label == 'update') ? data : undefined);
	}
	//#endregion ---------- /Hub Events ---------- 

	constructor() {
		super();

		// create the shadow dom and append content
		this.attachShadow({ mode: 'open' }).append(html`
			<input placeholder="Enter task name">
			<section>
			</section>
		`);

		// get the key element references
		[this.#inputEl, this.#sectionEl] =
			[...this.shadowRoot!.children!] as [HTMLInputElement, HTMLElement];

		// adopt shadow style	
		adoptStyleSheets(this, _shadowCss);
	}

	postDisplay() {
		this.refresh();
	}

	async refresh(task?: Task) {

		// if task, just refresh the task
		if (task) {
			const taskEl = this.taskEls.find(taskEl =>
				taskEl.data.id == task.id);
			if (taskEl) taskEl.data = task;
		}
		// otherwise fetch and refresh the whole list
		else {
			// get the task array from data store
			const tasks = await taskDco.list();

			// create document fragment with c-task element list
			const frag = document.createDocumentFragment();
			const els = tasks.map(data =>
				assign(document.createElement('c-task'), { data }));
			frag.append(...els);

			// empty and fill the sectionEl
			this.#sectionEl.innerHTML = '';
			this.#sectionEl.append(frag);
		}
	}

}
