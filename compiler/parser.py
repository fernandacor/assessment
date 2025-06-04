"""
Iker Garcia German
Tecnologico de Monterrey Campus Santa Fe
Analizador Sintáctico
"""

from lexer import getToken, globales
from globalTypes import *

def recibeParser(prog, pos, length):
    globales(prog, pos, length)

def newStmtNode(kind):
    node = TreeNode()
    node.nodekind = NodeKind.StmtK
    node.stmt = kind
    node.lineno = currentLine
    return node

def newExpNode(kind):
    node = TreeNode()
    node.nodekind = NodeKind.ExpK
    node.exp = kind
    node.lineno = currentLine
    node.type = ExpType.Void
    return node

currentToken = None
currentLexeme = None
currentLine = 0

def nextToken(imprime=False):
    global currentToken, currentLexeme, currentLine
    tok, lex, line = getToken(imprime)
    currentToken = tok
    currentLexeme = lex
    currentLine = line
    return currentToken

def match(expected):
    global currentToken
    if currentToken == expected:
        nextToken(False)
    else:
        syntaxError(f"Se esperaba '{expected.value or expected.name}', se obtuvo '{currentLexeme}'")
        sync({TokenType.SEMI, TokenType.RBRACE, TokenType.ENDFILE})

def syntaxError(message):
    print(f"Línea {currentLine}: Error sintáctico: {message}")

def sync(syncSet):
    global currentToken
    while currentToken not in syncSet and currentToken != TokenType.ENDFILE:
        nextToken(False)

# Función principal
def parse(imprime=True):
    # Inicia el análisis y construye el AST
    # Obtener primer token
    nextToken(False)
    root = parseProgram()
    if imprime:
        printTree(root)
    return root

def parseProgram():
    return parseDeclList()

# Función para parsear la lista de declaraciones
def parseDeclList():
    head = None
    last = None
    while currentToken in {TokenType.INT, TokenType.VOID}:
        decl = parseDeclaration()
        if head is None:
            head = decl
        else:
            last.sibling = decl
        last = decl
    return head

# Función para parsear una declaración
def parseDeclaration():
    tipo = currentToken
    parseTypeSpecifier()
    if currentToken != TokenType.ID:
        syntaxError("se esperaba identificador en declaración")
        return None
    name = currentLexeme
    nextToken(False)
    if currentToken == TokenType.LPAREN:
        return parseFunDecl(name, tipo)
    else:
        return parseVarDecl(name, tipo)

# Función para parsear el tipo de declaración
def parseTypeSpecifier():
    if currentToken in {TokenType.INT, TokenType.VOID}:
        nextToken(False)
    else:
        syntaxError("se esperaba 'int' o 'void' como tipo")

# Función para parsear una declaración de variable
def parseVarDecl(name, tipo):
    node = newStmtNode(StmtKind.DeclK)
    node.name = name
    node.type = ExpType.Integer if tipo == TokenType.INT else ExpType.Void
    if currentToken == TokenType.LBRACKET:
        nextToken(False)
        if currentToken == TokenType.NUM:
            node.val = int(currentLexeme)
            nextToken(False)
        else:
            syntaxError("se esperaba tamaño de arreglo")
        match(TokenType.RBRACKET)
    match(TokenType.SEMI)
    return node

# Función para parsear una declaración de función
def parseFunDecl(name, tipo):
    node = newStmtNode(StmtKind.DeclK)
    node.name = name
    node.type = ExpType.Integer if tipo == TokenType.INT else ExpType.Void
    match(TokenType.LPAREN)
    params = parseParams()
    node.child[0] = params
    match(TokenType.RPAREN)
    node.child[1] = parseCompoundStmt()
    return node

