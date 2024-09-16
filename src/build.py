"""
Static Website Generator, by Claude-3

This script generates a static website by processing HTML
 templates and Python modules.

Usage:
  python build.py [-s SOURCE_DIR] [-t TARGET_DIR]

  -s, --source SOURCE_DIR   Source directory containing HTML
                            templates and Python modules (default: ./)
  -t, --target TARGET_DIR   Target directory for the generated
                            website (default: ../public)

File formats and directory layout:
  - HTML templates: Files with the .html extension. Unlike a regular
    HTML file, if they contain a curly brace {...} with valid python
    code, then they are run, so that functions can be called to
    produce the content which is copied to the target directory.
    (Each HTML file is actually expanded as it were the contents
    of a python f-string.)
  - Python modules: Files with the .py extension can define python
    functions that can be called within HTML templates.  If there
    are multiple .py files, all them are compiled into a single
    unified namespace in which all the html files are run.  (This
    script itself is omitted.)
  - Any other files (e.g., CSS, JavaScript, images) will be copied as-is

Example directory layout:
  ./src/
    |- index.html
    |- about.html
    |- functions.py
    |- static/
         |- style.css
         |- script.js
         |- images/
              |- logo.png

The script will process the HTML templates, expand them using the Python
functions defined in the modules, and generate the static website in the
target directory. The generated website will have the same directory
structure as the source directory.
"""

import os
import shutil
import sys
import argparse
import re

# Function to load Python modules from the current directory into the script's namespace
def load_modules(src_dir):
    namespace = {}
    script_name = os.path.basename(sys.argv[0])
    for file in os.listdir(src_dir):
        if file.endswith(".py") and file != script_name:
            with open(file, 'r') as f:
                # Compile and execute the module code within the namespace
                # This allows the functions defined in the modules to access global variables
                code = compile(f.read(), file, 'exec')
                exec(code, namespace)
    return namespace

# Function to escape triple quotes in the template
def escape_triple_quotes(template):
    return template.replace('"""', '\\"\\"\\"')

# Function to escape {} inside Latex / mathjax-looking \[ eqs \] and \( eqs \)
def escape_latex_braces(text):
    for start, end, pattern in [('\\[', '\\]', r'(?s)\\\[(.*?)\\\]'),
                                ('\\(', '\\)', r'(?s)\\\((.*?)\\\)')]:
        runs = re.split(pattern, text)
        for i in range(1, len(runs), 2):
           runs[i] = start + runs[i].replace('{', '{{').replace('}', '}}') + end
        text = ''.join(runs)
    return text

# Function to expand HTML templates using the loaded namespace
def expand_template(template, namespace, pathname):
    namespace['pathname'] = pathname
    escaped_template = escape_triple_quotes(template)
    escaped_template = escape_latex_braces(template)
    try:
        # Evaluate the template as an f-string within the namespace
        return eval(f'rf"""{escaped_template}"""', namespace)
    except (SyntaxError):
        # Return the original template if an error occurs during evaluation
        return template
    except (NameError, TypeError, ZeroDivisionError) as e:
        print(f'Ignoring error in {pathname}:', e)
        print(escaped_template)
        return template

# Function to generate the static website recursively
def generate_website(src_dir, dest_dir, namespace, base_dir):
    # Create the output directory if it doesn't exist
    os.makedirs(dest_dir, exist_ok=True)

    # Process files and directories
    for item in os.listdir(src_dir):
        src_path = os.path.join(src_dir, item)
        dest_path = os.path.join(dest_dir, item)

        if os.path.isfile(src_path):
            if item.endswith(".html"):
                with open(src_path, "r") as f:
                    template = f.read()
                # Calculate the relative path from the original source directory
                relative_path = os.path.relpath(src_path, base_dir)
                pathname = os.path.join('/', relative_path)
                expanded_html = expand_template(template, namespace, pathname)
                with open(dest_path, "w") as f:
                    f.write(expanded_html)
            elif not item.endswith(".py"):
                # Copy non-Python files as-is
                shutil.copy2(src_path, dest_path)
        elif os.path.isdir(src_path):
            # Recursively process subdirectories
            generate_website(src_path, dest_path, namespace, base_dir)

# Run the website generation
def main():
    # Parse command-line arguments using argparse
    parser = argparse.ArgumentParser(description='Static website generator')
    parser.add_argument('-s', '--source', default='./', help='Source directory')
    parser.add_argument('-t', '--target', default='../public', help='Target directory')
    args = parser.parse_args()

    # Load Python modules into the script's namespace
    namespace = load_modules(args.source)

    # Generate the static website recursively
    generate_website(args.source, args.target, namespace, args.source)

    print("Static website generated successfully!")

if __name__ == "__main__":
    main()
