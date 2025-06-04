# cgen.py - Code generation for MIPS assembly from AST
# Iker García German - Fernanda Cantu Ortega
# Victor Manuel de la Cueva
# 29 - 05 - 2025
from globalTypes import *
import symtab
from symtab import st_lookup, st_enter_scope, st_exit_scope

global label_count
label_count = 0

def new_label(prefix):
    """
    Generate a unique label with the given prefix.
    """
    global label_count
    lbl = f"{prefix}_{label_count}"
    label_count += 1
    return lbl

def codeGen(tree, filename):
    """
    Generate MIPS assembly code for the AST and write it to the specified file.
    """
    # tree: AST raíz; symtab poblada
    with open(filename, 'w') as out:
        emit(".data", out)
        if symtab._symtab_stack: # Asegurarse de que la pila no esté vacía
            for name, entry in symtab._symtab_stack[0].items():
                if not entry.is_func: # SymEntry has an attribute is_func
                    is_array = getattr(entry, 'is_array', False)
                    num_elements = getattr(entry, 'size', 1) if is_array else 1
                    if not is_array: # Doble chequeo para asegurar que num_elements es 1 para escalares
                        num_elements = 1
                    if is_array:
                        emit(f"{name}: .space {4 * num_elements}", out) # Reservar N*4 bytes para array[N]
                    else:
                        emit(f"{name}: .word 0", out) # Escalares globales inicializados a 0
        emit("", out)
        # Text segment
        emit(".text", out)
        emit(".globl main", out)
        emit("j main", out) # Salto incondicional a la etiqueta main
        genProgram(tree, out)

def emit(code, out):
    """
    Write an assembly instruction or directive to the output file.
    """
    out.write(code + '\n')

def genProgram(node, out):
    """
    Generate code for global declarations in the program AST.
    """
    decl = node
    while decl:
        if decl.nodekind == NodeKind.StmtK and decl.stmt == StmtKind.DeclK:
             genDecl(decl, out)
        decl = decl.sibling

def find_and_assign_local_offsets_recursive(statement_node, current_offset_ref, out_file_handle):
    """
    Recursively assign stack offsets to local variables and arrays.
    """
    curr = statement_node
    while curr:
        if curr.nodekind == NodeKind.StmtK:
            if curr.stmt == StmtKind.DeclK:
                entry = st_lookup(curr.name)
                # Check if it's a var and offset not already set (e.g., not a param)
                if entry and not entry.is_func and getattr(entry, 'offset_assigned_in_cgen', False) is False:
                    size = 4 * (getattr(entry, 'size', 1) if getattr(entry, 'is_array', False) else 1)
                    current_offset_ref[0] -= size
                    entry.offset = current_offset_ref[0] + size - 4 # Offset to the first element
                    entry.offset_assigned_in_cgen = True # Mark that cgen assigned offset
                elif not entry:
                    emit(f"# ERROR (find_local_offsets): Var {curr.name} not found by st_lookup.", out_file_handle)
            elif curr.stmt == StmtKind.CompoundK:
                st_enter_scope()
                find_and_assign_local_offsets_recursive(curr.child[0], current_offset_ref, out_file_handle) # Declarations
                find_and_assign_local_offsets_recursive(curr.child[1], current_offset_ref, out_file_handle) # Statements (for nested blocks)
                st_exit_scope()
            elif curr.stmt == StmtKind.IfK:
                # Process then-branch
                if curr.child[1]: # Check if child exists
                    if curr.child[1].nodekind == NodeKind.StmtK and curr.child[1].stmt == StmtKind.CompoundK:
                        st_enter_scope()
                        find_and_assign_local_offsets_recursive(curr.child[1].child[0], current_offset_ref, out_file_handle)
                        find_and_assign_local_offsets_recursive(curr.child[1].child[1], current_offset_ref, out_file_handle)
                        st_exit_scope()
                    else: # Single statement
                         find_and_assign_local_offsets_recursive(curr.child[1], current_offset_ref, out_file_handle)
                # Process else-branch
                if curr.child[2]: # Check if child exists
                    if curr.child[2].nodekind == NodeKind.StmtK and curr.child[2].stmt == StmtKind.CompoundK:
                        st_enter_scope()
                        find_and_assign_local_offsets_recursive(curr.child[2].child[0], current_offset_ref, out_file_handle)
                        find_and_assign_local_offsets_recursive(curr.child[2].child[1], current_offset_ref, out_file_handle)
                        st_exit_scope()
                    else: # Single statement
                        find_and_assign_local_offsets_recursive(curr.child[2], current_offset_ref, out_file_handle)
            elif curr.stmt == StmtKind.WhileK:
                if curr.child[1]: # Check if child exists
                    if curr.child[1].nodekind == NodeKind.StmtK and curr.child[1].stmt == StmtKind.CompoundK:
                        st_enter_scope()
                        find_and_assign_local_offsets_recursive(curr.child[1].child[0], current_offset_ref, out_file_handle)
                        find_and_assign_local_offsets_recursive(curr.child[1].child[1], current_offset_ref, out_file_handle)
                        st_exit_scope()
                    else: # Single statement
                        find_and_assign_local_offsets_recursive(curr.child[1], current_offset_ref, out_file_handle)
        curr = curr.sibling


