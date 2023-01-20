class MenuEvent extends CustomEvent {}

/**
 * @event menuopen
 * @event menuclose
 */
class MenuAdapter {
	// private field
	#clickTarget;
	#menu;

	// public field
	isOpen = false;

	constructor(clickTarget, menu) {
		// arguments validation
		if(clickTarget instanceof EventTarget) throw "argument 1 must be 'EventTarget'";
		if(menu instanceof EventTarget) throw "argument 2 must be 'EventTarget'";

		// set variables
		this.#clickTarget = clickTarget;
		this.#menu = menu;

		// add events
		this.#clickTarget.addEventListener('click', this.open);
		this.#menu.addEventListener('blur', this.close);
	}

	/**
	 * @fires MenuEvent#menuopen
	 */
	open() {
		const menuOpenEvent = new MenuEvent('menuopen');
		this.#menu.dispatchEvent(menuOpenEvent);
	}

	/**
	 * @fires MenuEvent#menuclose
	 */
	close() {
		const menuCloseEvent = new MenuEvent('menuclose');
		this.#menu.dispatchEvent(menuCloseEvent);
	}

	destroy() {

	}
}