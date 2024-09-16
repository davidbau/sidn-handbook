from urllib.parse import urljoin

def img(relative_path, width=50):
    return f'<img src="{relative_path}" style="max-width:{width}%; width:{width * 10}px;" class="mx-auto d-block">'
