# symtab.py
from globalTypes import *

_symtab_stack = []
location_counter = 0

def init_builtins():
    """
    Inserta las funciones propias de C-: 
      input(): int  → devuelve entero
      output(int): void
    """
    # input(): sin parámetros, devuelve Integer
    st_insert_func('input', 0, ExpType.Integer, [])
    # output(int): un parametro entero, devuelve Void
    st_insert_func('output', 0, ExpType.Void, [ExpType.Integer])

class SymEntry:
    def __init__(self, name, lineno, loc, is_func=False, return_type=None, param_types=None, is_array=False, size=None):
        self.name = name
        self.def_lineno = lineno
        self.loc = loc
        self.use_lines = []
        self.is_func = is_func
        self.return_type = return_type
        self.param_types = param_types or []
        self.is_array = is_array
        self.size = size
        self.scope = 'global' if current_scope_level() == 0 else 'local'
        self.offset = None 

def st_enter_scope():
    _symtab_stack.append({})

def st_exit_scope():
    _symtab_stack.pop()

def current_scope_level():
    return len(_symtab_stack) - 1

def st_insert(name, lineno):
    """Inserta variable; devuelve False si ya existía."""
    global location_counter
    current = _symtab_stack[-1]
    if name in current:
        current[name].use_lines.append(lineno)
        return False
    entry = SymEntry(name, lineno, location_counter)
    current[name] = entry
    location_counter += 1
    return True

def st_insert_func(name, lineno, return_type, param_types):
    """Inserta función con firma."""
    global location_counter
    current = _symtab_stack[0]  # siempre al nivel global
    if name in current:
        # redeclaración de función
        return False
    entry = SymEntry(name, lineno, location_counter,
                     is_func=True,
                     return_type=return_type,
                     param_types=param_types)
    current[name] = entry
    location_counter += 1
    return True

def st_insert_array(name, lineno, size):
    """Inserta arreglo; devuelve False si ya existía."""
    global location_counter
    current = _symtab_stack[-1]
    if name in current:
        current[name].use_lines.append(lineno)
        return False
    entry = SymEntry(name, lineno, location_counter,
                     is_array=True,
                     size=size)
    current[name] = entry
    location_counter += size
    return True

def st_lookup(name):
    """Busca en scopes de más interno a más externo."""
    for scope in reversed(_symtab_stack):
        if name in scope:
            return scope[name]
    return None

def printSymTab():
    """
    Imprime la tabla de símbolos en formato tabular:
    Nombre    Tipo    Clase     Scope    Líneas    Extra
    ----------------------------------------------------
    """
    # Cabecera
    headers = ["Nombre", "Tipo", "Clase", "Scope", "Líneas", "Extra"]
    # Recopilamos las filas
    rows = []
    for depth, scope in enumerate(_symtab_stack):
        scope_name = "global" if depth == 0 else f"nivel{depth}"
        for entry in scope.values():
            # Tipo (INT/VOID)
            tipo = "INT" if entry.return_type == ExpType.Integer else "VOID" if entry.return_type == ExpType.Void else ""
            # Clase
            if entry.is_func:
                clase = "function"
                extra = f"params: {len(entry.param_types)}"
            elif entry.is_array:
                clase = "array"
                extra = f"size: {entry.size}"
            elif depth > 0 and any(entry.loc == e.loc for e in _symtab_stack[0].values()):
                # si apareció en nivel global, lo consideramos variable global
                clase = "variable"
                extra = ""
            else:
                # podrías ajustar lógica para distinguir parámetro/variable local
                clase = "param" if entry.is_func is False and entry.loc < len(entry.use_lines) else "variable"
                extra = ""
            # Líneas de definición + usos
            lines = ", ".join(str(n) for n in [entry.def_lineno] + entry.use_lines)
            rows.append([entry.name, tipo, clase, scope_name, lines, extra])

    # Calculamos anchos de columna
    col_widths = [max(len(str(col)), max(len(row[i]) for row in rows)) + 2
                  for i, col in enumerate(headers)]

    # Imprimimos cabecera
    line_fmt = "".join(f"{{:<{w}}}" for w in col_widths)
    print("Tabla de Símbolos:")
    print(line_fmt.format(*headers))
    print("-" * sum(col_widths))

    # Imprimimos filas
    for row in rows:
        print(line_fmt.format(*row))

def st_reset():
    """
    Vacía la pila de scopes y reinicia el contador de ubicaciones.
    """
    global _symtab_stack, location_counter
    _symtab_stack = []
    location_counter = 0