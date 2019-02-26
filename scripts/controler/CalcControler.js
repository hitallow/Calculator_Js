class CalcControler{
	constructor(){
		this._locale  = "pt-BR";
		this._operation = [];
		this._displayCalcEl = document.querySelector('#display');
		this._dateEl = document.querySelector('#data');
		this._timeEl = document.querySelector('#hora');
		this._lastOperator = '';
		this._lastNumber = '';
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
		return (['/','*','%','+','-','.'].indexOf(value)> -1);
	}
	isNotNumber(value){
		if(value.toString() =='Infinity' ){
			return true;
		}
	}
	getResult(){

		return eval(this._operation.join(''));
	}


	existPorcent(){
		for(let i = 0; i< this._operation.length ; i++){
			let aux = this._operation[i].toString();
			if(aux.indexOf('%')>-1){
				return aux.substring(0, aux.indexOf('%'));
			}
		}
		return false;
	}
	calc(){
		if(this._operation.length > 3){
			let last = this._operation.pop();
			let result = this.getResult();
			if(last == '%'){
				result /= 100; 
				this._operation = [result];

			}else{
				this._operation = [result, last];
			}
		}else{
			this._operation = [this.getResult()];
		}
	}
	getLastItem(isOperator = true){
		let lastItem ;
		for(let i = this._operation.length -1; i > 0 ; i --){
			if(this.isOperation(this._operation[i]) == isOperator){
				lastItem = this._operation[i] ; 
				break;
			}
		}
		if(!lastItem){
			lastItem = (isOperator)?this._lastOperator : this.lastNumber;
		}
		return lastItem ; 
	}
	setLastNumberToDisplay(){
		let lastNumber = this.getLastItem(false);
		if(!lastNumber)
			lastNumber = 0;
		this.displayCalc = lastNumber;
	}
	pushOperation(value){
		if(!isNaN(this.getLastOperation())){
			this.setLastOperation(value);
		}else{
			this._operation.push(value);
		}
		if(this._operation.length > 3){
			this.calc();				
		}			
	}
	addDot(){
		let lastOperation = this.getLastOperation();
		console.log('111');
		console.log(this.isOperation(lastOperation));
		console.log(lastOperation);

		if(this.isOperation(lastOperation)|| !lastOperation){
			console.log('entrei aqui');
			this.pushOperation('0.');
		}else{
			this._operation[this._operation.length -1 ] = 
							this._operation[this._operation.length -1 ].toString() + '.';   
		}
	}
	// adciona uma operação ao array operation, CONTROLADOR 
	addOperation(value){
		let error = '';
		if(value == '%'){
			this.pushOperation(value);			
		}
		// Se for pedido pra fazer o cálculo e tiver mais que 3 elementos, é feito o cálculo
		else if(this._operation.length >= 3 || value == '='){
			this.calc();

		}
		// verifica se o vetor está vazio, e se não é algo como '= / * %' 
		else if(this._operation.length == 0 && !this.isOperation(value)){
			this._operation.push((value));

			
		}//verifica se o vetor está vazio, se estiver, e for pedido pra adcionar um valor diferente de
		// + ou - , ele reclama, caso contrário, adciona
		else if(this._operation.length == 0 && this.isOperation(value)){
			if('+ -'.indexOf(value)>-1){
				this.pushOperation(value);
			}else{
				alert('Adcione primeiro um número');
			}
		// verifica se o ultimo operador é sinal
		}else if(isNaN(this.getLastOperation())){
			// se for um sinal, ele remove o ultimo sinal, e adciona o novo;
			
			if(this.isOperation(value)){
				this.changeOperation(value);
			}else{
				// caso não seja, ele adciona
				//this.setLastOperation(value); 
				this._operation.push((value));
			}
			
		}else{
			
			 this.pushOperation(value);
		}

		
	}
	changeOperation(value){
		this._operation.pop();
		this._operation.push(value);
	}
	setLastOperation(value){
			this._operation[this._operation.length - 1] = (
				this._operation[this._operation.length - 1].toString()+value.toString());
	}
	showDisplay(){
		if(this._operation.length == 0 ){
		
			this.displayCalc = '0';
		}else{
			this.displayCalc  = this._operation.join('');
		}	
}


	execBtn(value){

		switch (value){
			case 'ac':
				this.clearAll();
				break;
			case 'ce':
				this.clearEntry();
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
			case 'ponto':
				this.addDot('.');
				
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
		this.showDisplay();
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