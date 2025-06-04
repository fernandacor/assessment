'''
Iker Garcia German
Tecnologico de Monterrey Campus Santa Fe
Analizador Léxico
'''

from globalTypes import *

lineno = 1

def globales(prog, pos, long):
    global programa, posicion, progLong
    programa = prog
    posicion = pos
    progLong = long

def reservedLookup(tokenString):
    for w in ReservedWords:
        if tokenString == w.value:
            return TokenType(tokenString)
    return TokenType.ID

def printErrorMessage(lineno, errorPos):
    # Buscar el inicio de la línea: el primer caracter después del último '\n' antes de errorPos.
    start = programa.rfind('\n', 0, errorPos)
    if start == -1:
        start = 0
    else:
        start += 1
    end = programa.find('\n', errorPos)
    if end == -1:
        end = len(programa)
    lineStr = programa[start:end]
    column = errorPos - start
    print(f"Línea {lineno}: Error en la formación de token:")
    print(lineStr)
    print(" " * column + "^")

def getToken(imprime=True):
    global posicion, lineno

    tokenString = ""         # Almacena el lexema del token
    currentToken = None      # Variable para almacenar el tipo de token reconocido
    state = StateType.START  # Se inicia en el estado START
    save = True              # Indica si se debe guardar el carácter actual
    tokenStart = posicion    # Marca la posición en que comienza el token actual
    tokenLine = lineno

    while state != StateType.DONE:
        # Verificación para evitar salir del rango del string
        if posicion >= progLong:
            tokenString = ""
            currentToken = TokenType.ENDFILE
            state = StateType.DONE
            break

        c = programa[posicion]
        save = True

        if state == StateType.START:
            # Manejo de espacios en blanco
            if c in (' ', '\t', '\n'):
                save = False
                if c == '\n':
                    lineno += 1
                    tokenLine = lineno
                tokenStart = posicion + 1
            elif c == '/':
                if (posicion + 1) < progLong and programa[posicion + 1] == '*':
                    # Se ingresa al estado de comentario; se ignoran los caracteres
                    state = StateType.INCOMMENT
                    save = False
                    tokenStart = posicion  
                    posicion += 2  
                    continue  
                else:
                    currentToken = TokenType.OVER
                    state = StateType.DONE
            elif c == '$':
                currentToken = TokenType.ENDFILE
                state = StateType.DONE
            elif c.isdigit():
                state = StateType.INNUM
            elif c.isalpha():
                state = StateType.INID
            elif c == '=':
                if (posicion + 1) < progLong and programa[posicion + 1] == '=':
                    save = False
                    tokenString += c       # guarda el primer '='
                    posicion += 1          # consume el segundo '='
                    tokenString += programa[posicion]
                    currentToken = TokenType.EQ
                else:
                    currentToken = TokenType.ASSIGN
                state = StateType.DONE
            elif c == '!':
                if (posicion + 1) < progLong and programa[posicion + 1] == '=':
                    save = False
                    tokenString += c
                    posicion += 1
                    tokenString += programa[posicion]
                    currentToken = TokenType.NE
                else:
                    currentToken = TokenType.ERROR
                state = StateType.DONE
            elif c == '<':
                if (posicion + 1) < progLong and programa[posicion + 1] == '=':
                    save = False
                    tokenString += c
                    posicion += 1
                    tokenString += programa[posicion]
                    currentToken = TokenType.LE
                else:
                    currentToken = TokenType.LT
                state = StateType.DONE
            elif c == '>':
                if (posicion + 1) < progLong and programa[posicion + 1] == '=':
                    save = False
                    tokenString += c
                    posicion += 1
                    tokenString += programa[posicion]
                    currentToken = TokenType.GE
                else:
                    currentToken = TokenType.GT
                state = StateType.DONE
            elif c == '+':
                currentToken = TokenType.PLUS
                state = StateType.DONE
            elif c == '-':
                currentToken = TokenType.MINUS
                state = StateType.DONE
            elif c == '*':
                currentToken = TokenType.TIMES
                state = StateType.DONE
            elif c == '(':
                currentToken = TokenType.LPAREN
                state = StateType.DONE
            elif c == ')':
                currentToken = TokenType.RPAREN
                state = StateType.DONE
            elif c == '{':
                currentToken = TokenType.LBRACE
                state = StateType.DONE
            elif c == '}':
                currentToken = TokenType.RBRACE
                state = StateType.DONE
            elif c == ';':
                currentToken = TokenType.SEMI
                state = StateType.DONE
            elif c == ',':
                currentToken = TokenType.COMMA
                state = StateType.DONE
            elif c == '[':
                currentToken = TokenType.LBRACKET
                state = StateType.DONE
            elif c == ']':
                currentToken = TokenType.RBRACKET
                state = StateType.DONE
            elif posicion == progLong - 1:
                save = False
                currentToken = TokenType.ENDFILE
                state = StateType.DONE
            else:
                # Carácter no reconocido: error
                state = StateType.DONE
                currentToken = TokenType.ERROR
        elif state == StateType.INCOMMENT:
            save = False
            # Verificar si se encuentra el final del comentario: "*/"
            if c == '*' and (posicion + 1) < progLong and programa[posicion + 1] == '/':
                posicion += 1 
                state = StateType.START 
                tokenStart = posicion + 1
            elif c == '\n':
                lineno += 1
                tokenLine = lineno
            posicion += 1
            continue

        elif state == StateType.INNUM:
            if c.isdigit():
                # Continúa acumulando dígitos
                pass
            elif c.isalpha():
                # Error: un número no debe contener letras.
                state = StateType.INERROR
                currentToken = TokenType.ERROR
            else:
                if posicion < progLong:
                    posicion -= 1 
                save = False
                state = StateType.DONE
                currentToken = TokenType.NUM

        elif state == StateType.INID:
            if c.isdigit():
                state = StateType.INERROR
                currentToken = TokenType.ERROR
            if not (c.isalnum() or c == '_'):
                if posicion < progLong:
                    posicion -= 1
                save = False
                state = StateType.DONE
                currentToken = TokenType.ID

        elif state == StateType.INERROR:
            # Acumula el token erróneo completo.
            if c.isalnum() or c == '_':
                pass
            else:
                if posicion < progLong:
                    posicion -= 1
                save = False
                state = StateType.DONE

        else:
            print('Error en el lexer: estado desconocido:', state)
            state = StateType.DONE
            currentToken = TokenType.ERROR

        if save:
            tokenString += c

        # Si se termina un token en estado INID (sin error), se verifica si es palabra reservada.
        if state == StateType.DONE and currentToken == TokenType.ID:
            currentToken = reservedLookup(tokenString)

        posicion += 1

    # En caso de error, se imprime el mensaje usando tokenStart.
    if currentToken == TokenType.ERROR:
        printErrorMessage(tokenLine, tokenStart)
        posicion += 1

    if imprime:
        print(tokenLine, currentToken, " = ", tokenString)
    return currentToken, tokenString, tokenLine

# f = open('sample_extreme.c-', 'r')
# programa = f.read()
# progLong = len(programa)
# posicion = 0

# globales(programa, posicion, progLong)
# print("Analizador Léxico")
# print("===================================")
# token, lexema, linea = getToken(True)
# while token != TokenType.ENDFILE:
#     token, lexema, linea = getToken(True)