def genDecl(node, out):
    """
    Generate MIPS code for a function, including prologue, body, and epilogue.
    This function was fixed and optimized with the help of GeminiAI
    """
    if node.child[1] is None and node.name != 'main':
        pass

    name = node.name
    emit(f"# función {name}", out)
    emit(f"{name}:", out)

    # ENTER SCOPE FOR THE ENTIRE FUNCTION (parameters and all locals)
    st_enter_scope()

    # Function prologue: save return address and frame pointer
    emit("addi $sp, $sp, -8", out)
    emit("sw $ra, 0($sp)", out)
    emit("sw $fp, 4($sp)", out)
    emit("addi $fp, $sp, 8", out)

    # --- Calculate offsets ---
    param_base_offset_val = -8
    current_offset_val = param_base_offset_val

    param_list_for_reg_copy = []
    # 1) Parámetros
    p_ast_node = node.child[0] # AST node for first parameter
    param_idx = 0
    while p_ast_node and p_ast_node.nodekind == NodeKind.StmtK and p_ast_node.stmt == StmtKind.DeclK:
        entry = st_lookup(p_ast_node.name) # Lookup in the function's scope
        if entry:
            current_offset_val -= 4 # Allocate 4 bytes for the parameter on stack
            entry.offset = current_offset_val # Assign offset
            entry.offset_assigned_in_cgen = True # Mark that cgen assigned offset
            param_list_for_reg_copy.append((param_idx, entry.offset))
        else:
            emit(f"# ERROR (genDecl): Parámetro {p_ast_node.name} no encontrado por st_lookup.", out)
        param_idx += 1
        p_ast_node = p_ast_node.sibling

    # Store current offset after parameters to a mutable list for pass-by-reference
    local_current_offset_ref = [current_offset_val]

    # 2) Variables locales (arrays incluidos) - Recursive scan
    if node.child[1]: # node.child[1] is the CompoundK representing the function body
        # The function body itself is a CompoundK. Its own scope will be entered by the recursive helper.
        st_enter_scope() # Scope for the main CompoundK body of the function
        find_and_assign_local_offsets_recursive(node.child[1].child[0], local_current_offset_ref, out) # Declarations
        find_and_assign_local_offsets_recursive(node.child[1].child[1], local_current_offset_ref, out) # Statements (for nested decls)
        st_exit_scope() # Exit scope for the main CompoundK body

    current_offset_val = local_current_offset_ref[0] # Update current_offset_val with result from recursive calls

    # Adjust final stack pointer for all locals and parameters
    stack_space_for_vars = abs(current_offset_val) - abs(param_base_offset_val)
    if stack_space_for_vars > 0:
        emit(f"addi $sp, $sp, -{stack_space_for_vars}", out)

    if name != 'main':
        for reg_idx, stack_off in param_list_for_reg_copy:
            if reg_idx < 4: # $a0, $a1, $a2, $a3
                emit(f"sw $a{reg_idx}, {stack_off}($fp)", out)

    # Generate code for the function body
    if node.child[1]: # node.child[1] is the CompoundK (body)
        genStmt(node.child[1], out)

    # Function epilogue: restore frame pointer and return
    if name != 'main':
        emit("move $sp, $fp", out)
        emit("lw $ra, -8($fp)", out)
        emit("lw $fp, -4($fp)", out)
        emit("jr $ra", out)
    else: # main
        emit("# final de main", out)
        emit("li $v0, 10", out)
        emit("syscall", out)

    st_exit_scope()