# Función para parsear los parámetros de la función
def parseParams():
    if currentToken == TokenType.VOID:
        nextToken(False)
        if currentToken == TokenType.RPAREN:
            return None
    # lista de parámetros
    head = None
    last = None
    
    while currentToken in {TokenType.INT, TokenType.VOID}:
        param = newStmtNode(StmtKind.DeclK)
        tipo = currentToken
        parseTypeSpecifier()
        if currentToken == TokenType.ID:
            param.name = currentLexeme
            param.type = ExpType.Integer if tipo == TokenType.INT else ExpType.Void
            nextToken(False)
        else:
            syntaxError("se esperaba identificador en parámetro")
        if currentToken == TokenType.LBRACKET:
            nextToken(False)
            match(TokenType.RBRACKET)
        if head is None:
            head = param
        else:
            last.sibling = param
        last = param
        if currentToken == TokenType.COMMA:
            nextToken(False)
        else:
            break
    return head

# Función para parsear una sentencia compuesta
# Esta función es responsable de parsear el bloque de código entre llaves
def parseCompoundStmt():
    match(TokenType.LBRACE)
    compoundLine = currentLine
    # declaraciones locales (idéntico)
    local = None
    last_decl = None
    while currentToken in {TokenType.INT, TokenType.VOID}:
        decl = parseVarDeclPlaceholder()
        if local is None:
            local = decl
        else:
            last_decl.sibling = decl
        last_decl = decl
        
    # sentencias
    stmt = None
    last_stmt = None
    while currentToken not in {TokenType.RBRACE, TokenType.ENDFILE}:
        s = parseStatement()
        if s is None:
            continue               
        if stmt is None:
            stmt = s
        else:
            last_stmt.sibling = s
        last_stmt = s

    match(TokenType.RBRACE)
    node = newStmtNode(StmtKind.CompoundK)
    node.lineno = compoundLine 
    node.child[0]= local
    node.child[1]= stmt
    return node

def parseVarDeclPlaceholder():
    """
    Parsea una línea de declaración local con posibles múltiples IDs separados por comas,
    p. ej.  `int x, y, z;` \n
    Devuelve la cabeza de una lista enlazada de TreeNode (DeclK).\n
    Esta función ayuda a evitar la duplicación de código en parseCompoundStmt, ya que tenia un error y esta función lo corrige.\n
    Esta función fue creada con ayuda de ChatGPT.
    """
    tipo = currentToken
    parseTypeSpecifier()  

    head = None
    last = None
    
    while True:
        if currentToken == TokenType.ID:
            name = currentLexeme
            declLine = currentLine
            nextToken(False)
        else:
            syntaxError("se esperaba identificador en declaración local")
            break

        # Crear el nodo y luego fijar su línea al valor capturado
        node = newStmtNode(StmtKind.DeclK)
        node.lineno = declLine
        node.name     = name
        node.type     = ExpType.Integer if tipo == TokenType.INT else ExpType.Void

        if currentToken == TokenType.LBRACKET:
            nextToken(False)
            if currentToken == TokenType.NUM:
                node.val = int(currentLexeme)
                nextToken(False)
            else:
                syntaxError("se esperaba tamaño de arreglo")
            match(TokenType.RBRACKET)

        if head is None:
            head = node
        else:
            last.sibling = node
        last = node
        
        if currentToken == TokenType.COMMA:
            nextToken(False)
            continue
        break

    match(TokenType.SEMI)
    return head

# Función para parsear una sentencia
def parseStatement():
    if currentToken == TokenType.LBRACE:
        return parseCompoundStmt()
    elif currentToken == TokenType.IF:
        return parseSelectionStmt()
    elif currentToken == TokenType.WHILE:
        return parseIterationStmt()
    elif currentToken == TokenType.RETURN:
        return parseReturnStmt()
    elif currentToken == TokenType.INPUT:
        return parseInputStmt()
    elif currentToken == TokenType.OUTPUT:
        return parseOutputStmt()
    elif currentToken in {TokenType.INT, TokenType.VOID}:
        # Si es una declaración de variable, parsear como tal
        return parseVarDeclPlaceholder()
    else:
        return parseExpressionStmt()

# Función para parsear la sentencia de expresión
def parseExpressionStmt():
    if currentToken == TokenType.SEMI:
        nextToken(False)
        return None
    node = parseExpression()
    match(TokenType.SEMI)
    return node

