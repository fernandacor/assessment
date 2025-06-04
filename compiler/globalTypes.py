from enum import Enum

# ================================
#      Token Types para C‐
# ================================

class TokenType(Enum):
    ENDFILE = 300
    ERROR = 301

    # Palabras reservadas en C‐
    IF     = 'if'
    ELSE   = 'else'
    WHILE  = 'while'
    RETURN = 'return'
    INT    = 'int'
    VOID   = 'void'
    INPUT  = 'input'
    OUTPUT = 'output'

    # Tokens multicaracteres
    ID  = 310
    NUM = 311

    # Símbolos especiales (operadores y delimitadores)
    ASSIGN   = '='    
    EQ       = '=='   
    LT       = '<'
    GT       = '>'
    LE       = '<='
    GE       = '>='
    NE       = '!='
    PLUS     = '+'
    MINUS    = '-'
    TIMES    = '*'
    OVER     = '/'
    LPAREN   = '('
    RPAREN   = ')'
    LBRACE   = '{'
    RBRACE   = '}'
    LBRACKET = '['
    RBRACKET = ']'
    SEMI     = ';'
    COMMA    = ','


class StateType(Enum):
    START     = 0
    INASSIGN  = 1    
    INCOMMENT = 2     
    INNUM     = 3
    INID      = 4
    DONE      = 5
    INERROR   = 6 


class ReservedWords(Enum):
    IF     = 'if'
    ELSE   = 'else'
    WHILE  = 'while'
    RETURN = 'return'
    INT    = 'int'
    VOID   = 'void'
    INPUT  = 'input'
    OUTPUT = 'output'


# Tipos de nodo: sentencia o expresión
class NodeKind(Enum):
    StmtK = 0
    ExpK  = 1

# Tipos de sentencias en C‐
class StmtKind(Enum):
    IfK       = 0
    WhileK    = 1
    ReturnK   = 2
    CompoundK = 3   
    AssignK   = 4
    DeclK     = 5  
    InputK    = 6   
    OutputK   = 7   

# Tipos de expresiones en C‐
class ExpKind(Enum):
    OpK   = 0     
    ConstK= 1    
    IdK   = 2     
    CallK = 3     

class ExpType(Enum):
    Void    = 0
    Integer = 1

MAXCHILDREN = 3

class TreeNode:
    def __init__(self):
        self.child = [None] * MAXCHILDREN  
        self.sibling = None                
        self.lineno = 0                    
        self.nodekind = None              
        
        self.stmt = None                   
        self.exp = None                   

        self.op = None                     
        self.val = None                    
        self.name = None                   

        self.type = None                   