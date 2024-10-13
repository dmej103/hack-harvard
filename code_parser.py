import os

def parse_code(path):
    code_data = []
    print(f"Searching for files in {path}")
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.html', '.css')):
                file_path = os.path.join(root, file)
                print(f"Found file: {file_path}")
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                code_data.append({
                    'file_path': file_path,
                    'content': content
                })
    print(f"Total files found: {len(code_data)}")
    return code_data
