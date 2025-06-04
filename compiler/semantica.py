# Analizador Semántico
# Autor: Iker Garcia German
# Fecha: 2025-05-14
from globalTypes import *
from symtab import *

Error = False
skip_simple_params = set()

# This stack is used to track the return types of functions during the symbol table pass
current_func_returns_for_tabla = [] 
check_pass_func_returns_stack = []

def tipo_error(t, message, expected_type=None):
    """
    Imprime el mensaje con línea y token, marca Error y
    para recuperación asigna el tipo esperado (si se indica).
    """
    global Error
    print(f"Línea {t.lineno}: {message}")
    Error = True
    if expected_type is not None:
        t.type = expected_type


def traverse(t, pre, post):
    if t is None:
        return
    pre(t)
    for c in t.child:
        traverse(c, pre, post)
    post(t)
    traverse(t.sibling, pre, post)


def insertar_nodo(t):
    """
    Inserta nodos en la tabla de símbolos.
    Se ejecuta en preorder.
    Usado by tabla()
    """
    global skip_simple_params, current_func_returns_for_tabla

    # Rechazar variables de tipo void
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.DeclK and t.child[1] is None and t.type == ExpType.Void:
        tipo_error(t, "Declaración de variable con tipo void no permitida")
        return

    # --- Función: DeclK con cuerpo en child[1] ---
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.DeclK and t.child[1] is not None: # Es una declaración de función
        param_names = []
        p_nodes_for_insertion = []
        
        p = t.child[0]
        while p and p.nodekind == NodeKind.StmtK and p.stmt == StmtKind.DeclK:
            param_names.append(p.name)
            p_nodes_for_insertion.append(p)
            p = p.sibling
        
        param_type_list = []
        for p_node in p_nodes_for_insertion:
            param_type_list.append(p_node.type)
            
        st_insert_func(t.name, t.lineno, t.type, param_type_list)
        
        st_enter_scope()
        
        for p_node in p_nodes_for_insertion:
            if not st_insert(p_node.name, p_node.lineno):
                 tipo_error(p_node, f"Parámetro '{p_node.name}' ya definido o error de inserción.")
            skip_simple_params.add(p_node.name)
        current_func_returns_for_tabla.append(t.type)
        return

    # --- Nuevo bloque compuesto { ... } ---
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.CompoundK:
        st_enter_scope()
        return

    # --- Declaraciones de variable (locales o globales fuera de funciones) ---
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.DeclK and t.child[1] is None:
        if t.name in skip_simple_params:
            skip_simple_params.remove(t.name)
            return

        array_size_from_parser = getattr(t, 'val', None)

        if array_size_from_parser is not None and isinstance(array_size_from_parser, int):
            if not st_insert_array(t.name, t.lineno, array_size_from_parser):
                tipo_error(t, f"Arreglo '{t.name}' ya definido en este scope")
        else:
            if not st_insert(t.name, t.lineno):
                tipo_error(t, f"Variable '{t.name}' ya definida en este scope")
        return

    # --- Uso de identificador ---
    if t.nodekind == NodeKind.ExpK and t.exp == ExpKind.IdK:
        entry = st_lookup(t.name)
        if entry is None:
            tipo_error(t, f"Uso de variable no declarada '{t.name}'", ExpType.Integer)
        else:
            if t.lineno not in entry.use_lines:
                entry.use_lines.append(t.lineno)
            if entry.is_func:
                t.type = entry.return_type
            elif entry.is_array:
                t.type = ExpType.Integer
            else:
                t.type = ExpType.Integer