def genStmtList(node, out):
    """
    Generate code for a list of statements.
    """
    cur = node
    while cur:
        genStmt(cur, out)
        cur = cur.sibling

def genStmt(node, out):
    """
    Dispatch and generate code for a single statement node.
    """
    if node is None: return
    if not hasattr(node, 'nodekind') or node.nodekind != NodeKind.StmtK: return # Safer check

    kind = node.stmt
    if kind == StmtKind.DeclK:
        return

    if kind == StmtKind.AssignK: genAssign(node, out)
    elif kind == StmtKind.IfK: genIf(node, out)
    elif kind == StmtKind.WhileK: genWhile(node, out)
    elif kind == StmtKind.ReturnK: genReturn(node, out)
    elif kind == StmtKind.InputK: genInput(node, out)
    elif kind == StmtKind.OutputK: genOutput(node, out)
    elif kind == StmtKind.CompoundK:
        st_enter_scope()
        genStmtList(node.child[0], out) # Process declarations (mainly for further nested scopes)
        genStmtList(node.child[1], out) # Process statements
        st_exit_scope()
    else: emit(f"# stmt sin manejar: {kind}", out)

def genAssign(node, out):
    """
    Generate code for assignments to variables or array elements.
    """
    target_node = node.child[0]
    expr_node = node.child[1]

    # Evaluate right-hand side expression
    genExp(expr_node, out)
    emit("addi $sp, $sp, -4", out)
    emit("sw $a0, 0($sp)", out)

    # Determinar la dirección destino
    entry = st_lookup(target_node.name)
    if entry:
        base_offset = entry.offset
        is_array = getattr(entry, 'is_array', False)

        if is_array and target_node.child[0] is not None:
            idx_node = target_node.child[0]
            emit(f"# Asignación a array {target_node.name}[i]", out)
            # Evaluar expresión del índice 'i'
            genExp(idx_node, out)
            emit("move $t3, $a0", out)
            emit("sll $t1, $t3, 2", out)
            emit(f"addi $t0, $fp, {base_offset}", out)
            emit("sub $t2, $t0, $t1", out)
            emit("lw $a0, 0($sp)", out)
            # Store computed value into target variable or array
            emit(f"sw $a0, 0($t2)", out)
        elif not is_array:
            emit("lw $a0, 0($sp)", out)
            # Store computed value into target variable or array
            emit(f"sw $a0, {base_offset}($fp)", out)
        else: # Error: asignando a un nombre de array sin índice, o target_node.child[0] es None pero es array
            emit(f"# Error en AssignK: asignación inválida al array {target_node.name}", out)
        emit("addi $sp, $sp, 4", out) # Restaurar puntero de pila (desalojar valor guardado)
    else:
        emit(f"# Error en AssignK: variable {target_node.name} no encontrada", out)
        emit("addi $sp, $sp, 4", out) # Restaurar pila igualmente

def genIf(node, out):
    """
    Generate code for an if-then[-else] statement using labels.
    """
    else_lbl = new_label("else")
    end_lbl = new_label("endif")
    genExp(node.child[0], out)
    emit(f"beqz $a0, {else_lbl}", out)
    genStmt(node.child[1], out)
    emit(f"j {end_lbl}", out)
    emit(f"{else_lbl}:", out)
    if node.child[2]: genStmt(node.child[2], out)
    emit(f"{end_lbl}:", out)

def genWhile(node, out):
    """
    Generate code for a while loop using labels.
    """
    start_lbl = new_label("while_start")
    end_lbl = new_label("while_end")
    emit(f"{start_lbl}:", out)
    genExp(node.child[0], out)
    emit(f"beqz $a0, {end_lbl}", out)
    genStmt(node.child[1], out)
    emit(f"j {start_lbl}", out)
    emit(f"{end_lbl}:", out)

def genReturn(node, out):
    """
    Generate code for a return statement, moving the return value into $v0.
    """
    if node.child and node.child[0]:
        genExp(node.child[0], out)
        emit("move $v0, $a0", out)
    emit("# return statement processed, $v0 holds return value if any. Control flows to epilogue.", out)

