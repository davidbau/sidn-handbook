from urllib.parse import urljoin

def colab_link(relative_path, link_text=None):
    global pathname
    base_colab_url = 'https://colab.research.google.com/github/davidbau/sidn-handbook/blob/main/public'
    project_url = urljoin(pathname, relative_path)
    full_url = base_colab_url + project_url
    if link_text is None:
        return full_url
    return f'<a href="{full_url}">link_text</a>'
