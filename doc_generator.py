import os
import hashlib
from nlp_engine import detect_language
from code_extractor import extract_relevant_snippets

def generate_markdown(enhanced_docs, output_dir):
    generated_files = set()
    for doc in enhanced_docs:
        file_path = doc['file_path']
        file_name = os.path.basename(file_path)
        
        # Create a unique identifier for each file
        file_hash = hashlib.md5(file_path.encode()).hexdigest()[:8]
        unique_file_name = f"{file_name}_{file_hash}.md"
        
        output_path = os.path.join(output_dir, unique_file_name)
        
        try:
            with open(output_path, 'w') as f:
                f.write(f"# {file_name}\n\n")
                f.write(f"File path: {file_path}\n\n")
                f.write("## Explanation\n")
                f.write(doc['explanation'])
                f.write("\n\n")
                f.write("## Code Snippets\n")
                language = detect_language(file_path, doc['content'])
                snippets = extract_relevant_snippets(doc['content'], language)
                for i, snippet in enumerate(snippets, 1):
                    f.write(f"### Snippet {i}\n")
                    f.write(f"```{language.lower()}\n")
                    f.write(snippet)
                    f.write("\n```\n\n")
            generated_files.add(unique_file_name)
            print(f"Generated: {unique_file_name}")
        except Exception as e:
            print(f"Error generating markdown for {file_path}: {str(e)}")

    print(f"Generated {len(generated_files)} markdown files in {output_dir}")
    return generated_files
