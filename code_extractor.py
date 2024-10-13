import ast
import re

def extract_relevant_snippets(content, language):
    if language.lower() in ['javascript', 'typescript']:
        return extract_js_snippets(content)
    elif language.lower() == 'python':
        return extract_python_snippets(content)
    elif language.lower() == 'css':
        return extract_css_snippets(content)
    else:
        return extract_generic_snippets(content)

def extract_js_snippets(content):
    snippets = []
    # Pattern to match function and class declarations, including async functions and arrow functions
    pattern = r'((?:export\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+\w+\s*(?:\([^)]*\))?\s*{?(?:\s*=>)?(?:\s*{)?(?:\s*\n(?:(?!\n\s*\n).)*)?)'
    matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
    for match in matches:
        snippet = match.group(1).strip()
        # If the snippet is a function or class, include a bit more context
        if re.match(r'(function|class|=>)', snippet):
            # Include up to 5 non-empty lines after the declaration
            lines = snippet.split('\n')
            additional_lines = [line for line in content[match.end():].split('\n') if line.strip()][:5]
            snippet = '\n'.join(lines + additional_lines)
        snippets.append(snippet)
    return snippets

def extract_python_snippets(content):
    snippets = []
    try:
        tree = ast.parse(content)
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.AsyncFunctionDef)):
                snippets.append(f"def {node.name}({ast.unparse(node.args)}):" if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) else f"class {node.name}:")
    except SyntaxError:
        # If parsing fails, fall back to regex
        pattern = r'((?:async\s+)?(?:def|class)\s+\w+\s*(?:\([^)]*\))?:)'
        snippets = re.findall(pattern, content)
    return snippets

def extract_css_snippets(content):
    # Extract CSS rule selectors
    pattern = r'([^{]+)\s*{'
    return re.findall(pattern, content)

def extract_generic_snippets(content):
    # For other languages, extract lines that look like declarations
    pattern = r'^[^=;{}()]+[{(]'
    return re.findall(pattern, content, re.MULTILINE)
