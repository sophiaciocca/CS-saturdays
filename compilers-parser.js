//Calculator constructor
var Calculator = function(inputString) { 
    this.inputString = inputString;
    this.tokenStream = this.lexer(inputString);
}

Calculator.prototype.lexer = function(str){
    var tokenizedStream = [];
    var tokenTypes = [
            ["NUMBER",    /^\d+/ ],
            ["ADD",       /^\+/  ],
            ["SUB",       /^\-/  ],
            ["MUL",       /^\*/  ],
            ["DIV",       /^\//  ],
            ["LPAREN",    /^\(/  ],
            ["RPAREN",    /^\)/  ]
        ];
   
   var chars = str.split(' ')
   chars.forEach(function(character){
        tokenTypes.forEach(function(token){
           if(token[1].exec(character) !== null){
                tokenizedStream.push({
                    name: token[0],
                    value: character
                });
           };
        });
   });

   return tokenizedStream;     
}

//return next character in the tokenStream
Calculator.prototype.peek = function() {
    return this.tokenStream[0] || null
}

//shift off next char and add it to the tree
Calculator.prototype.get = function() {
    return this.tokenStream.shift()
}

//TreeNode constructor
function TreeNode(name) {
    //get the children arguments from arguments variable
    this.children = Array.prototype.slice.call(arguments, 1);
    this.name = name;
}

Calculator.prototype.parseExpression = function() {
    //E => T A
    var t = this.parseT();
    var a = this.parseA();
    return new TreeNode("Expression", t, a);
}

Calculator.prototype.parseA = function() {
    //here, we're MAKING A
    //A => + T A 
    //  => - T A 
    //  => null
    var nextToken = this.peek();
    //if next token exists & is 'add'... take it off the tree
    if (nextToken && nextToken.name === "ADD") {
        this.get();
        return new TreeNode("A", "+", this.parseT(), this.parseA());
    }
    else if (nextToken && nextToken.name === "SUB") {
        this.get();
        return new TreeNode("A", "-", this.parseT(), this.parseA());
    }
    //if it's null
    else {
        return new TreeNode("A");
    }
}

Calculator.prototype.parseT = function() {
    //T => F B
    return new TreeNode("T", this.parseF(), this.parseB());
}

Calculator.prototype.parseB = function() {
    //B => * F B 
    //  => / F B 
    //  => null
    if (this.peek() && this.peek() === "MUL") {
        //shift off the "*" token
        this.get();
        //return the new B node
        return new TreeNode("B", this.parseF(), this.parseB());
    }
    else if (this.peek() && this.peek() === "DIV") {
        this.get();
        return new TreeNode("B", this.parseF(), this.parseB());
    }
    else {
        return new TreeNode("B");
    }
}

Calculator.prototype.parseF = function() {
    //F => ( E )
    //  => - F 
    //  => NUMBER
    //if it starts with parentheses:
    if (this.peek()[0] === "(") {
        //get rid of parentheses, then call the expression inside
        var newExpression = this.peek().slice(1, this.peek().length - 1);
        return parseExpression(newExpression);
    }
    else if (this.peek() && this.peek() === "SUB") {
        this.get();
        return new TreeNode('-', this.parseF());
    }
}



/*
var calc = new Calculator("2 * 7 + 3")
// 2 7 * 3 +
//console.log(calc.tokenStream)
var node = new TreeNode('hi', 1, 2, 3, 4, 5);
console.log(node);
*/
/*
E
[ "2" "*" "7" "+" "3"]
2*7+3
Sentence => Subject Verb Object
Subject => Adjective Noun
          | Noun
Verb => {Actual verb}
Object => Adjective Noun  | Noun
Sentence
Subject Verb Object
Dog eats ice cream.
E
|\
T A
|\ \
F B A
| |
2
E => T + E 
E => T A
A => + E
T => F * F
F => number
3 + 4 + 5
E
T + E
T + T + E
sentence = E
sentence = T A
F B A
5 * F B A
5 * 4 + T A
5 * 4 + F B A
5 * 4 + 2
F * F B + 2
F B + 2
 
parseExpression()
  parseT()
  parseA()
parseT() {
    parseF
    parseB
}
parseF() {
}
3+(2*3)
  ^^^^^
3+4+5
T+T+TA   
E => T A
A => + T A
     - T A
     epsilon
T => F B
B => * F B
     / F B
     epsilon
F => ( E )
     - F
     NUMBER
     */