# Función para parsear la sentencia de selección
def parseSelectionStmt():
    node = newStmtNode(StmtKind.IfK)
    match(TokenType.IF)
    match(TokenType.LPAREN)
    node.child[0] = parseExpression()
    match(TokenType.RPAREN)
    node.child[1] = parseStatement()
    if currentToken == TokenType.ELSE:
        nextToken(False)
        node.child[2] = parseStatement()
    return node

# Función para parsear la sentencia de iteración
def parseIterationStmt():
    node = newStmtNode(StmtKind.WhileK)
    match(TokenType.WHILE)
    match(TokenType.LPAREN)
    node.child[0] = parseExpression()
    match(TokenType.RPAREN)
    node.child[1] = parseStatement()
    return node

# Función para parsear la sentencia de retorno
def parseReturnStmt():
    match(TokenType.RETURN)
    node = newStmtNode(StmtKind.ReturnK)
    if currentToken != TokenType.SEMI:
        node.child[0] = parseExpression()
    match(TokenType.SEMI)
    return node

# Función para parsear la entrada
def parseInputStmt():
    match(TokenType.INPUT)
    node = newStmtNode(StmtKind.InputK)
    match(TokenType.LPAREN)
    node.child[0] = parseExpression()
    match(TokenType.RPAREN)
    match(TokenType.SEMI)
    return node

# Función para parsear la salida
def parseOutputStmt():
    match(TokenType.OUTPUT)
    node = newStmtNode(StmtKind.OutputK)
    match(TokenType.LPAREN)
    node.child[0] = parseExpression()
    match(TokenType.RPAREN)
    match(TokenType.SEMI)
    return node

# Función para parsear una expresión
def parseExpression():
    node = parseSimpleExpression()
    if currentToken == TokenType.ASSIGN:
        nextToken(False)
        rhs = parseExpression()
        assignNode = newStmtNode(StmtKind.AssignK)
        assignNode.child[0] = node
        assignNode.child[1] = rhs
        return assignNode
    return node

# Función para parsear expresiones simples
def parseSimpleExpression():
    node = parseAdditiveExpression()
    if currentToken in {TokenType.LT, TokenType.GT, TokenType.EQ, TokenType.LE, TokenType.GE, TokenType.NE}:
        op = currentToken
        nextToken(False)
        right = parseAdditiveExpression()
        parent = newExpNode(ExpKind.OpK)
        parent.op = op
        parent.child[0] = node
        parent.child[1] = right
        return parent
    return node

def parseSimpleExpressionRest(left):
    """
    Recibe como 'left' el sub-árbol ya construido hasta el primer factor;\n
    continúa con todos los '+'/'-' (sumas y restas) y luego
    con el posible operador relacional: 
    \n (<, >, ==, <=, >=, !=). \n
    Este función fue creada con ayuda de ChatGPT
    """
    node = left
    while currentToken in {TokenType.PLUS, TokenType.MINUS}:
        op = currentToken
        nextToken(False)
        right = parseTerm()
        parent = newExpNode(ExpKind.OpK)
        parent.op = op
        parent.child[0] = node
        parent.child[1] = right
        node = parent
        
    # Si hay un operador relacional, lo agregamos al árbol
    # (esto es un poco redundante, pero se dejo así por claridad)
    if currentToken in {TokenType.LT, TokenType.GT, TokenType.EQ, TokenType.LE, TokenType.GE, TokenType.NE}:
        op = currentToken
        nextToken(False)
        right = parseAdditiveExpression()
        parent = newExpNode(ExpKind.OpK)
        parent.op = op
        parent.child[0] = node
        parent.child[1] = right
        node = parent

    return node

# Función para parsear expresiones aditivas
def parseAdditiveExpression():
    node = parseTerm()
    while currentToken in {TokenType.PLUS, TokenType.MINUS}:
        op = currentToken
        nextToken(False)
        right = parseTerm()
        parent = newExpNode(ExpKind.OpK)
        parent.op = op
        parent.child[0] = node
        parent.child[1] = right
        node = parent
    return node