def genInput(node, out):
    """
    Generate code for reading input and storing into a variable or array element.
    """
    emit("li $v0, 5", out)
    emit("syscall", out)
    emit("move $a0, $v0", out)
    # Similar a Assign, el target puede ser a[i]
    target_node = node.child[0]
    entry = st_lookup(target_node.name)
    if entry:
        base_offset = entry.offset
        is_array = getattr(entry, 'is_array', False)
        if is_array and target_node.child[0] is not None: # Target es a[i]
            idx_node = target_node.child[0]
            # Necesitamos guardar $a0 (valor leído) antes de evaluar el índice
            emit("addi $sp, $sp, -4", out)
            emit("sw $a0, 0($sp)", out) # Guardar valor leído
            genExp(idx_node, out) # Índice 'i' en $a0
            emit("move $t3, $a0", out) # i en $t3
            emit("sll $t1, $t3, 2", out)       # t1 = i*4
            emit(f"addi $t0, $fp, {base_offset}", out) # t0 = &a[0]
            emit("sub $t2, $t0, $t1", out)     # t2 = &a[i]
            emit("lw $a0, 0($sp)", out) # Recuperar valor leído a $a0
            emit("addi $sp, $sp, 4", out)
            emit(f"sw $a0, 0($t2)", out)       # Guardar en a[i]
        elif not is_array:
            emit(f"sw $a0, {base_offset}($fp)", out)
        else:
            emit(f"# Error en InputK: input a array {target_node.name} sin índice válido", out)
    else:
        emit(f"# Error en InputK: variable {target_node.name} no encontrada", out)

def genOutput(node, out):
    """
    Generate code for outputting a value via syscall.
    """
    genExp(node.child[0], out)
    emit("li $v0, 1", out)
    emit("syscall", out)
    emit("li $a0, 10", out)
    emit("li $v0, 11", out)
    emit("syscall", out)