def salir_nodo(t):
    """
    Cierra scopes abiertos en insertar_nodo. \n
    Comprueba tipos en postorder. \n
    Uses `check_pass_func_returns_stack` for return type checks.
    """
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.DeclK and t.child[1] is not None:
        st_exit_scope()
    elif t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.CompoundK:
        st_exit_scope()
        pass

    global check_pass_func_returns_stack # Ensure we are using the correct stack

    if t.nodekind == NodeKind.ExpK:
        if t.exp == ExpKind.OpK:
            l, r = t.child[0], t.child[1]
            if l.type != ExpType.Integer or r.type != ExpType.Integer:
                tipo_error(t, "Operador aplicado a no enteros", ExpType.Integer)
            t.type = ExpType.Integer
        elif t.exp == ExpKind.ConstK:
            t.type = ExpType.Integer
        elif t.exp == ExpKind.IdK:
            entry = st_lookup(t.name)
            if entry is not None:
                if entry.is_func:
                    tipo_error(t, f"Nombre de función '{t.name}' usado como variable.", ExpType.Integer)
                    t.type = entry.return_type
                elif entry.is_array:
                    if t.child[0] is not None: # Es a[i]
                        if t.child[0].type != ExpType.Integer:
                            tipo_error(t.child[0], f"Índice de arreglo '{t.name}' no es Integer", ExpType.Integer)
                        t.type = ExpType.Integer
                    else:
                        t.type = ExpType.Integer
                else:
                    t.type = ExpType.Integer
            else:
                t.type = ExpType.Integer
        elif t.exp == ExpKind.CallK:
            entry = st_lookup(t.name)
            if entry is None or not entry.is_func:
                tipo_error(t, f"Llamada a función no declarada '{t.name}'", ExpType.Integer)
                t.type = ExpType.Integer
            else:
                args = []
                p = t.child[0]
                while p:
                    args.append(p)
                    p = p.sibling
                if len(args) != len(entry.param_types):
                    tipo_error(t,
                               f"Función '{t.name}' espera {len(entry.param_types)} argumentos, se dieron {len(args)}",
                               entry.return_type)
                else:
                    for idx, (arg_node, expected_param_type) in enumerate(zip(args, entry.param_types), start=1):
                        if arg_node.type != expected_param_type:
                            tipo_error(arg_node,
                                       f"Argumento {idx} de '{t.name}' es de tipo incorrecto. Se esperaba {expected_param_type.name}, se obtuvo {arg_node.type.name if arg_node.type else 'None'}",
                                       expected_param_type)
                t.type = entry.return_type

    elif t.nodekind == NodeKind.StmtK:
        if t.stmt == StmtKind.IfK or t.stmt == StmtKind.WhileK:
            test_expr_node = t.child[0]
            if test_expr_node is None or test_expr_node.type != ExpType.Integer:
                tipo_error(test_expr_node or t, f"Condición de {t.stmt.name.lower()} debe ser de tipo Integer", ExpType.Integer)
        elif t.stmt == StmtKind.AssignK:
            if t.child[0] is None or t.child[1] is None:
                tipo_error(t, "Asignación con operando faltante", ExpType.Void)
                return
            
            lhs = t.child[0]
            rhs = t.child[1]

            if lhs.type != ExpType.Integer:
                 tipo_error(lhs, f"Lado izquierdo de la asignación debe evaluarse a Integer (variable o elemento de array)", ExpType.Integer)
            if rhs.type != ExpType.Integer:
                 tipo_error(rhs, f"Lado derecho de la asignación debe evaluarse a Integer", ExpType.Integer)
            
            if lhs.nodekind == NodeKind.ExpK and lhs.exp == ExpKind.IdK:
                pass
            else:
                tipo_error(lhs, "Lado izquierdo de asignación debe ser una variable o elemento de arreglo (L-value)", ExpType.Integer)

        elif t.stmt == StmtKind.OutputK:
            if t.child[0] is None or t.child[0].type != ExpType.Integer:
                tipo_error(t.child[0] or t, "Output espera una expresión de tipo Integer", ExpType.Integer)
        elif t.stmt == StmtKind.InputK:
            target_node = t.child[0]
            if target_node is None:
                tipo_error(t, "Input espera una variable o elemento de arreglo como argumento", ExpType.Void)
            elif not (target_node.nodekind == NodeKind.ExpK and target_node.exp == ExpKind.IdK):
                 tipo_error(target_node, "Argumento de input debe ser una variable o elemento de arreglo (L-value)", ExpType.Integer)
            elif target_node.type != ExpType.Integer:
                 tipo_error(target_node, "Variable/elemento de arreglo para input debe ser de tipo Integer", ExpType.Integer)

        elif t.stmt == StmtKind.ReturnK:
            expected_return_type = check_pass_func_returns_stack[-1] if check_pass_func_returns_stack else ExpType.Void
            return_expr_node = t.child[0]

            if expected_return_type == ExpType.Void:
                if return_expr_node is not None:
                    tipo_error(t, "Función void no debe retornar un valor")
            else: # Espera Integer
                if return_expr_node is None:
                    tipo_error(t, "Función no-void debe retornar un valor Integer")
                elif return_expr_node.type != ExpType.Integer:
                    tipo_error(return_expr_node, f"Tipo de valor retornado no coincide con la declaración de la función (se esperaba {expected_return_type.name})", ExpType.Integer)


def tabla(tree, imprime=True):
    global current_func_returns_for_tabla
    current_func_returns_for_tabla = [] # Reset for tabla pass

    st_reset()
    st_enter_scope()
    init_builtins()

    traverse(tree, insertar_nodo, lambda t: None)

    if imprime:
        print("=== Tablas de símbolos ===")
        printSymTab() # Prints with all scopes still in _symtab_stack

# --- Helper functions for the second pass (type checking pass) ---
def pre_check_pass(t):
    """Pre-order visitor for the type checking pass."""
    global check_pass_func_returns_stack
    # If entering a function, push its return type (from AST node) to the dedicated stack
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.DeclK and t.child[1] is not None:
        check_pass_func_returns_stack.append(t.type)

def combined_post_check_pass(t):
    """Combined post-order visitor for the type checking pass."""
    global check_pass_func_returns_stack

    # If exiting a function, pop its return type from the dedicated stack
    if t.nodekind == NodeKind.StmtK and t.stmt == StmtKind.DeclK and t.child[1] is not None: 
        if check_pass_func_returns_stack:
            check_pass_func_returns_stack.pop()
            
def semantica(tree, imprime=True):
    """Driver semántico: tabla + chequeo de tipos con recuperación."""
    global Error, check_pass_func_returns_stack
    Error = False # Reset global error flag
    check_pass_func_returns_stack = [] # Ensure the stack is clear before use

    # Pass 1: Build symbol table and print it (scopes remain open for printing as per original logic)
    tabla(tree, imprime)

    # Check for 'main' function declaration properties after building table
    # This check uses the AST node's type attribute directly, which parser sets.
    last_decl = tree
    if last_decl: # Ensure tree is not empty
        while last_decl.sibling:
            last_decl = last_decl.sibling
        if not (last_decl.nodekind == NodeKind.StmtK
                and last_decl.stmt == StmtKind.DeclK
                and last_decl.name == "main"
                and last_decl.child[1] is not None # It's a function
                and last_decl.type == ExpType.Void): # Check its type from AST
            tipo_error(last_decl, "Última declaración debe ser función 'main' de tipo void")
    else:
        print("Error: Árbol sintáctico vacío.") # Or handle as appropriate


    # Pass 2: Type checking using its own traversal context for function return types
    traverse(tree, pre_check_pass, combined_post_check_pass)

    if not Error:
        print("¡Sin errores semánticos detectados!")