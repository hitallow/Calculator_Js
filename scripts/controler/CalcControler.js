class CalcControler{
	constructor(){
		this._locale  = "pt-BR";
		this._operation = [];
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
	//Mostra o nome error na tela
	setError(){
		this.displayCalc = 'Error';
	}
	// remove todos os elementos do array
	clearAll(){
		this._operation = [];
	}
	// remove o ultimo elemento do array
	clearEntry(){
		this._operation.pop();
	}
	getLastOperation(){
		return this._operation[this._operation.length - 1];
	}
	isOperation(value){
		return (['/','*','%','+','-'].indexOf(value)> -1);
	}
	isNotNumber(value){
		if(value.toString() =='Infinity' ){
			return true;
		}
	}
	calc(){
		let last = this._operation.pop();
		let result = eval(this._operation.join(''));
		console.log('result ->',result);
		
		if(last == '%'){
			result /= 100; 
			this._operation = [result];
			return true;
		}else if(this.isNotNumber(result)){
			return false;
		}
		else{
			console.log('entrei no else');
			this._operation = [result, last];
			return true;
		}
		
		
		
	}
	pushOperation(value){
		this._operation.push(value);
		if(this._operation.length > 3){
			return this.calc();				
		}
		
	}
	// adciona uma operação ao array operation
	addOperation(value){
		let error = '';
		if(this._operation.length == 0 && !this.isOperation(value)){
			this._operation.push(parseInt(value));
		}
		else if(this._operation.length == 0 && this.isOperation(value)){
			if('+ -'.indexOf(value)>-1){
				this.pushOperation(value);
			}else{
				alert('Adcione primeiro um numero');
			}
		}
		else if(value.indexOf('=')> -1){

			let expressao = this._operation.join('');
			let result = eval(expressao);
			error = this._operation = [result];
			
		}
		else if(isNaN(this.getLastOperation())){
			if(this.isOperation(value)){
				this._operation.pop();
				error = this.pushOperation(value);
			}else{
				error = this._operation.push(parseInt(value));
			}
		}else{
			if(this.isOperation(value)){
				error = this.pushOperation(value);
			}else{
				this.setLastOperation(value);
			}
		}
		console.log(this._operation);
		this.showDisplay(error);
	}
	setLastOperation(value){
		this._operation[this._operation.length - 1] =parseInt(
				 this._operation[this._operation.length - 1].toString()+value.toString());
	}
	showDisplay(setError){
		if(this._operation.length == 0 ){
		
			this.displayCalc = '0';
		}else if(setError){
			this.displayCalc = 'ERRO';
		}
		else{
			this.displayCalc  = this._operation.join('');
		}	
}


	execBtn(value){
		switch (value){
			case 'ac':
				this.clearAll();
				this.showDisplay();
				break;
			case 'ce':
				this.clearEntry();
				this.showDisplay();
				break;
			case 'soma':
				this.addOperation('+');
				break;
			case 'subtracao':
				this.addOperation('-');
				break;
			case 'porcento':
				this.addOperation('%');
				break;
			case 'divisao':
				this.addOperation('/');
				break;
			case 'igual':
				this.addOperation('=');
				break;
			case 'multiplicacao':
				this.addOperation('*');
				break;
			case '.':
				this.addOperation('.');
				break;
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
				this.addOperation(value);
				break;
			default:
				this.setError();
				break;
		}

	}

	initButtonsEvents(){
		let buttons = document.querySelectorAll('#buttons g, #parts g');
		
		buttons.forEach((btn, index )=> {
			this.addEventListenerAll(btn, "click drag" , e=>{
				//let textBtn = btn.getAttribute('class').substring(4,);
				let textBtn = btn.className.baseVal.replace('btn-','');
				this.execBtn(textBtn);
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