# Función para parsear términos
def parseTerm():
    node = parseFactor()
    while currentToken in {TokenType.TIMES, TokenType.OVER}:
        op = currentToken
        nextToken(False)
        right = parseFactor()
        parent = newExpNode(ExpKind.OpK)
        parent.op = op
        parent.child[0] = node
        parent.child[1] = right
        node = parent
    return node

# Función para parsear factores
def parseFactor():
    if currentToken == TokenType.LPAREN:
        nextToken(False)
        node = parseExpression()
        match(TokenType.RPAREN)
        return node
    elif currentToken == TokenType.NUM:
        node = newExpNode(ExpKind.ConstK)
        node.val = int(currentLexeme)
        nextToken(False)
        return node
    elif currentToken == TokenType.ID:
        name = currentLexeme
        nextToken(False)
        # Array indexing
        if currentToken == TokenType.LBRACKET:
            nextToken(False)
            indexExpr = parseExpression()
            match(TokenType.RBRACKET)
            node = newExpNode(ExpKind.IdK)
            node.name = name
            node.child[0] = indexExpr
            return node
        # Function call
        elif currentToken == TokenType.LPAREN:
            nextToken(False)
            args = parseArgs()
            match(TokenType.RPAREN)
            node = newExpNode(ExpKind.CallK)
            node.name = name
            node.child[0] = args
            return node
        # Simple identifier
        else:
            node = newExpNode(ExpKind.IdK)
            node.name = name
            return node
    elif currentToken in {TokenType.INPUT, TokenType.OUTPUT}:
        name = currentLexeme
        nextToken(False)
        if currentToken == TokenType.LPAREN:
            nextToken(False)
            args = parseArgs()
            match(TokenType.RPAREN)
            node = newExpNode(ExpKind.CallK)
            node.name = name
            node.child[0] = args
            return node
        node = newExpNode(ExpKind.IdK)
        node.name = name
        return node
    else:
        syntaxError(f"factor inesperado: {currentLexeme}")
        nextToken(False)
        return None

# Función para parsear argumentos de función
def parseArgs():
    if currentToken == TokenType.RPAREN:
        return None
    head = None; last = None
    while True:
        expr = parseExpression()
        if head is None: head = expr
        else: last.sibling = expr
        last = expr
        if currentToken == TokenType.COMMA:
            nextToken(False)
        else:
            break
    return head

# Función para imprimir el árbol de sintaxis abstracta
# (AST) de forma recursiva
def printTree(node, indent=0):
    while node:
        # Always prefix line number
        print(f"[Line {node.lineno}] " + ' ' * indent, end='')

        # Special handling for if-statements
        if node.nodekind == NodeKind.StmtK and node.stmt == StmtKind.IfK:
            # Imprimir encabezado
            # (stmt) if
            print(f"[Stmt: {node.stmt.name}]" , end='')
            print()

            print(' ' * (indent + 2) + "(cond)")
            printTree(node.child[0], indent + 4)

            print(' ' * (indent + 2) + "(then)")
            printTree(node.child[1], indent + 4)

            if node.child[2]:
                print(' ' * (indent + 2) + "(else)")
                printTree(node.child[2], indent + 4)

            # Move on to sibling
            node = node.sibling
            continue

        # Normal Statement or Expression
        if node.nodekind == NodeKind.StmtK:
            print(f"[Stmt: {node.stmt.name}]", end='')
            if node.name:
                print(f" name={node.name}", end='')
        else:
            print(f"[Exp: {node.exp.name}]", end='')
            if node.val is not None:
                print(f" val={node.val}", end='')
            if node.name:
                print(f" name={node.name}", end='')
            if node.op:
                print(f" op={node.op.name}", end='')

        print()  # end of this node

        # Recurse into children
        for c in node.child:
            if c:
                printTree(c, indent + 2)

        # Then to the next sibling
        node = node.sibling
""