def genExp(node, out):
    """
    Generate code to evaluate an expression and leave the result in $a0.
    """
    if node is None:
        emit("# Error: genExp recibió un nodo None", out)
        emit("li $a0, 0 # Defaulting $a0 due to None node in genExp", out) 
        return

    if node.nodekind != NodeKind.ExpK:
        emit(f"# Error: genExp recibió un nodo no-ExpK: {node.nodekind}", out)
        emit("li $a0, 0 # Defaulting $a0 due to non-ExpK node in genExp", out)
        return

    kind = node.exp 

    if kind == ExpKind.ConstK:
        emit(f"li $a0, {node.val}", out)
    elif kind == ExpKind.IdK:
        entry = st_lookup(node.name)
        if entry:
            base_offset_o_nombre = entry.offset if entry.scope != 'global' else node.name # Nombre para global, offset para local
            is_array = getattr(entry, 'is_array', False)
            idx_node = node.child[0]

            if entry.scope == 'global': # VARIABLE GLOBAL
                if is_array and idx_node is not None: # Global array element: arr[i]
                    genExp(idx_node, out) # Índice 'i' en $a0
                    emit("move $t3, $a0", out)
                    emit("sll $t1, $t3, 2", out)      # $t1 = i * 4
                    emit(f"la $t0, {node.name}", out) # $t0 = base address of global array
                    emit("add $t2, $t0, $t1", out)    # $t2 = &arr[i] (globals: base + offset)
                    emit(f"lw $a0, 0($t2)", out)
                elif is_array and idx_node is None: # Nombre de array global (dirección)
                    emit(f"la $a0, {node.name}", out)
                else: # Escalar global
                    emit(f"lw $a0, {node.name}", out)
            else: # VARIABLE LOCAL O PARÁMETRO (usa $fp)
                if base_offset_o_nombre is None: # Chequeo para el None que te da problemas
                    emit(f"# ERROR genExp: offset es None para {node.name}", out)
                    emit("li $a0, 0 # Error offset None", out)
                    return
                
                if is_array and idx_node is not None: # Local array element: arr[i]
                    genExp(idx_node, out)
                    emit("move $t3, $a0", out)
                    emit("sll $t1, $t3, 2", out)
                    emit(f"addi $t0, $fp, {base_offset_o_nombre}", out) # $t0 = &arr[0] (local)
                    emit("sub $t2, $t0, $t1", out) # $t2 = &arr[i] (stack: base - offset)
                    emit(f"lw $a0, 0($t2)", out)
                elif is_array and idx_node is None: # Nombre de array local (dirección de arr[0])
                    emit(f"addi $a0, $fp, {base_offset_o_nombre}", out)
                else: # Escalar local
                    emit(f"lw $a0, {base_offset_o_nombre}($fp)", out)
        else:
            emit(f"# Error en IdK: variable {node.name} no encontrada", out)
            emit(f"li $a0, 0 # Error variable {node.name} no encontrada", out)

    elif kind == ExpKind.OpK:
        genExp(node.child[0], out)
        emit("addi $sp, $sp, -4", out)
        emit("sw $a0, 0($sp)", out)
        genExp(node.child[1], out)
        emit("lw $t1, 0($sp)", out)
        emit("addi $sp, $sp, 4", out)
        
        op = node.op
        if op == TokenType.PLUS: emit("addu $a0, $t1, $a0", out)
        elif op == TokenType.MINUS: emit("subu $a0, $t1, $a0", out)
        elif op == TokenType.TIMES: emit("mul $a0, $t1, $a0", out)
        elif op == TokenType.OVER:
            emit("div $t1, $a0", out)
            emit("mflo $a0", out)
        elif op == TokenType.LT: emit("slt $a0, $t1, $a0", out)
        elif op == TokenType.LE: emit("sle $a0, $t1, $a0", out)
        elif op == TokenType.GT: emit("sgt $a0, $t1, $a0", out) 
        elif op == TokenType.GE: emit("sge $a0, $t1, $a0", out) 
        elif op == TokenType.EQ: emit("seq $a0, $t1, $a0", out) 
        elif op == TokenType.NE: emit("sne $a0, $t1, $a0", out) 
        else: emit(f"# op no implementada: {op}", out)
        # Nota: MIPS no tiene sle, sgt, sge, seq, sne directamente.
        # slt es real. Para las otras, se usan combinaciones de slt y beq/bne o xori.
        # Ejemplo para sle $a0, $t1, $a0 ($t1 <= $a0):
        #   sgt $a0, $t1, $a0  ($a0 = $t1 > $a0)
        #   xori $a0, $a0, 1   ($a0 = !($t1 > $a0) => $t1 <= $a0)
        # El ensamblador MARS puede simular algunas de estas pseudoinstrucciones.

    elif kind == ExpKind.CallK:
        args = []
        arg_node = node.child[0]
        while arg_node:
            args.append(arg_node)
            arg_node = arg_node.sibling
        num_args = len(args)

        emit(f"# Guardando $a0-$a3 del llamador antes de la llamada a {node.name}", out)
        emit("addi $sp, $sp, -16", out)
        emit("sw $a0, 0($sp)", out)
        emit("sw $a1, 4($sp)", out)
        emit("sw $a2, 8($sp)", out)
        emit("sw $a3, 12($sp)", out)
        
        for i in range(num_args - 1, -1, -1):
            genExp(args[i], out)
            emit("addi $sp, $sp, -4", out)
            emit("sw $a0, 0($sp)", out)
        
        for i in range(min(num_args, 4)):
            emit(f"lw $a{i}, {(num_args - 1 - i) * 4}($sp)", out) 
        
        if num_args > 0:
            emit(f"addi $sp, $sp, {4 * num_args}", out)

        emit(f"jal {node.name}", out)
        
        emit("move $t0, $v0", out) 

        emit(f"# Restaurando $a0-$a3 del llamador después de la llamada a {node.name}", out)
        emit(f"lw $a0, 0($sp)", out) # $sp ahora apunta a donde se guardaron los $a originales
        emit(f"lw $a1, 4($sp)", out)
        emit(f"lw $a2, 8($sp)", out)
        emit(f"lw $a3, 12($sp)", out)
        emit("addi $sp, $sp, 16", out)

        emit("move $a0, $t0", out)
    else:
        emit(f"# exp sin manejar: {kind}", out)
        emit("li $a0, 0 # Error exp no manejada", out)