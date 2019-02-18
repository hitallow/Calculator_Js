class CalcControler{
	constructor(){
		this._locale  = "pt-BR";
		this._displayCalcEl = document.querySelector('#display');
		this._dateEl = document.querySelector('#data');
		this._timeEl = document.querySelector('#hora');
		this.initialize();
		this.initButtonsEvents();
	}
	initialize(){
		this.setDisplayDateTime();
		let inteval = setInterval( ()=>{
			this.setDisplayDateTime();

		},1000);

	}
	addEventListenerAll(element, events, fn){
		events.split(' ').forEach(event=>{
			element.addEventListener(event,fn, false);
		});
	}

	initButtonsEvents(){
		let buttons = document.querySelectorAll('#buttons g, #parts g');
		
		buttons.forEach((btn, index )=> {
			this.addEventListenerAll(btn, "click drag" , e=>{
				//console.log(btn.getAttribute('class').substring(4,));
				console.log(btn.className.baseVal.replace('btn-',''));
			});
			this.addEventListenerAll(btn,'mouseover mouseup mousedown', e=>{
				btn.style.cursor = 'pointer';
			});
		});
	}
	
	setDisplayDateTime(){
		this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
			day: '2-digit',
			month: 'short',
			year : 'numeric'	
		}); 
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
	}

	get displayDate(){
		return this._dateEl.innerHTML;
	}

	set displayDate(newData){
		this._dateEl.innerHTML = newData;
	}

	get displayCalc(){
		return this._displayCalcEl.innerHTML;
	}

	set displayCalc(newValue){
		this._displayCalcEl.innerHTML = newValue;
	}

	set displayTime(newTime){
		this._timeEl.innerHTML = newTime;
	}

	get displayTime(){
		return this._timeEl.innerHTML;
	}

	get currentDate(){
		return new Date();
	}
}