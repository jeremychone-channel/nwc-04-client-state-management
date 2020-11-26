import { adoptStyleSheets, append, BaseHTMLElement, className, css, customElement, onEvent, trigger } from 'dom-native';
import { Task } from './dcos';

const _shadowCss = css`
	:host{
		background: #fff;
		padding: 1rem;
		box-shadow: var(--elev-2);
		border-radius: 4px;
		
		display: grid;
		grid-template-columns: 1.5rem 1fr 2rem;
		gap: .5rem;
		align-items: center;

		transition: .5s;
	}

	input[type="checkbox"]{
		outline: none;
		width: 1rem;
		height: 1rem;
	}

	span{
		display: flex;
		align-items: center;
	}

	c-ico{
		cursor: pointer;
		width: 2rem;
		height: 2rem;
		opacity: .2;
	}

	:host(.fav) c-ico{
		--fill: #F0CC46;
		opacity: 1;
	}

	:host(.done){
		box-shadow: var(--elev-1);
		opacity: .6;
	}

	:host(.done) span{
		text-decoration: line-through;
	}	
`;

@customElement('c-task')
export class TaskComponent extends BaseHTMLElement {

	//#region    ---------- Data ---------- 
	#dataId!: number;
	get dataId() { return this.#dataId }
	get dataType() { return 'Task' }

	setData(data: Task) {
		this.#dataId = data.id;
		this.refresh(data);
		return this; // allows chaining
	}
	//#endregion ---------- /Data ----------

	//#region    ---------- Key Elements ---------- 
	#checkEl: HTMLInputElement;
	#titleEl: HTMLElement;
	//#endregion ---------- /Key Elements ----------

	//#region    ---------- UI Events ---------- 
	@onEvent('pointerup', 'c-ico')
	icoClick() {
		const fav = !this.classList.contains('fav');
		trigger(this, 'CHANGE', { detail: { fav } });
	}

	@onEvent('click', 'input[type="checkbox"]')
	checkClick() {
		const done = this.#checkEl.checked;
		trigger(this, 'CHANGE', { detail: { done } });
	}
	//#endregion ---------- /UI Events ----------

	constructor() {
		super();

		// create and append shadowDOM
		[this.#checkEl, this.#titleEl] = append(this.attachShadow({ mode: 'open' }), `
			<input type="checkbox">
			<span></span>
			<c-ico href="#ico-star"></c-ico>
		`) as [HTMLInputElement, HTMLElement];

		adoptStyleSheets(this, _shadowCss);
	}

	protected refresh(data: Task) {
		const { title, fav, done } = data;

		this.#titleEl.textContent = title;
		this.#checkEl.checked = (done === true) ?? false;

		className(this, { fav, done });
	}
}

// Augment the global TagName space to match runtime
declare global {
	interface HTMLElementTagNameMap {
		'c-task': TaskComponent;
	}
}