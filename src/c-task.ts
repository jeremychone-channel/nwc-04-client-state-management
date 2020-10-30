import { adoptStyleSheets, append, attr, BaseHTMLElement, className, css, customElement, onEvent, trigger } from 'dom-native';
import { Task } from './dcos';


const _shadowCss = css`

	:host{
		background: #fff;
		padding: 1rem;
		box-shadow: var(--elev-2);
		border-radius: 4px;
		
		display: grid;
		grid-template-columns: 1.5rem 1fr 2rem;
		grid-gap: .5rem;
		align-items: center;

		transition: .5s;
	}

	input[type="checkbox"]{
		outline: none;
		width: 1rem;
		height: 1rem;
	}

	c-ico{
		cursor: pointer;
		width: 2rem;
		height: 2rem;
		opacity: .2;
	}

	span{
		display: flex;
		align-items: center;
	}

	:host(.fav) c-ico{
		--fill: #F0CC46;
		opacity: 1;
	}

	:host(.done){
		box-shadow: var(--elev-1);
		opacity: .6;
	}
`;

@customElement('c-task')
export class TaskComponent extends BaseHTMLElement {

	//#region    ---------- Data ---------- 
	#data!: Task;
	set data(data: Task) {
		this.#data = data;
		attr(this, {
			'data-id': '' + data.id,
			'data-type': 'Task'
		});

		this.refresh();
	}
	get data() {
		return this.#data;
	}
	//#endregion ---------- /Data ---------- 

	//#region    ---------- Key Elements ---------- 
	#checkEl: HTMLInputElement;
	#titleEl: HTMLElement;
	//#endregion ---------- /Key Elements ---------- 

	//#region    ---------- UI Events ---------- 
	@onEvent('pointerup', 'c-ico')
	async icoClick() {
		const fav = !this.classList.contains('fav');
		trigger(this, 'CHANGE', { detail: { fav } });
	}

	@onEvent('click', 'input[type="checkbox"]')
	async checkClick() {
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

		// adopt shadow style	
		adoptStyleSheets(this, _shadowCss);
	}

	refresh() {
		const { title, fav, done } = this.#data;
		this.#titleEl.textContent = title;

		this.#checkEl.checked = (done === true) ?? false;
		this.#titleEl.style.textDecoration = (done === true) ? 'line-through' : '';

		className(this, { fav, done });
	}
}

