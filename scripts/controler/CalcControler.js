class CalcControler{
	constructor(){
		this._audio = new Audio('click.mp3');
		this._onAudio = false;
		this._locale  = "pt-BR";
		this._operation = [];
		this._displayCalcEl = document.querySelector('#display');
		this._dateEl = document.querySelector('#data');
		this._timeEl = document.querySelector('#hora');
		this._lastOperator = '';
		this._lastNumber = '';
		this.initialize();
		this.initButtonsEvents();
		this.initKeyboard();
		this.pastFromClipboard();
	}
	initialize(){
		this.setDisplayDateTime();
		let inteval = setInterval( ()=>{
			this.setDisplayDateTime();

		},1000);
		document.querySelectorAll('.btn-ac').forEach(btn=>{
			btn.addEventListener('dblclick',e=>{
				this.toggleAudio();

			});

		});

	}
	toggleAudio(){
		this._onAudio = !this._onAudio;
	}

	playAudio(){
		if(this._onAudio){
			this._audio.currentTime = 0;
			this._audio.play();
		}
	}
	initKeyboard(){
		document.addEventListener('keyup', e=>{
			
			this.playAudio();
			switch (e.key){
				case 'Escape':
					this.clearAll();
					break;
				case 'Backspace':
					this.clearEntry();
					break;
				case '+':
				case '-':
				case '%':
				case '*':
				case '/':
					this.addOperation(e.key);
					break;
				case '=':
				case 'Enter':
					this.addOperation('=');
					break;
				
				case 'ponto':
				case ',':
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
					this.addOperation(e.key);
					break;
				case 'c':
					if(e.ctrlKey)
						this.copyToClipboard();
					break;


			}
			this.showDisplay();

		});

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
	
		console.log(this.isOperation(lastOperation));
		console.log(lastOperation);
		if(lastOperation){
			if(lastOperation.indexOf('.')>-1){
				console.log('entrei no primeiro if');
				return;
			}
		}
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

	//  muda  a operação
	changeOperation(value){
		this._operation.pop();
		this._operation.push(value);
	}
	// altera o ultimo elemento
	setLastOperation(value){
			this._operation[this._operation.length - 1] = (
				this._operation[this._operation.length - 1].toString()+value.toString());
	}
	// copiar para a área de transferencia
	copyToClipboard(){
		let input = document.createElement('input');

		input.value =  this.displayCalc;
		
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		input.remove();
	}
	//colar da area de transferencia
	pastFromClipboard(){
		document.addEventListener('paste',e =>{
			let text = e.clipboardData.getData('Text');
			this.addOperation(text);
			console.log(text);
		});
	}
	//mostrar o display
	showDisplay(){
		if(this._operation.length == 0 ){
		
			this.displayCalc = '0';
		}else{
			//this.displayCalc = this.getLastItem(true);
			this.displayCalc = this.getLastOperation();
			//this.displayCalc  = this._operation.join('');
		}	
	}

	// 
	execBtn(value){
		this.playAudio();
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
	// pega a data atual
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