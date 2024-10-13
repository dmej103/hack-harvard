import click
from code_parser import parse_code
from nlp_engine import generate_contextual_explanations
from doc_generator import generate_markdown
import os
import shutil
from git import Repo
import traceback

@click.command()
@click.option('--repo', help='GitHub repository URL')
@click.option('--path', help='Local path to code directory')
@click.option('--output', default='./docs', help='Output directory for the generated documentation')
def docgen(repo, path, output):
    local_repo_path = None

    try:
        # Step 1: Clone or Parse
        if repo:
            local_repo_path = './temp_repo'
            click.echo(f'Cloning repository from {repo}...')
            
            # Remove existing directory if it exists
            if os.path.exists(local_repo_path):
                shutil.rmtree(local_repo_path)
            
            Repo.clone_from(repo, local_repo_path)
            path = local_repo_path

            # Print contents of cloned repository
            click.echo("Contents of cloned repository:")
            for root, dirs, files in os.walk(path):
                level = root.replace(path, '').count(os.sep)
                indent = ' ' * 4 * level
                click.echo(f'{indent}{os.path.basename(root)}/')
                subindent = ' ' * 4 * (level + 1)
                for f in files:
                    click.echo(f'{subindent}{f}')
        
        if path:
            click.echo(f'Parsing code from {path}...')
            code_data = parse_code(path)
            click.echo(f'Parsed {len(code_data)} files/modules')
        else:
            raise ValueError("No path or repository provided")
        
        # Step 2: Generate Explanations
        click.echo('Generating enhanced explanations...')
        enhanced_docs = generate_contextual_explanations(code_data)
        click.echo(f'Generated explanations for {len(enhanced_docs)} files/modules')
        
        # Step 3: Generate Markdown Files
        click.echo(f'Generating documentation in {output}...')
        os.makedirs(output, exist_ok=True)
        generated_files = generate_markdown(enhanced_docs, output)
        click.echo('Documentation generation completed!')
        click.echo(f'Contents of {output}:')
        for file in sorted(generated_files):
            click.echo(f'    {file}')

    except Exception as e:
        click.echo(f"An error occurred: {str(e)}")
        click.echo(traceback.format_exc())
    finally:
        # Step 4: Cleanup
        if local_repo_path:
            cleanup_temp_directory(local_repo_path)

def cleanup_temp_directory(directory):
    """Deletes the specified temporary directory."""
    try:
        shutil.rmtree(directory)
        print(f"Temporary directory {directory} has been removed.")
    except Exception as e:
        print(f"Failed to remove temporary directory {directory}: {e}")


if __name__ == '__main__':
    docgen()
